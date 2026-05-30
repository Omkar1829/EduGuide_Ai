import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { categorizeJob, extractCategorySkills } from '../utils/categories.js';
import { cleanJobData, extractSkillsFromText } from '../utils/cleaner.js';

export class NaukriScraper extends BaseScraper {
  constructor() {
    super('Naukri');
    this.baseUrl = 'https://www.naukri.com';
    this.searchEndpoint = '/jobsapi/v3/search';
  }

  buildSearchUrl(query, location = '', page = 1) {
    const params = new URLSearchParams({
      q: query,
      l: location || '',
      pageNo: page.toString(),
      sort: 'DD',
      wfh: '3',
    });
    
    return `${this.baseUrl}${this.searchEndpoint}?${params.toString()}`;
  }

  async scrape(searchQuery, location = '', maxPages = null) {
    const pages = maxPages || this.config?.maxPages || 5;
    const allJobs = [];

    this.logger.info(`Starting Naukri scrape for: "${searchQuery}" in "${location || 'All locations'}"`);

    for (let page = 1; page <= pages; page++) {
      try {
        const url = this.buildSearchUrl(searchQuery, location, page);
        this.logger.info(`Scraping page ${page}/${pages}`);
        
        const html = await this.fetchPage(url);
        const jobs = this.parseJobsPage(html);
        
        if (jobs.length === 0) {
          this.logger.info(`No more jobs found on page ${page}, stopping.`);
          break;
        }

        allJobs.push(...jobs);
        this.logger.info(`Found ${jobs.length} jobs on page ${page}`);
        
        if (page < pages) {
          await this.sleep(3000);
        }
      } catch (error) {
        this.logger.error(`Error scraping page ${page}: ${error.message}`);
        
        if (page === 1) {
          throw error;
        }
        break;
      }
    }

    const cleanedJobs = allJobs.map(job => this.processJob(job));
    
    this.logger.info(`Naukri scrape complete: ${cleanedJobs.length} jobs found`);
    return cleanedJobs;
  }

  parseJobsPage(html) {
    const $ = cheerio.load(html);
    const jobs = [];

    $('div.srp-cardlist div[data-job-id], article.srp-cardlist-card, div[data-jobId]').each((_, element) => {
      try {
        const job = this.extractJobFromCard($, element);
        if (job) {
          jobs.push(job);
        }
      } catch (error) {
        this.logger.debug(`Error parsing job card: ${error.message}`);
      }
    });

    if (jobs.length === 0) {
      $('div[data-job-id]').each((_, element) => {
        try {
          const job = this.extractJobFromCard($, element);
          if (job) {
            jobs.push(job);
          }
        } catch (error) {
          this.logger.debug(`Error parsing job card: ${error.message}`);
        }
      });
    }

    return jobs;
  }

  extractJobFromCard($, element) {
    const $el = $(element);
    
    const title = $el.find('a.title, a[title], h2 a, a.srp-cardlink').first().text().trim() ||
                  $el.find('.jobTuple .title').text().trim() ||
                  $el.attr('data-job-title') || '';
    
    if (!title) return null;

    const company = $el.find('a.subTitle, a.companyName, span.companyName, div.companyInfo a').first().text().trim() ||
                    $el.find('.companyName').text().trim();
    
    const locationEl = $el.find('span.locWdth, span.location, li.locWdth, div.companyInfo span').first();
    const location = locationEl.text().trim() || $el.attr('data-job-location') || '';
    
    const link = $el.find('a.title, a[title], h2 a, a.srp-cardlink').first().attr('href') ||
                 $el.find('a').first().attr('href');
    
    let url = null;
    if (link) {
      url = link.startsWith('http') ? link : `${this.baseUrl}${link}`;
    }

    const salary = $el.find('span.salary, div.salary span, li.salary span, .salary').first().text().trim();
    
    const experience = $el.find('span.expwdth, li.expwdth, div.experience, .experience').first().text().trim();
    
    const skillsList = [];
    $el.find('li.skills, ul.skills li, .skillList li, div.skills .tag').each((_, el) => {
      const skill = $(el).text().trim();
      if (skill) skillsList.push(skill);
    });

    const dateText = $el.find('span.date, .date, .turnstileTime').first().text().trim();
    const postedAt = this.parseRelativeDate(dateText);

    const jobType = $el.find('.jobType, span.job-type').text().trim();

    const description = $el.find('.job-desc, .jobDescription, p.description').first().text().trim();

    return {
      title,
      company,
      location,
      url,
      salary,
      experience,
      skillsList,
      postedAt,
      jobType,
      description,
    };
  }

  async scrapeJobDetails(url) {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      const description = $('div.job-desc, div.detailedJobDesc, div.JDSalaryDes, div.description').html() ||
                          $('div.job-description').html() ||
                          $('section.jobDescription').html();

      const skills = [];
      $('li.skills, div.skills span, div.skillList span').each((_, el) => {
        const skill = $(el).text().trim();
        if (skill) skills.push(skill);
      });

      const jobType = $('span.jobType, div.jobType span').text().trim();

      const experience = $('div.exp, span.exp').text().trim();

      const salary = $('div.salary, span.salary').text().trim();

      return {
        description: description || '',
        skills,
        jobType,
        experience,
        salary,
      };
    } catch (error) {
      this.logger.error(`Error fetching job details: ${error.message}`);
      return null;
    }
  }

  parseRelativeDate(dateText) {
    if (!dateText) return new Date();

    const now = new Date();
    const text = dateText.toLowerCase();

    if (text.includes('today') || text.includes('just now')) {
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
    const category = categorizeJob(rawJob.title, rawJob.description || rawJob.snippet || '');
    const categorySkills = extractCategorySkills(category, rawJob.description || rawJob.snippet || '');
    
    const textSkills = extractSkillsFromText(`${rawJob.title || ''} ${rawJob.description || ''} ${(rawJob.skillsList || []).join(' ')}`);
    const allSkills = [...new Set([...(rawJob.skillsList || []), ...categorySkills, ...textSkills])];

    const normalizedType = this.normalizeJobType(rawJob.jobType);

    return cleanJobData({
      title: rawJob.title,
      description: rawJob.description || '',
      company: rawJob.company,
      location: rawJob.location,
      url: rawJob.url,
      salaryRange: rawJob.salary,
      experience: rawJob.experience,
      skills: allSkills,
      category,
      type: normalizedType,
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
    if (typeLower.includes('freelance')) return 'freelance';
    
    return 'full-time';
  }
}

export default NaukriScraper;
