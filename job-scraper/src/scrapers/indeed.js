import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { categorizeJob, extractCategorySkills } from '../utils/categories.js';
import { cleanJobData } from '../utils/cleaner.js';

export class IndeedScraper extends BaseScraper {
  constructor() {
    super('Indeed');
    this.baseUrl = 'https://www.indeed.com';
    this.searchPaths = [
      '/jobs?q=',
      '/jobs?q=',
    ];
  }

  buildSearchUrl(query, location = '', page = 0) {
    const params = new URLSearchParams({
      q: query,
      l: location,
      start: page * 10,
      sort: 'date',
    });
    
    return `${this.baseUrl}/jobs?${params.toString()}`;
  }

  async scrape(searchQuery, location = '', maxPages = null) {
    const pages = maxPages || this.config?.maxPages || 5;
    const allJobs = [];

    this.logger.info(`Starting Indeed scrape for: "${searchQuery}" in "${location || 'All locations'}"`);

    for (let page = 0; page < pages; page++) {
      try {
        const url = this.buildSearchUrl(searchQuery, location, page);
        this.logger.info(`Scraping page ${page + 1}/${pages}: ${url}`);
        
        const html = await this.fetchPage(url);
        const jobs = this.parseJobsPage(html);
        
        if (jobs.length === 0) {
          this.logger.info(`No more jobs found on page ${page + 1}, stopping.`);
          break;
        }

        allJobs.push(...jobs);
        this.logger.info(`Found ${jobs.length} jobs on page ${page + 1}`);
        
        if (page < pages - 1) {
          await this.sleep(1000);
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
    
    this.logger.info(`Indeed scrape complete: ${cleanedJobs.length} jobs found`);
    return cleanedJobs;
  }

  parseJobsPage(html) {
    const $ = cheerio.load(html);
    const jobs = [];

    $('div.jobsearch-ResultsList > div').each((_, element) => {
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
    
    const title = $el.find('h2.jobTitle a').text().trim() ||
                  $el.find('a[data-jk]').text().trim() ||
                  $el.find('.jobTitle').text().trim();
    
    if (!title) return null;

    const company = $el.find('span[data-testid="company-name"]').text().trim() ||
                    $el.find('.companyName').text().trim() ||
                    $el.find('span.company').text().trim();
    
    if (!company) return null;

    const location = $el.find('div[data-testid="text-location"]').text().trim() ||
                     $el.find('.companyLocation').text().trim();
    
    const link = $el.find('h2.jobTitle a').attr('href') ||
                 $el.find('a[data-jk]').attr('href');
    
    let url = null;
    if (link) {
      url = link.startsWith('http') ? link : `${this.baseUrl}${link}`;
    }

    const salary = $el.find('div.salary-snippet-container').text().trim() ||
                   $el.find('[data-testid="attribute_snippet_testid"]').text().trim();
    
    const snippet = $el.find('div.job-snippet').text().trim() ||
                    $el.find('.jobCardShelfContainer').text().trim();
    
    const dateText = $el.find('span.date').text().trim();
    const postedAt = this.parseRelativeDate(dateText);

    return {
      title,
      company,
      location,
      url,
      salary,
      snippet,
      postedAt,
    };
  }

  async scrapeJobDetails(url) {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      const description = $('#jobDescriptionText').html() ||
                          $('div.jobsearch-JobComponent-description').html() ||
                          $('[data-testid="jobDescription"]').html();

      const skills = [];
      $('ul.skills-list li, div.skills-list span').each((_, el) => {
        const skill = $(el).text().trim();
        if (skill) skills.push(skill);
      });

      const jobType = $('div.jobsearch-JobComponent-header span').text().trim();

      const experience = this.extractExperience(description || '');

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

  extractExperience(text) {
    const patterns = [
      /(\d+[\+]?\s*(?:to|-)\s*\d+\s*years?\s*(?:of)?\s*experience)/i,
      /(\d+\s*years?\s*(?:of)?\s*experience)/i,
      /experience:\s*(\d+[\+]?\s*(?:to|-)\s*\d+\s*years?)/i,
      /(\d+\+\s*years?)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  parseRelativeDate(dateText) {
    if (!dateText) return new Date();

    const now = new Date();
    const text = dateText.toLowerCase();

    if (text.includes('just now') || text.includes('today')) {
      return now;
    }

    if (text.includes('yesterday')) {
      return new Date(now.setDate(now.getDate() - 1));
    }

    const daysMatch = text.match(/(\d+)\s*(?:day|d)/);
    if (daysMatch) {
      return new Date(now.setDate(now.getDate() - parseInt(daysMatch[1])));
    }

    const hoursMatch = text.match(/(\d+)\s*(?:hour|h)/);
    if (hoursMatch) {
      return new Date(now.setHours(now.getHours() - parseInt(hoursMatch[1])));
    }

    const minutesMatch = text.match(/(\d+)\s*(?:minute|min)/);
    if (minutesMatch) {
      return new Date(now.setMinutes(now.getMinutes() - parseInt(minutesMatch[1])));
    }

    const weeksMatch = text.match(/(\d+)\s*(?:week|w)/);
    if (weeksMatch) {
      return new Date(now.setDate(now.getDate() - parseInt(weeksMatch[1]) * 7));
    }

    return now;
  }

  processJob(rawJob) {
    const category = categorizeJob(rawJob.title, rawJob.snippet || '');
    const categorySkills = extractCategorySkills(category, rawJob.snippet || '');

    return cleanJobData({
      title: rawJob.title,
      description: rawJob.snippet || '',
      company: rawJob.company,
      location: rawJob.location,
      url: rawJob.url,
      salaryRange: rawJob.salary,
      experience: rawJob.experience || null,
      skills: categorySkills,
      category,
      type: 'full-time',
      postedAt: rawJob.postedAt,
    });
  }
}

export default IndeedScraper;
