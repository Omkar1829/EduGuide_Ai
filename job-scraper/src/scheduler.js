import cron from 'node-cron';
import config from './config.js';
import { createLogger } from './utils/logger.js';
import { runScrapers, getScrapersStatus } from './index.js';

const logger = createLogger('scheduler');

let scheduledTask = null;
let isRunning = false;
let lastRunTime = null;
let nextRunTime = null;
let runHistory = [];

export function startScheduler() {
  const cronExpression = config.schedule.cronExpression;
  
  if (!cron.validate(cronExpression)) {
    logger.error(`Invalid cron expression: ${cronExpression}`);
    throw new Error(`Invalid cron expression: ${cronExpression}`);
  }

  logger.info(`Starting scheduler with cron: ${cronExpression}`);
  
  scheduledTask = cron.schedule(cronExpression, async () => {
    if (isRunning) {
      logger.warn('Scrape already in progress, skipping this run');
      return;
    }

    isRunning = true;
    const startTime = Date.now();
    
    logger.info('Scheduled scrape starting...');

    try {
      const result = await runScrapers();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      lastRunTime = new Date();
      
      runHistory.push({
        startTime: new Date(startTime),
        endTime: lastRunTime,
        duration: `${duration}s`,
        success: true,
        result,
      });

      if (runHistory.length > 50) {
        runHistory = runHistory.slice(-50);
      }

      logger.info(`Scrape completed in ${duration}s`);
      logger.info(`Inserted: ${result.inserted}, Updated: ${result.updated}, Failed: ${result.failed}`);
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      lastRunTime = new Date();
      
      runHistory.push({
        startTime: new Date(startTime),
        endTime: lastRunTime,
        duration: `${duration}s`,
        success: false,
        error: error.message,
      });

      logger.error(`Scrape failed after ${duration}s: ${error.message}`);
    } finally {
      isRunning = false;
      updateNextRunTime();
    }
  }, {
    scheduled: true,
    timezone: 'America/New_York',
  });

  updateNextRunTime();
  logger.info('Scheduler started successfully');
  
  return {
    cron: cronExpression,
    nextRun: nextRunTime,
  };
}

function updateNextRunTime() {
  // Approximate next run time based on cron expression
  const now = new Date();
  const cronExpression = config.schedule.cronExpression;
  
  // Simple approximation for common cron patterns
  if (cronExpression === '0 */6 * * *') {
    // Every 6 hours
    nextRunTime = new Date(now.getTime() + 6 * 60 * 60 * 1000);
  } else if (cronExpression === '0 */12 * * *') {
    // Every 12 hours
    nextRunTime = new Date(now.getTime() + 12 * 60 * 60 * 1000);
  } else if (cronExpression === '0 0 * * *') {
    // Daily at midnight
    nextRunTime = new Date(now);
    nextRunTime.setDate(nextRunTime.getDate() + 1);
    nextRunTime.setHours(0, 0, 0, 0);
  } else {
    // Default: next hour
    nextRunTime = new Date(now.getTime() + 60 * 60 * 1000);
  }
}

export function stopScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    logger.info('Scheduler stopped');
  }
}

export function getStatus() {
  const scrapersStatus = getScrapersStatus();
  
  return {
    isRunning,
    lastRunTime,
    nextRunTime,
    cronExpression: config.schedule.cronExpression,
    runHistory: runHistory.slice(-10),
    scrapers: scrapersStatus,
  };
}

export async function triggerImmediateRun() {
  if (isRunning) {
    logger.warn('Scrape already in progress');
    return { success: false, message: 'Scrape already in progress' };
  }

  isRunning = true;
  const startTime = Date.now();
  
  logger.info('Manual scrape triggered');

  try {
    const result = await runScrapers();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    lastRunTime = new Date();
    
    runHistory.push({
      startTime: new Date(startTime),
      endTime: lastRunTime,
      duration: `${duration}s`,
      success: true,
      result,
      manual: true,
    });

    logger.info(`Manual scrape completed in ${duration}s`);
    
    return {
      success: true,
      duration: `${duration}s`,
      result,
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    lastRunTime = new Date();
    
    runHistory.push({
      startTime: new Date(startTime),
      endTime: lastRunTime,
      duration: `${duration}s`,
      success: false,
      error: error.message,
      manual: true,
    });

    logger.error(`Manual scrape failed after ${duration}s: ${error.message}`);
    
    return {
      success: false,
      error: error.message,
    };
  } finally {
    isRunning = false;
  }
}

export function getRunHistory(limit = 10) {
  return runHistory.slice(-limit);
}

export default {
  startScheduler,
  stopScheduler,
  getStatus,
  triggerImmediateRun,
  getRunHistory,
};
