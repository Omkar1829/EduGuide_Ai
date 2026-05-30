import { runScrapers } from './index.js';
import { createLogger } from './utils/logger.js';
import { disconnect } from './database/db.js';

const logger = createLogger('scrape-once');

async function main() {
  logger.info('Running scrapers once...');
  
  try {
    const result = await runScrapers();
    logger.info('Scrape complete:', JSON.stringify(result, null, 2));
  } catch (error) {
    logger.error('Scrape failed:', error);
    process.exitCode = 1;
  } finally {
    await disconnect();
  }
}

main();
