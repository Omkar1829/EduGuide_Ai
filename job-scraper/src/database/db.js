import { PrismaClient } from '@prisma/client';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('database');

let prisma;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    prisma.$on('query', (e) => {
      logger.debug(`Query: ${e.query} Duration: ${e.duration}ms`);
    });

    prisma.$on('error', (e) => {
      logger.error(`Prisma Error: ${e.message}`);
    });
  }
  return prisma;
}

export async function insertJobs(jobs) {
  const client = getPrismaClient();
  
  if (!jobs || jobs.length === 0) {
    logger.info('No jobs to insert');
    return { inserted: 0, skipped: 0 };
  }

  logger.info(`Attempting to insert ${jobs.length} jobs`);

  let inserted = 0;
  let skipped = 0;
  const errors = [];

  const batchSize = 50;
  
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    
    for (const job of batch) {
      try {
        if (!job.url) {
          const existingByTitle = await client.job.findFirst({
            where: {
              title: job.title,
              company: job.company,
            },
          });

          if (existingByTitle) {
            logger.debug(`Job already exists (title+company match): ${job.title} at ${job.company}`);
            skipped++;
            continue;
          }
        } else {
          const existingByUrl = await client.job.findFirst({
            where: { url: job.url },
          });

          if (existingByUrl) {
            logger.debug(`Job already exists (URL match): ${job.url}`);
            skipped++;
            continue;
          }
        }

        await client.job.create({
          data: {
            title: job.title,
            description: job.description || null,
            company: job.company,
            location: job.location || null,
            url: job.url || null,
            salaryRange: job.salaryRange || null,
            experience: job.experience || null,
            skills: job.skills || [],
            category: job.category || 'Other',
            type: job.type || 'full-time',
            isActive: true,
            postedAt: job.postedAt || new Date(),
          },
        });

        inserted++;
        logger.debug(`Inserted job: ${job.title} at ${job.company}`);
      } catch (error) {
        errors.push({ job, error: error.message });
        logger.error(`Failed to insert job: ${job.title} - ${error.message}`);
      }
    }
  }

  logger.info(`Insert complete: ${inserted} inserted, ${skipped} skipped, ${errors.length} errors`);
  
  return { inserted, skipped, errors };
}

export async function updateJob(id, data) {
  const client = getPrismaClient();
  
  try {
    const updated = await client.job.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    
    logger.debug(`Updated job: ${id}`);
    return updated;
  } catch (error) {
    logger.error(`Failed to update job ${id}: ${error.message}`);
    throw error;
  }
}

export async function markInactive(ids) {
  const client = getPrismaClient();
  
  if (!ids || ids.length === 0) {
    return { updated: 0 };
  }

  try {
    const result = await client.job.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    logger.info(`Marked ${result.count} jobs as inactive`);
    return { updated: result.count };
  } catch (error) {
    logger.error(`Failed to mark jobs inactive: ${error.message}`);
    throw error;
  }
}

export async function getActiveJobs(options = {}) {
  const client = getPrismaClient();
  
  const {
    category,
    location,
    skills,
    limit = 100,
    offset = 0,
    orderBy = 'postedAt',
    order = 'desc',
  } = options;

  const where = {
    isActive: true,
  };

  if (category) {
    where.category = category;
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  if (skills && skills.length > 0) {
    where.skills = { hasSome: skills };
  }

  try {
    const jobs = await client.job.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { [orderBy]: order },
    });

    logger.debug(`Retrieved ${jobs.length} active jobs`);
    return jobs;
  } catch (error) {
    logger.error(`Failed to get active jobs: ${error.message}`);
    throw error;
  }
}

export async function getJobByUrl(url) {
  const client = getPrismaClient();
  
  try {
    const job = await client.job.findFirst({
      where: { url },
    });
    return job;
  } catch (error) {
    logger.error(`Failed to get job by URL: ${error.message}`);
    throw error;
  }
}

export async function getJobByTitleAndCompany(title, company) {
  const client = getPrismaClient();
  
  try {
    const job = await client.job.findFirst({
      where: {
        title: { contains: title, mode: 'insensitive' },
        company: { contains: company, mode: 'insensitive' },
      },
    });
    return job;
  } catch (error) {
    logger.error(`Failed to get job by title and company: ${error.message}`);
    throw error;
  }
}

export async function getJobStats() {
  const client = getPrismaClient();
  
  try {
    const total = await client.job.count();
    const active = await client.job.count({ where: { isActive: true } });
    const inactive = await client.job.count({ where: { isActive: false } });
    
    const byCategory = await client.job.groupBy({
      by: ['category'],
      _count: true,
      where: { isActive: true },
    });

    const recentJobs = await client.job.count({
      where: {
        isActive: true,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      total,
      active,
      inactive,
      recentJobs,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category] = item._count;
        return acc;
      }, {}),
    };
  } catch (error) {
    logger.error(`Failed to get job stats: ${error.message}`);
    throw error;
  }
}

export async function cleanupOldJobs(daysOld = 30) {
  const client = getPrismaClient();
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  try {
    const result = await client.job.deleteMany({
      where: {
        isActive: false,
        updatedAt: {
          lt: cutoffDate,
        },
      },
    });

    logger.info(`Cleaned up ${result.count} old inactive jobs`);
    return { deleted: result.count };
  } catch (error) {
    logger.error(`Failed to cleanup old jobs: ${error.message}`);
    throw error;
  }
}

export async function disconnect() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    logger.info('Database connection closed');
  }
}

export default {
  insertJobs,
  updateJob,
  markInactive,
  getActiveJobs,
  getJobByUrl,
  getJobByTitleAndCompany,
  getJobStats,
  cleanupOldJobs,
  disconnect,
};
