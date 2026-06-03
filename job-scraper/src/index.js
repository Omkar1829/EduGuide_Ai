import config from './config.js';
import { createLogger, logger as globalLogger } from './utils/logger.js';
import { deduplicateJobs } from './utils/cleaner.js';
import { insertJobs, getJobStats, getUniqueUserLocations, disconnect } from './database/db.js';
import { startScheduler, stopScheduler, getStatus, triggerImmediateRun } from './scheduler.js';
import { IndeedScraper } from './scrapers/indeed.js';
import { LinkedInScraper } from './scrapers/linkedin.js';
import { NaukriScraper } from './scrapers/naukri.js';

const logger = createLogger('main');

const scrapers = {
  indeed: new IndeedScraper(),
  linkedin: new LinkedInScraper(),
  naukri: new NaukriScraper(),
};

const searchQueries = [
  { query: 'software engineer', location: '' },
  { query: 'web developer', location: '' },
  { query: 'data scientist', location: '' },
  { query: 'product manager', location: '' },
  { query: 'ux designer', location: '' },
  { query: 'devops engineer', location: '' },
  { query: 'full stack developer', location: '' },
  { query: 'machine learning engineer', location: '' },
  { query: 'frontend developer', location: '' },
  { query: 'backend developer', location: '' },
];

export async function runScrapers(customLocations = null, customKeyword = null, maxPagesOverride = null) {
  const results = {
    inserted: 0,
    updated: 0,
    failed: 0,
    totalScraped: 0,
    bySource: {},
  };

  logger.info('Starting scrape run...');
  const userLocations = customLocations && customLocations.length > 0 ? customLocations : await getUniqueUserLocations();
  logger.info(`Target locations: ${JSON.stringify(userLocations)}`);

  const activeQueries = customKeyword ? [{ query: customKeyword, location: '' }] : searchQueries;
  const maxPages = maxPagesOverride ? parseInt(maxPagesOverride) : config.scraper.maxPages;

  for (const [source, scraper] of Object.entries(scrapers)) {
    logger.info(`\n--- Scraping ${source.toUpperCase()} ---`);
    
    let sourceJobs = [];
    
    for (const search of activeQueries) {
      for (const loc of userLocations) {
        try {
          logger.info(`Searching "${search.query}" in "${loc}" on ${source}...`);
          const jobs = await scraper.scrape(search.query, loc, maxPages);
          sourceJobs.push(...jobs);
          // Emit progress marker for backend spawn tracking
          console.log(`PROGRESS_UPDATE: {"source": "${source}", "scrapedCount": ${sourceJobs.length}, "currentSearch": "${search.query}", "currentLoc": "${loc}"}`);
          logger.info(`Found ${jobs.length} jobs for "${search.query}" in "${loc}" on ${source}`);
        } catch (error) {
          logger.error(`Error scraping ${source} for "${search.query}" in "${loc}": ${error.message}`);
          results.failed++;
        }
      }
    }

    const deduplicated = deduplicateJobs(sourceJobs);
    logger.info(`After dedup: ${deduplicated.length} jobs from ${source}`);

    if (deduplicated.length > 0) {
      try {
        const insertResult = await insertJobs(deduplicated);
        results.inserted += insertResult.inserted;
        results.failed += insertResult.errors?.length || 0;
        results.bySource[source] = {
          scraped: sourceJobs.length,
          deduplicated: deduplicated.length,
          inserted: insertResult.inserted,
        };
        console.log(`PROGRESS_UPDATE: {"source": "${source}", "insertedCount": ${results.inserted}, "failedCount": ${results.failed}}`);
      } catch (error) {
        logger.error(`Error inserting jobs from ${source}: ${error.message}`);
        results.failed++;
      }
    }

    results.totalScraped += sourceJobs.length;
  }

  logger.info('\n--- Scrape Run Complete ---');
  logger.info(`Total scraped: ${results.totalScraped}`);
  logger.info(`Inserted: ${results.inserted}`);
  logger.info(`Failed: ${results.failed}`);

  return results;
}

export function getScrapersStatus() {
  const status = {};
  for (const [name, scraper] of Object.entries(scrapers)) {
    status[name] = scraper.getStats();
  }
  return status;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'start';

  try {
    switch (command) {
      case 'start':
        logger.info('Starting EduGuide AI Job Scraper');
        
        const schedulerInfo = startScheduler();
        logger.info(`Scheduler started with cron: ${schedulerInfo.cron}`);
        logger.info(`Next run: ${schedulerInfo.nextRun}`);
        
        logger.info('\nAvailable commands:');
        logger.info('  npm run start     - Start the scheduler');
        logger.info('  npm run scrape    - Run scrapers once');
        logger.info('  npm run schedule  - Start the scheduler');
        
        process.on('SIGINT', async () => {
          logger.info('\nShutting down...');
          stopScheduler();
          await disconnect();
          process.exit(0);
        });
        
        process.on('SIGTERM', async () => {
          logger.info('\nShutting down...');
          stopScheduler();
          await disconnect();
          process.exit(0);
        });
        
        break;

      case 'scrape':
        logger.info('Running scrapers once...');
        const locationArg = args[1] ? [args[1]] : null;
        const keywordArg = args[2] || null;
        const limitArg = args[3] ? parseInt(args[3]) : null;
        const result = await runScrapers(locationArg, keywordArg, limitArg);
        logger.info('Scrape complete:', JSON.stringify(result, null, 2));
        await disconnect();
        break;

      case 'status':
        const status = getStatus();
        console.log(JSON.stringify(status, null, 2));
        await disconnect();
        break;

      case 'stats':
        const stats = await getJobStats();
        console.log(JSON.stringify(stats, null, 2));
        await disconnect();
        break;

      case 'trigger':
        logger.info('Triggering immediate run...');
        const triggerResult = await triggerImmediateRun();
        console.log(JSON.stringify(triggerResult, null, 2));
        await disconnect();
        break;

      default:
        console.log('Unknown command:', command);
        console.log('Available commands: start, scrape, status, stats, trigger');
        process.exit(1);
    }
  } catch (error) {
    logger.error('Fatal error:', error);
    await disconnect();
    process.exit(1);
  }
}

main();

export default {
  runScrapers,
  getScrapersStatus,
  scrapers,
};
