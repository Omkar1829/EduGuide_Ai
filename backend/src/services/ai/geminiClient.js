const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../../config");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RATE_LIMIT_MS = 1000;

class GeminiClient {
  constructor() {
    if (!config.gemini.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    this.lastRequestTime = 0;
  }

  async _enforceRateLimit() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < RATE_LIMIT_MS) {
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  async _retryWithBackoff(fn) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this._enforceRateLimit();
        return await fn();
      } catch (err) {
        lastError = err;
        const isRetryable =
          err.status === 429 ||
          err.status === 500 ||
          err.status === 503 ||
          err.message?.includes("ECONNRESET") ||
          err.message?.includes("ETIMEDOUT");

        if (!isRetryable || attempt === MAX_RETRIES) {
          throw err;
        }

        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(
          `[GeminiClient] Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}. Retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  _validateResponse(result) {
    if (!result || !result.response) {
      throw new Error("Empty response received from Gemini API");
    }
    const text = result.response.text();
    if (!text || text.trim().length === 0) {
      throw new Error("Gemini API returned empty text");
    }
    return text;
  }

  async generateContent(prompt) {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string");
    }

    const result = await this._retryWithBackoff(async () => {
      return this.model.generateContent(prompt);
    });

    return this._validateResponse(result);
  }

  async generateStructuredJSON(prompt, schema = null) {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string");
    }

    const generationConfig = {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    };

    if (schema) {
      generationConfig.responseMimeType = "application/json";
      generationConfig.responseSchema = schema;
    } else {
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown fences, no explanations, no text before or after the JSON.`;
      const result = await this._retryWithBackoff(async () => {
        return this.model.generateContent({
          contents: [{ role: "user", parts: [{ text: jsonPrompt }] }],
          generationConfig,
        });
      });

      const text = this._validateResponse(result);
      return this._parseJSONResponse(text);
    }

    const result = await this._retryWithBackoff(async () => {
      return this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });
    });

    const text = this._validateResponse(result);
    return this._parseJSONResponse(text);
  }

  _parseJSONResponse(text) {
    let cleaned = text.trim();

    const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
      cleaned = jsonBlockMatch[1].trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch (firstError) {
      const jsonStart = cleaned.indexOf("{");
      const jsonArrayStart = cleaned.indexOf("[");
      const startIndex =
        jsonStart === -1
          ? jsonArrayStart
          : jsonArrayStart === -1
            ? jsonStart
            : Math.min(jsonStart, jsonArrayStart);

      if (startIndex === -1) {
        throw new Error("No JSON object found in response");
      }

      const jsonEnd = cleaned.lastIndexOf("}");
      const jsonArrayEnd = cleaned.lastIndexOf("]");
      const endIndex =
        jsonEnd === -1
          ? jsonArrayEnd
          : jsonArrayEnd === -1
            ? jsonEnd
            : Math.max(jsonEnd, jsonArrayEnd);

      if (endIndex === -1 || endIndex < startIndex) {
        throw new Error("Could not determine JSON boundaries in response");
      }

      const jsonSubstring = cleaned.substring(startIndex, endIndex + 1);
      try {
        return JSON.parse(jsonSubstring);
      } catch (secondError) {
        throw new Error(
          `Failed to parse JSON from AI response: ${firstError.message}`
        );
      }
    }
  }
}

let instance = null;

const getGeminiClient = () => {
  if (!instance) {
    instance = new GeminiClient();
  }
  return instance;
};

module.exports = { getGeminiClient, GeminiClient };
