import axios from 'axios';
import config from '../config.js';
import { createLogger } from '../utils/logger.js';

export class BaseScraper {
  constructor(name) {
    this.name = name;
    this.logger = createLogger(name);
    this.lastRequestTime = 0;
    this.requestCount = 0;
    this.axiosInstance = axios.create({
      timeout: config.scraper.requestTimeout,
      headers: this.getHeaders(),
      proxy: config.scraper.proxy.http ? {
        host: new URL(config.scraper.proxy.http).hostname,
        port: new URL(config.scraper.proxy.http).port,
        protocol: new URL(config.scraper.proxy.http).protocol.replace(':', ''),
      } : undefined,
    });
  }

  getHeaders() {
    return {
      'User-Agent': config.scraper.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
    };
  }

  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < config.scraper.rateLimitDelay) {
      const delay = config.scraper.rateLimitDelay - timeSinceLastRequest;
      this.logger.debug(`Rate limiting: waiting ${delay}ms`);
      await this.sleep(delay);
    }
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async fetchPage(url, retries = config.scraper.maxRetries) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.rateLimit();
        this.logger.debug(`Fetching: ${url} (attempt ${attempt}/${retries})`);
        
        const response = await this.axiosInstance.get(url);
        
        if (response.status === 200) {
          this.logger.debug(`Successfully fetched: ${url}`);
          return response.data;
        }
        
        this.logger.warn(`Unexpected status ${response.status} for ${url}`);
        
        if (response.status === 429) {
          this.logger.warn('Rate limited by server, backing off...');
          await this.sleep(config.scraper.retryDelay * attempt);
          continue;
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        this.logger.error(`Attempt ${attempt}/${retries} failed for ${url}: ${error.message}`);
        
        if (attempt === retries) {
          throw error;
        }
        
        const backoffDelay = config.scraper.retryDelay * attempt;
        this.logger.info(`Retrying in ${backoffDelay}ms...`);
        await this.sleep(backoffDelay);
      }
    }
  }

  async scrape() {
    throw new Error('scrape() method must be implemented by subclass');
  }

  getStats() {
    return {
      name: this.name,
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime ? new Date(this.lastRequestTime).toISOString() : null,
    };
  }
}

export default BaseScraper;
