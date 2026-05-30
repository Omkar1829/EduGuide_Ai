import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { categorizeJob, extractCategorySkills } from '../utils/categories.js';
import { cleanJobData, extractSkillsFromText } from '../utils/cleaner.js';

export class LinkedInScraper extends BaseScraper {
  constructor() {
    super('LinkedIn');
    this.baseUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search';
    this.jobDetailUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/';
  }

  buildSearchParams(query, location = '', start = 0) {
    const params = new URLSearchParams({
      keywords: query,
      location: location || '',
      start: start.toString(),
      sortBy: 'DD',
      f_TPR: 'r604800',
      position: '1',
      pageNum: '0',
    });
    
    return params.toString();
  }

  async scrape(searchQuery, location = '', maxPages = null) {
    const pages = maxPages || this.config?.maxPages || 5;
    const allJobs = [];

    this.logger.info(`Starting LinkedIn scrape for: "${searchQuery}" in "${location || 'All locations'}"`);

    for (let page = 0; page < pages; page++) {
      try {
        const start = page * 25;
        const params = this.buildSearchParams(searchQuery, location, start);
        const url = `${this.baseUrl}?${params}`;
        
        this.logger.info(`Scraping page ${page + 1}/${pages}`);
        
        const html = await this.fetchPage(url);
        const jobs = this.parseJobsList(html);
        
        if (jobs.length === 0) {
          this.logger.info(`No more jobs found on page ${page + 1}, stopping.`);
          break;
        }

        allJobs.push(...jobs);
        this.logger.info(`Found ${jobs.length} jobs on page ${page + 1}`);
        
        if (page < pages - 1) {
          await this.sleep(2000);
        }
      } catch (error) {
        this.logger.error(`Error scraping page ${page + 1}: ${error.message}`);
        
        if (page === 0) {
          throw error;
        }
        break;
      }
    }

    const cleanedJobs = allJobs.map(job => this.processJob(job));
    
    this.logger.info(`LinkedIn scrape complete: ${cleanedJobs.length} jobs found`);
    return cleanedJobs;
  }

  parseJobsList(html) {
    const $ = cheerio.load(html);
    const jobs = [];

    $('li').each((_, element) => {
      try {
        const job = this.extractJobFromCard($, element);
        if (job) {
          jobs.push(job);
        }
      } catch (error) {
        this.logger.debug(`Error parsing job card: ${error.message}`);
      }
    });

    return jobs;
  }

  extractJobFromCard($, element) {
    const $el = $(element);
    
    const title = $el.find('h3.base-search-card__title').text().trim() ||
                  $el.find('.job-search-card__title').text().trim();
    
    if (!title) return null;

    const company = $el.find('h4.base-search-card__subtitle').text().trim() ||
                    $el.find('.job-search-card__subtitle').text().trim();
    
    const location = $el.find('span.job-search-card__location').text().trim() ||
                     $el.find('.job-search-card__location').text().trim();
    
    const link = $el.find('a.base-card__full-link').attr('href') ||
                 $el.find('a[data-tracking-control-name]').attr('href');
    
    let url = null;
    if (link) {
      url = link.split('?')[0];
    }

    const dateText = $el.find('time').attr('datetime') ||
                     $el.find('span.job-search-card__listdate').text().trim();
    
    const postedAt = dateText ? new Date(dateText) : new Date();

    const snippet = $el.find('.job-search-card__description').text().trim() ||
                    $el.find('p.job-search-card__snippet').text().trim();

    return {
      title,
      company,
      location,
      url,
      snippet,
      postedAt,
    };
  }

  async scrapeJobDetails(url) {
    try {
      const jobId = this.extractJobId(url);
      if (!jobId) return null;

      const detailUrl = `${this.jobDetailUrl}${jobId}`;
      const html = await this.fetchPage(detailUrl);
      const $ = cheerio.load(html);

      const description = $('div.description__text').html() ||
                          $('div.show-more-less-html__markup').html() ||
                          $('div.job-details-module__content').html();

      const skills = [];
      $('span.job-details-skill-match-status-item__name').each((_, el) => {
        const skill = $(el).text().trim();
        if (skill) skills.push(skill);
      });

      const criteria = [];
      $('li.job-criteria-item').each((_, el) => {
        const label = $(el).find('h3.job-criteria-item__header').text().trim();
        const value = $(el).find('span.job-criteria-item__text').text().trim();
        if (label && value) {
          criteria.push({ label, value });
        }
      });

      const jobType = criteria.find(c => 
        c.label.toLowerCase().includes('employment type')
      )?.value || null;

      const seniority = criteria.find(c => 
        c.label.toLowerCase().includes('seniority')
      )?.value || null;

      const experience = seniority || this.extractExperience(description || '');

      return {
        description: description || '',
        skills,
        jobType,
        experience,
      };
    } catch (error) {
      this.logger.error(`Error fetching job details: ${error.message}`);
      return null;
    }
  }

  extractJobId(url) {
    if (!url) return null;
    
    const patterns = [
      /view\/(\d+)\//,
      /jobPosting\/(\d+)/,
      /jobs\/view\/(\d+)/,
      /(\d{10,})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  extractExperience(text) {
    const patterns = [
      /(\d+[\+]?\s*(?:to|-)\s*\d+\s*years?\s*(?:of)?\s*experience)/i,
      /(\d+\s*years?\s*(?:of)?\s*experience)/i,
      /experience:\s*(\d+[\+]?\s*(?:to|-)\s*\d+\s*years?)/i,
      /(\d+\+\s*years?)/i,
      /(\d+\s*-\s*\d+\s*years?)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  processJob(rawJob) {
    const category = categorizeJob(rawJob.title, rawJob.snippet || '');
    const categorySkills = extractCategorySkills(category, rawJob.snippet || '');
    
    const textSkills = extractSkillsFromText(rawJob.snippet || '');
    const allSkills = [...new Set([...categorySkills, ...textSkills])];

    return cleanJobData({
      title: rawJob.title,
      description: rawJob.snippet || '',
      company: rawJob.company,
      location: rawJob.location,
      url: rawJob.url,
      salaryRange: rawJob.salary,
      experience: rawJob.experience || null,
      skills: allSkills,
      category,
      type: this.normalizeJobType(rawJob.jobType),
      postedAt: rawJob.postedAt,
    });
  }

  normalizeJobType(type) {
    if (!type) return 'full-time';
    
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('full')) return 'full-time';
    if (typeLower.includes('part')) return 'part-time';
    if (typeLower.includes('contract')) return 'contract';
    if (typeLower.includes('intern')) return 'internship';
    if (typeLower.includes('temporary') || typeLower.includes('temp')) return 'temporary';
    
    return 'full-time';
  }
}

export default LinkedInScraper;
