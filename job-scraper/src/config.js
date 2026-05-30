import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenvConfig({ path: join(__dirname, '..', '.env') });

const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  scraper: {
    rateLimitDelay: parseInt(process.env.RATE_LIMIT_DELAY || '2000', 10),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.RETRY_DELAY || '5000', 10),
    maxPages: parseInt(process.env.MAX_PAGES || '5', 10),
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
    userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    proxy: {
      http: process.env.HTTP_PROXY || null,
      https: process.env.HTTPS_PROXY || null,
    },
  },
  schedule: {
    cronExpression: process.env.SCRAPE_INTERVAL || '0 */6 * * *',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;
