# Job Scraper — Complete Deep Dive

> **Audience:** New intern joining the project  
> **Goal:** Understand how the job scraper works end-to-end — from the frontend button click to saving jobs in the database

---

## Table of Contents

1. [What Does the Job Scraper Do?](#1-what-does-the-job-scraper-do)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Project Structure](#3-project-structure)
4. [Frontend: Admin UI (How an Admin Triggers Scraping)](#4-frontend-admin-ui)
5. [Backend: API Bridge (How the Backend Manages the Scraper)](#5-backend-api-bridge)
6. [The Standalone Job Scraper (The Actual Scraper)](#6-the-standalone-job-scraper)
7. [How Each Scraper Extracts Job Data](#7-how-each-scraper-extracts-job-data)
8. [Data Cleaning & Categorization](#8-data-cleaning--categorization)
9. [Database Schema](#9-database-schema)
10. [Complete Data Flow (Step by Step)](#10-complete-data-flow-step-by-step)
11. [The AI Job Matcher (Fallback)](#11-the-ai-job-matcher-fallback)
12. [Common Issues & Things to Watch Out For](#12-common-issues--things-to-watch-out-for)
13. [How to Test & Run Locally](#13-how-to-test--run-locally)

---

## 1. What Does the Job Scraper Do?

The job scraper **automatically searches for jobs** from popular job portals (LinkedIn, Indeed, Naukri) and **saves them into our database**. This way, students using the EduGuideAI platform can browse real, up-to-date job listings without manually searching each site.

### Key Capabilities

| Capability | Details |
|-----------|---------|
| **Sources** | LinkedIn, Indeed, Naukri |
| **Data collected** | Job title, company, location, salary, description, skills, type, experience |
| **Categories** | Technology, Design, Marketing, Sales, Finance, HR, Healthcare, Education, Legal, Operations, Customer Service |
| **Deduplication** | Prevents duplicate jobs (by URL or title+company) |
| **Scheduling** | Runs automatically every 6 hours via cron |
| **Manual trigger** | Admin can trigger from the admin panel UI |
| **Progress tracking** | Real-time progress shown in the UI when triggered manually |
| **AI fallback** | If no jobs exist, AI generates realistic mock jobs |

---

## 2. High-Level Architecture

The system has **3 layers** that communicate with each other:

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND (React App)                                               │
│                                                                     │
│  AdminJobsPage.jsx                                                   │
│  ┌─────────────────────────────────┐                                │
│  │  "Scrape Jobs" button           │                                │
│  │  Progress bar (polling)         │                                │
│  │  Results display                │                                │
│  └──────────┬──────────────────────┘                                │
│             │  POST /admin/jobs/scrape                              │
│             │  GET  /admin/jobs/scrape/status (every 1.5s)         │
│             ▼                                                       │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  BACKEND (Express API Server)                                       │
│                                                                     │
│  admin.controller.js  ──►  admin.service.js                         │
│                              │                                      │
│                              │  spawns child_process                │
│                              ▼                                      │
│                       node job-scraper/src/index.js                 │
│                                                                     │
│  Progress is communicated via:                                      │
│  stdout: PROGRESS_UPDATE: {"scraped":5, "inserted":3, ...}         │
│                                                                     │
│  Status stored in memory (activeScrapeStatus object)                │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  JOB SCRAPER (Standalone Node.js project)                           │
│                                                                     │
│  index.js ──► runScrapers()                                         │
│                │                                                    │
│                ├── IndeedScraper  ──► indeed.com                    │
│                ├── LinkedInScraper ──► linkedin.com                 │
│                └── NaukriScraper  ──► naukri.com                    │
│                      │                                              │
│                      ▼                                              │
│                extractJobFromCard()                                 │
│                cleanJobData()                                        │
│                categorizeJob()                                       │
│                deduplicateJobs()                                     │
│                      │                                              │
│                      ▼                                              │
│                database/db.js ──► insertJobs()                       │
│                                     │                               │
│                                     ▼                               │
│                              PostgreSQL (jobs table)                │
└─────────────────────────────────────────────────────────────────────┘
```

### Important Concept: Why is the scraper a separate project?

The scraper lives in its own folder (`job-scraper/`) with its own `package.json`. It is NOT imported as a library. Instead, the backend **spawns it as a child process** using Node.js's `child_process.spawn()`. This is because:

1. **The scraper is slow** (network requests, rate limiting) — running it in a separate process prevents blocking the main API server
2. **If the scraper crashes**, it doesn't take down the API server
3. **It can run independently** — you can run `npm run scrape` from the `job-scraper/` folder directly

---

## 3. Project Structure

Here are ALL the files involved in the job scraping feature:

### Frontend (3 files)

| File | Purpose |
|------|---------|
| `frontend/src/pages/admin/AdminJobsPage.jsx` | Admin page with "Scrape Jobs" button + progress modal |
| `frontend/src/components/admin/JobManagementTable.jsx` | Table showing all jobs with CRUD actions |
| `frontend/src/components/admin/JobFormModal.jsx` | Form to add/edit a job manually |

### Backend (4 files)

| File | Purpose |
|------|---------|
| `backend/src/routes/admin.routes.js` | Defines the 3 scraper API routes |
| `backend/src/controllers/admin.controller.js` | Controller functions (thin layer) |
| `backend/src/services/admin.service.js` | **Core bridge** — spawns the child process, parses progress |
| `backend/src/validations/admin.validation.js` | Input validation rules |

### Database (2 schema files)

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` (root) | Main app schema with `Job` model + `UserJob` join table |
| `job-scraper/prisma/schema.prisma` | Scraper's own schema (same `Job` model, fewer indexes) |

### Standalone Job Scraper (18 files)

| File | Purpose |
|------|---------|
| `job-scraper/package.json` | Dependencies + scripts |
| `job-scraper/.env` | Database URL + scraper configuration |
| `job-scraper/src/index.js` | **Entry point** — runScrapers(), CLI commands, main() |
| `job-scraper/src/scheduler.js` | Cron scheduler (runs every 6 hours) |
| `job-scraper/src/scrape-once.js` | Simple one-shot scrape script |
| `job-scraper/src/config.js` | Configuration loader |
| `job-scraper/src/scrapers/base.js` | **BaseScraper class** — HTTP client, retry, rate limiting |
| `job-scraper/src/scrapers/indeed.js` | Indeed scraper |
| `job-scraper/src/scrapers/linkedin.js` | LinkedIn scraper |
| `job-scraper/src/scrapers/naukri.js` | Naukri scraper |
| `job-scraper/src/database/db.js` | Database operations (insert, lookup, stats) |
| `job-scraper/src/utils/logger.js` | Logging (winston) |
| `job-scraper/src/utils/cleaner.js` | Data cleaning, skill extraction, dedup |
| `job-scraper/src/utils/categories.js` | Job categorization (11 categories) |

---

## 4. Frontend: Admin UI

### 4.1 The Admin Jobs Page

**File:** `frontend/src/pages/admin/AdminJobsPage.jsx` (388 lines)

This is the page at route `/admin/jobs`. It has two main sections:

#### A. Job List (top section)

Shows all jobs in a table (`JobManagementTable` component). Columns:
- **Job** (title + company)
- **Location** (with map pin icon)
- **Category** (color-coded badge)
- **Type** (full-time, part-time, etc.)
- **Posted** (date)
- **Actions** (View / Edit / Delete)

The table fetches jobs when the page loads:
```javascript
// Line 33-54 — simplified
const fetchJobs = async (page = 1) => {
  const params = { page, limit: 10, search, category: categoryFilter };
  const response = await adminService.getJobs(params);
  setJobs(response.data.jobs);
  setPagination(response.data.pagination);
};
```

#### B. Scrape Modal (triggered by "Scrape Jobs" button)

The modal has **3 visual states**:

**State 1: Form** (before scraping starts)
```
┌────────────────────────────────────────┐
│  Scrape Jobs from Portal               │
│                                        │
│  Location:  [New York           ▼]     │
│  Keyword:   [software engineer   ]     │
│  Max Jobs:  [50                 ]      │
│                                        │
│  [Trigger Scraper]                     │
└────────────────────────────────────────┘
```

**State 2: In Progress** (while scraping)
```
┌────────────────────────────────────────┐
│  Scrape Jobs from Portal               │
│                                        │
│  ⏳ Scraping in progress...            │
│  ─────────────────────────────────     │
│  Jobs Found:  12                       │
│  Saved:       8                        │
│  Skipped:     4                        │
│  Current:     Indeed - "software       │
│               engineer" in New York    │
│                                        │
│  [Stop Scraping]                       │
└────────────────────────────────────────┘
```

**State 3: Completed** (after scraping finishes)
```
┌────────────────────────────────────────┐
│  Scrape Jobs from Portal               │
│                                        │
│  ✅ Scraping Complete!                 │
│  ─────────────────────────────────     │
│  Total Scraped:  15                    │
│  New Inserts:    10                    │
│  Failed:         5                     │
│                                        │
│  [Close]                               │
└────────────────────────────────────────┘
```

### 4.2 The Polling Mechanism

This is the most important part to understand. When the admin clicks "Trigger Scraper":

```javascript
// Lines 128-171 — simplified
const handleScrape = async (e) => {
  e.preventDefault();
  setScrapeLoading(true);
  setScrapeResult(null);

  // Step 1: Send POST to start scraping
  await adminService.scrapeJobs({
    location: scrapeLocation,
    limit: scrapeLimit,
    keyword: scrapeKeyword
  });

  // Step 2: Start polling (check status every 1.5 seconds)
  const intervalId = setInterval(async () => {
    const statusData = await adminService.getScrapeStatus();
    // { active: true/false, progress: { scraped, inserted, failed, ... } }

    setScrapeProgress(statusData.progress);

    // Step 3: When scraping finishes, stop polling
    if (!statusData.active) {
      clearInterval(intervalId);
      setScrapeLoading(false);
      setScrapeResult(statusData.result);
      fetchJobs(); // Refresh the job list
    }
  }, 1500);
};
```

> **Why polling?** Because the scraper runs in a separate Node.js process. The frontend can't directly know when it finishes. So it asks the backend every 1.5 seconds: "Is it done yet?"

---

## 5. Backend: API Bridge

### 5.1 Routes

**File:** `backend/src/routes/admin.routes.js` (lines 39-41)

```javascript
router.post('/jobs/scrape', adminController.scrapeJobs);
router.get('/jobs/scrape/status', adminController.getScrapeStatus);
router.post('/jobs/scrape/stop', adminController.stopScrapeJobs);
```

All three require **authentication + ADMIN role**:
```javascript
router.use(authenticate);                    // JWT check
router.use(authorize(['ADMIN']));            // Role check
```

### 5.2 Controller

**File:** `backend/src/controllers/admin.controller.js` (lines 255-284)

The controller is very thin — it just extracts data from the request and calls the service:

```javascript
// Line 255-266
scrapeJobs: async (req, res, next) => {
  try {
    const { location, limit, keyword } = req.body;
    if (!location) {
      return res.status(400).json({ success: false, message: 'Location is required' });
    }
    const result = await adminService.scrapeJobs(location, limit, keyword);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
},

// Line 268-275
getScrapeStatus: async (req, res, next) => {
  try {
    const status = await adminService.getScrapeStatus();
    res.status(200).json({ success: true, data: status });
  } catch (error) { next(error); }
},

// Line 277-284
stopScrapeJobs: async (req, res, next) => {
  try {
    const result = await adminService.stopScrapeJobs();
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
},
```

### 5.3 Service (The Bridge) — MOST IMPORTANT FILE

**File:** `backend/src/services/admin.service.js` (lines 185-307)

This file is the **bridge between the API server and the scraper child process**.

#### Module-level state (stored in memory):

```javascript
// Lines 185-199
let activeScrapeProcess = null;  // Reference to the child process
let activeScrapeStatus = {       // Current scrape status (updated in real-time)
  active: false,                 // Is a scrape currently running?
  location: '',                  // What location is being scraped
  limit: 10,                     // Max jobs to scrape
  keyword: '',                   // Search keyword
  progress: {                    // Progress counters
    scraped: 0,
    inserted: 0,
    failed: 0,
    currentSearch: '',
    currentLoc: ''
  },
  result: null                   // Final result when complete
};
```

#### `scrapeJobs(location, limit, keyword)` function (lines 225-307):

```javascript
// Step-by-step breakdown:

// Step 1: Check if already scraping
if (activeScrapeStatus.active) {
  throw new Error('A scraping process is already running');
}

// Step 2: Reset status
activeScrapeStatus = { active: true, location, limit: limit || 10, keyword: keyword || '', ... };

// Step 3: Locate the scraper entry point
const scraperPath = path.resolve(__dirname, "../../../job-scraper/src/index.js");

// Step 4: Build CLI arguments
const cmdArgs = ["scrape", location, keyword || '', limit ? String(limit) : ''];

// Step 5: Set working directory to job-scraper folder
const cwd = path.resolve(__dirname, "../../../job-scraper");

// Step 6: Spawn child process
activeScrapeProcess = spawn("node", [scraperPath, ...cmdArgs], { cwd });
```

**This is equivalent to manually running:**
```bash
cd job-scraper
node src/index.js scrape "New York" "software engineer" 50
```

#### How progress is communicated (stdout parsing):

The child process (scraper) prints special lines to its standard output. The parent process (backend) reads them:

```javascript
activeScrapeProcess.stdout.on("data", (data) => {
  const text = data.toString();
  for (const line of text.split("\n")) {
    if (line.includes("PROGRESS_UPDATE:")) {
      // Extract the JSON after "PROGRESS_UPDATE:"
      const startIdx = line.indexOf("PROGRESS_UPDATE:") + "PROGRESS_UPDATE:".length;
      const jsonStr = line.substring(startIdx);
      const update = JSON.parse(jsonStr);
      
      // Update the in-memory status
      activeScrapeStatus.progress.scraped = update.scraped;
      activeScrapeStatus.progress.inserted = update.inserted;
      activeScrapeStatus.progress.failed = update.failed;
      activeScrapeStatus.progress.currentSearch = update.currentSearch;
      activeScrapeStatus.progress.currentLoc = update.currentLoc;
    }
  }
});
```

> **Analogy:** Imagine two people. Person A (backend) tells Person B (scraper) "go scrape jobs." Person B works and periodically yells back "I found 5 jobs so far!" Person A writes this on a whiteboard. The frontend keeps looking at the whiteboard every 1.5 seconds.

#### What happens when scraping finishes:

```javascript
activeScrapeProcess.on("close", (code) => {
  activeScrapeStatus.active = false;
  // Store the final result
  activeScrapeStatus.result = {
    success: code === 0,
    inserted: activeScrapeStatus.progress.inserted,
    failed: activeScrapeStatus.progress.failed,
    totalScraped: activeScrapeStatus.progress.scraped
  };
});
```

#### `stopScrapeJobs()` function (lines 205-223):

```javascript
if (activeScrapeProcess) {
  activeScrapeProcess.kill('SIGINT');   // Send interrupt signal
  activeScrapeStatus.active = false;
  activeScrapeStatus.result = { message: 'Scraping stopped by admin' };
}
```

---

## 6. The Standalone Job Scraper

### 6.1 Entry Point

**File:** `job-scraper/src/index.js` (188 lines)

The main function is `runScrapers()`:

```javascript
// Lines 31-97 — simplified
async function runScrapers(customLocations, customKeyword, maxPagesOverride) {
  // Step 1: Determine which locations to use
  let locations = customLocations || await getUniqueUserLocations();
  // getUniqueUserLocations() queries: SELECT DISTINCT city FROM student_profiles
  if (locations.length === 0) {
    locations = ['Mumbai', 'Bengaluru', 'Delhi']; // Default fallback
  }

  // Step 2: Define search queries (10 hardcoded job titles)
  const searchQueries = customKeyword 
    ? [{ query: customKeyword, keyword: customKeyword }]
    : [
        { query: 'software engineer', keyword: 'Software Engineer' },
        { query: 'web developer', keyword: 'Web Developer' },
        { query: 'data scientist', keyword: 'Data Scientist' },
        { query: 'product manager', keyword: 'Product Manager' },
        { query: 'ux designer', keyword: 'UX Designer' },
        { query: 'devops engineer', keyword: 'DevOps Engineer' },
        { query: 'full stack developer', keyword: 'Full Stack Developer' },
        { query: 'machine learning engineer', keyword: 'Machine Learning Engineer' },
        { query: 'frontend developer', keyword: 'Frontend Developer' },
        { query: 'backend developer', keyword: 'Backend Developer' },
      ];

  // Step 3: Scrape from each source
  const scrapers = {
    indeed: new IndeedScraper(),
    linkedin: new LinkedInScraper(),
    naukri: new NaukriScraper(),
  };

  let allJobs = [];
  for (const [sourceName, scraper] of Object.entries(scrapers)) {
    for (const search of searchQueries) {
      for (const location of locations) {
        // Emit progress update
        emitProgress({ currentSearch: search.keyword, currentLoc: location });
        
        // Scrape one page
        const jobs = await scraper.scrape(search.query, location, maxPagesOverride);
        allJobs.push(...jobs);
        
        // Wait between requests to be polite
        await sleep(1000);
      }
    }
  }

  // Step 4: Deduplicate
  const uniqueJobs = deduplicateJobs(allJobs);

  // Step 5: Insert into database
  const result = await insertJobs(uniqueJobs);

  return result;
}
```

### 6.2 CLI Commands

The scraper supports these commands when run from the terminal:

| Command | What it does | Example |
|---------|-------------|---------|
| `node src/index.js start` | Starts the cron scheduler (runs every 6h) | `node src/index.js start` |
| `node src/index.js scrape` | Runs scraper once with defaults | `node src/index.js scrape` |
| `node src/index.js scrape "New York"` | Runs scraper for a specific location | `node src/index.js scrape "New York"` |
| `node src/index.js scrape "NY" "engineer" 20` | Custom location + keyword + limit | `node src/index.js scrape "NY" "engineer" 20` |
| `node src/index.js status` | Shows scheduler status | `node src/index.js status` |
| `node src/index.js stats` | Shows job database statistics | `node src/index.js stats` |

### 6.3 How Locations Are Determined

When the admin triggers scraping from the UI, they provide a location. But when the scheduler runs automatically, it fetches locations from the database:

```javascript
// job-scraper/src/database/db.js — lines 292-305
async function getUniqueUserLocations() {
  const result = await prisma.$queryRawUnsafe(
    'SELECT DISTINCT city FROM student_profiles WHERE city IS NOT NULL'
  );
  if (result.length > 0) {
    return result.map(r => r.city);
  }
  return ['Mumbai', 'Bengaluru', 'Delhi']; // Fallback
}
```

This means the scraper automatically targets cities where our students are located.

---

## 7. How Each Scraper Extracts Job Data

### 7.1 The Base Scraper Class

**File:** `job-scraper/src/scrapers/base.js` (99 lines)

All three scrapers extend a `BaseScraper` class that provides:

```javascript
class BaseScraper {
  constructor(name) {
    this.name = name;
    this.lastRequestTime = 0;     // For rate limiting
    this.requestCount = 0;
    
    // Shared axios instance
    this.client = axios.create({
      timeout: 30000,
      headers: this.getHeaders(),
    });
  }

  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
      'Accept': 'text/html,application/xhtml+xml,...',
      'Accept-Language': 'en-US,en;q=0.9',
    };
  }

  async rateLimit() {
    const elapsed = Date.now() - this.lastRequestTime;
    const delay = 2000; // 2 seconds minimum between requests
    if (elapsed < delay) {
      await this.sleep(delay - elapsed);
    }
  }

  async fetchPage(url, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.rateLimit();
        const response = await this.client.get(url);
        this.lastRequestTime = Date.now();
        this.requestCount++;
        return response.data;     // Returns HTML string
      } catch (error) {
        if (error.response?.status === 429) {
          // HTTP 429 = Too Many Requests (rate limited!)
          await this.sleep(attempt * 5000); // Wait 5s, 10s, 15s
          continue;
        }
        if (attempt === retries) throw error;
        await this.sleep(5000);
      }
    }
  }

  async scrape(query, location, maxPages) {
    throw new Error('scrape() must be implemented by subclass');
  }
}
```

### 7.2 Indeed Scraper

**File:** `job-scraper/src/scrapers/indeed.js` (239 lines)

**How it works:**
1. Builds a search URL like: `https://www.indeed.com/jobs?q=software+engineer&l=New+York&start=0`
2. Fetches the HTML page using `fetchPage()`
3. Parses the HTML using **cheerio** (a server-side jQuery-like library)
4. Uses CSS selectors to find job cards

**Key extraction logic (cheerio selectors):**

```javascript
// Line 87-131 — simplified
extractJobFromCard($, element) {
  const title = $(element).find('h2.jobTitle a').text().trim();
  const company = $(element).find('span[data-testid="company-name"]').text().trim();
  const location = $(element).find('div[data-testid="text-location"]').text().trim();
  const url = 'https://www.indeed.com' + $(element).find('h2.jobTitle a').attr('href');
  const salary = $(element).find('div.salary-snippet-container').text().trim();
  const description = $(element).find('div.job-snippet').text().trim();
  
  return { title, company, location, url, salary, description, source: 'Indeed' };
}
```

**Relative date parsing:** Indeed shows dates like "3 days ago", "Just posted", "30+ days ago". The scraper converts these to actual dates:

```javascript
// Lines 182-217
parseRelativeDate(dateText) {
  if (/just now|today/i.test(dateText)) return new Date();
  if (/yesterday/i.test(dateText)) return new Date(Date.now() - 86400000);
  const match = dateText.match(/(\d+)\s*(day|hour|week|month)/i);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    // Convert to milliseconds and subtract
    if (unit === 'day') return new Date(Date.now() - value * 86400000);
    if (unit === 'hour') return new Date(Date.now() - value * 3600000);
    if (unit === 'week') return new Date(Date.now() - value * 604800000);
  }
  return new Date();
}
```

### 7.3 LinkedIn Scraper

**File:** `job-scraper/src/scrapers/linkedin.js` (256 lines)

**How it works:**
1. Builds a search URL like: `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=software+engineer&location=New+York&start=0`
2. Uses LinkedIn's **guest (unauthenticated) API endpoint**
3. Fetches 25 jobs at a time (paginated)

**Key difference from Indeed:** LinkedIn uses a different HTML structure:

```javascript
// Lines 90-128 — simplified
extractJobFromCard($, element) {
  const title = $(element).find('h3.base-search-card__title').text().trim();
  const company = $(element).find('h4.base-search-card__subtitle').text().trim();
  const location = $(element).find('span.job-search-card__location').text().trim();
  const url = $(element).find('a.base-card__full-link').attr('href');
  const postedAt = $(element).find('time').attr('datetime'); // ISO date string
  
  return { title, company, location, url, postedAt, source: 'LinkedIn' };
}
```

**Job detail scraping:** After getting the job card, the scraper fetches each individual job page to get the description and skills:

```javascript
// Lines 130-178
async scrapeJobDetails(url) {
  const html = await this.fetchPage(url);
  const $ = cheerio.load(html);
  
  const description = $('div.description__text').text().trim();
  const skills = [];
  $('span.job-criteria__text').each((i, el) => {
    skills.push($(el).text().trim());
  });
  
  return { description, skills };
}
```

### 7.4 Naukri Scraper

**File:** `job-scraper/src/scrapers/naukri.js` (262 lines)

**How it works:**
1. Uses Naukri's API-like endpoint: `https://www.naukri.com/jobsapi/v3/search?q=software+engineer&l=New+York&pageNo=1`
2. This endpoint returns HTML (not JSON), so cheerio is still needed
3. Has a longer rate limit delay (3 seconds vs 2 seconds for others)

**Extraction:**

```javascript
// Lines 97-149 — simplified
extractJobFromCard($, element) {
  // Naukri has two possible HTML structures (fallback pattern)
  const title = $(element).find('a.title').text().trim();
  const company = $(element).find('a.subTitle').text().trim();
  const location = $(element).find('span.locWdth').text().trim();
  const salary = $(element).find('span.salary').text().trim();
  const experience = $(element).find('span.exp').text().trim();
  const skillsList = $(element).find('span.skill').map((i, el) => $(el).text().trim()).get();
  
  return { title, company, location, salary, experience, skillsList, source: 'Naukri' };
}
```

---

## 8. Data Cleaning & Categorization

### 8.1 Cleaning Pipeline

After each raw job is extracted, it goes through a cleaning pipeline:

**File:** `job-scraper/src/utils/cleaner.js` (212 lines)

```javascript
// Line 124-140
function cleanJobData(rawJob) {
  return {
    title: cleanJobTitle(rawJob.title),
    company: cleanCompany(rawJob.company),
    location: cleanLocation(rawJob.location),
    url: cleanUrl(rawJob.url),
    salaryRange: normalizeSalary(rawJob.salary),
    experience: normalizeExperience(rawJob.experience),
    type: normalizeJobType(rawJob.type),
    description: cleanHtml(rawJob.description),
    // Extract skills from title + description
    skills: extractSkillsFromText(rawJob.title + ' ' + (rawJob.description || '')),
  };
}
```

**Skill extraction** (`extractSkillsFromText`, lines 18-63):

Checks text against 57 hardcoded skills grouped into:
- **Technical:** JavaScript, Python, React, Node.js, Docker, AWS, MongoDB, SQL, TypeScript, etc. (46 skills)
- **Soft Skills:** Communication, Leadership, Problem Solving, Teamwork, etc. (11 skills)

Example matching logic:
```javascript
function extractSkillsFromText(text) {
  const found = [];
  const techSkills = ['JavaScript', 'Python', 'React', ...];
  const softSkills = ['Communication', 'Leadership', ...];
  
  for (const skill of [...techSkills, ...softSkills]) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  return found;
}
```

### 8.2 Job Categorization

**File:** `job-scraper/src/utils/categories.js` (242 lines)

11 categories, each with a list of keywords and associated skills:

```javascript
const CATEGORIES = {
  Technology: {
    keywords: ['software', 'engineer', 'developer', 'programmer', 'devops', 'backend', 'frontend', 
               'full stack', 'data scientist', 'machine learning', 'cloud', 'react', 'node.js', 
               'python', 'java', 'javascript', 'typescript'],
    skills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker', 'SQL', ...]
  },
  Design: {
    keywords: ['designer', 'ux', 'ui', 'graphic', 'visual', 'creative', 'art', 'figma', 
               'photoshop', 'illustrator', 'user experience', 'product design'],
    skills: ['Figma', 'Photoshop', 'Illustrator', 'Sketch', 'UI/UX', ...]
  },
  // ... 9 more categories (Marketing, Sales, Finance, HR, Healthcare, Education, Legal, Operations, Customer Service)
};
```

**Scoring algorithm** (lines 165-205):

```javascript
function categorizeJob(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();
  let bestCategory = 'Other';
  let bestScore = 0;

  for (const [category, data] of Object.entries(CATEGORIES)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (title.toLowerCase().includes(keyword)) score += 3;  // Title match = 3 points
      else if (text.includes(keyword)) score += 2;            // Description match = 2 points
    }
    for (const skill of data.skills) {
      if (text.includes(skill.toLowerCase())) score += 1;     // Skill match = 1 point
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  return bestCategory;
}
```

### 8.3 Deduplication

Two levels of deduplication:

**A. In-memory dedup** (before database insert):

```javascript
// cleaner.js — lines 93-114
function deduplicateJobs(jobs) {
  const seen = new Map();
  for (const job of jobs) {
    const key = `${job.title}|||${job.company}|||${job.location}`;
    if (seen.has(key)) {
      const existing = seen.get(key);
      // Keep the newer one (by postedAt date)
      if (new Date(job.postedAt) > new Date(existing.postedAt)) {
        seen.set(key, job);
      }
    } else {
      seen.set(key, job);
    }
  }
  return Array.from(seen.values());
}
```

**B. Database-level dedup** (during insert):

```javascript
// database/db.js — lines 30-105
async function insertJobs(jobs) {
  let inserted = 0, skipped = 0, errors = 0;
  
  for (const job of jobs) {
    // Check 1: By URL (if URL exists and is unique)
    if (job.url) {
      const existing = await prisma.job.findFirst({ where: { url: job.url } });
      if (existing) { skipped++; continue; }
    }
    
    // Check 2: By title + company combo (case-insensitive)
    const existing = await prisma.job.findFirst({
      where: { title: { equals: job.title, mode: 'insensitive' },
               company: { equals: job.company, mode: 'insensitive' } }
    });
    if (existing) { skipped++; continue; }
    
    // Insert new job
    await prisma.job.create({ data: job });
    inserted++;
  }
  
  return { inserted, skipped, errors };
}
```

---

## 9. Database Schema

### 9.1 The `jobs` Table

**From** `prisma/schema.prisma` (lines 359-383):

```prisma
model Job {
  id          String    @id @default(uuid())   // Auto-generated UUID
  title       String                            // Job title (e.g., "Software Engineer")
  description String?                           // Full job description (HTML cleaned)
  company     String                            // Company name (e.g., "Google")
  location    String?                           // Job location (e.g., "New York, NY")
  url         String?                           // Original job posting URL (unique)
  salaryRange String?                           // Salary info (e.g., "$100k-$150k")
  experience  String?                           // Experience required (e.g., "2-5 yrs")
  skills      String[]                          // Array of skills (PostgreSQL text array)
  category    String                            // Job category (e.g., "Technology")
  type        String?   @default("full-time")   // Job type enum
  isActive    Boolean   @default(true)          // Soft delete / visibility flag
  postedAt    DateTime? @default(now())         // When the job was originally posted
  createdAt   DateTime  @default(now())         // When we added it to our DB
  updatedAt   DateTime  @updatedAt              // Auto-updated on change

  userJobs    UserJob[]                         // Relations to user saved jobs

  @@index([category])                           // Index for category filtering
  @@index([company])                            // Index for company filtering
  @@index([isActive])                           // Index for active/inactive filtering
  @@index([postedAt])                           // Index for sorting by date
  @@map("jobs")                                 // Table name in DB
}
```

### 9.2 The `user_jobs` Join Table

**From** `prisma/schema.prisma` (lines 385-400):

```prisma
model UserJob {
  id        String    @id @default(uuid())
  userId    String                                // References User.id
  jobId     String                                // References Job.id
  status    String    @default("saved")           // Workflow: saved → applied → interviewing → offered → rejected → accepted
  appliedAt DateTime?                             // When the user applied
  createdAt DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  job  Job  @relation(fields: [jobId], references: [id], onDelete: Cascade)

  @@unique([userId, jobId])                       // One user can save a job only once
  @@map("user_jobs")
}
```

---

## 10. Complete Data Flow (Step by Step)

Follow one complete scrape cycle from end to end:

```
STEP 1: Admin navigates to /admin/jobs
         ├── AdminJobsPage.jsx loads
         ├── Calls adminService.getJobs() to fetch existing jobs
         └── Renders job table + "Scrape Jobs" button

STEP 2: Admin clicks "Scrape Jobs"
         ├── Scrape modal opens (form state)
         └── Admin fills location, keyword, max jobs

STEP 3: Admin clicks "Trigger Scraper"
         ├── AdminJobsPage.handleScrape() is called
         ├── Calls adminService.scrapeJobs({ location, limit, keyword })
         │       └── POST /api/admin/jobs/scrape
         │               └── Admin controller extracts req.body
         │                       └── Admin service is called
         │                               └── Checks if already scraping
         │                               └── Starts polling timer (setInterval 1500ms)
         │                               └── Spawns child process:
         │                                   node job-scraper/src/index.js scrape "NY" "engineer" 50
         └── Modal switches to "in progress" state

STEP 4: Child process runs (job-scraper/src/index.js)
         ├── runScrapers() is called
         ├── If no custom location: queries student_profiles for cities
         ├── Iterates over scrapers (Indeed → LinkedIn → Naukri)
         │       └── For each scraper:
         │               ├── Iterates over search queries (10 job titles)
         │               │       └── For each query:
         │               │               ├── Iterates over locations
         │               │               │       └── For each location:
         │               │               │               ├── scraper.scrape(query, location, maxPages)
         │               │               │               │       ├── fetchPage(url) with retry & rate limiting
         │               │               │               │       ├── parseJobsPage(html) using cheerio
         │               │               │               │       └── extractJobFromCard($, element)
         │               │               │               ├── Sleeps 1-3 seconds
         │               │               │               └── Emits PROGRESS_UPDATE: JSON to stdout
         │               │               │                       └── Backend reads this, updates activeScrapeStatus
         │               │               │                               └── Frontend polls this every 1.5s, updates progress bar
         │               └── Collects all raw jobs
         ├── deduplicateJobs(allJobs)  → removes duplicates by title+company+location
         ├── insertJobs(uniqueJobs)    → checks URL/name duplicates in DB, batch inserts
         └── Process exits

STEP 5: Child process closes
         ├── Backend's "close" event fires
         ├── Sets activeScrapeStatus.active = false
         ├── Stores final result { inserted, failed, totalScraped }
         └── Frontend's next poll detects active=false
                 ├── Stops polling (clearInterval)
                 ├── Shows result in modal
                 └── Refreshes job table

STEP 6: Jobs are now in the database
         └── Students can browse them at /jobs
                 ├── Public: GET /api/jobs
                 └── Authenticated: GET /api/jobs/saved
```

---

## 11. The AI Job Matcher (Fallback)

**File:** `backend/src/services/ai/jobMatcher.js` (517 lines)

When there are **no jobs in the database** and a user requests job recommendations, the AI job matcher dynamically creates **8 realistic mock jobs**:

| # | Title | Company | Salary |
|---|-------|---------|--------|
| 1 | Associate Software Engineer | TCS | ₹3,50,000 - ₹5,50,000 |
| 2 | Frontend Web Developer | Razorpay | ₹6,00,000 - ₹9,00,000 |
| 3 | Full Stack Engineer (MERN) | CRED | ₹8,00,000 - ₹12,00,000 |
| 4 | Junior Data Analyst | Mu Sigma | ₹4,50,000 - ₹6,50,000 |
| 5 | Machine Learning Engineer Associate | Flipkart | ₹10,00,000 - ₹15,00,000 |
| 6 | Associate Product Manager | Zomato | ₹12,00,000 - ₹18,00,000 |
| 7 | UX/UI Designer | Unacademy | ₹5,50,000 - ₹8,00,000 |
| 8 | Digital Marketing Specialist | Zeta Global | ₹3,50,000 - ₹5,50,000 |

These are created with `prisma.job.createMany({ skipDuplicates: true })` — so they only get inserted once.

---

## 12. Common Issues & Things to Watch Out For

### 12.1 Website Blocking (HTTP 403 Errors)

The Indeed scraper logs show **HTTP 403 (Forbidden)** responses. This means Indeed detected the scraper and blocked it. The scraper has basic evasion (User-Agent header, rate limiting) but no advanced techniques like:

- ❌ Proxy rotation
- ❌ Headless browser (Puppeteer/Playwright)
- ❌ CAPTCHA solving
- ❌ Cookie/Session management

**If you need to fix this**, you might need to implement proxy rotation or switch to Puppeteer.

### 12.2 HTML Structure Changes

Websites change their HTML regularly. If a scraper stops working, it's likely because the CSS selectors in `extractJobFromCard()` no longer match the new HTML. You'd need to inspect the website's current HTML and update the selectors.

### 12.3 Rate Limiting

If you scrape too fast, websites will temporarily block your IP. The scraper has built-in delays:
- **Base delay:** 2 seconds between requests
- **Naukri:** 3 seconds (more strict)
- **On 429 error:** Backs off 5s, 10s, 15s

### 12.4 Cron Scheduler Overlap Protection

The scheduler prevents overlapping runs:
```javascript
if (isRunning) {
  console.log('Previous scrape still running, skipping scheduled run');
  return;
}
```

### 12.5 In-Memory State

`activeScrapeStatus` is stored in **memory** (not in the database). If the backend server restarts while a scrape is running, the status is lost and the child process becomes orphaned.

### 12.6 Duplicate Schema Files

There are **two** `schema.prisma` files for the `Job` model:
- Root: `/prisma/schema.prisma` — full app schema (includes UserJob relation, UUID type annotations)
- Scraper: `/job-scraper/prisma/schema.prisma` — simplified schema without UUID annotations or UserJob

They point to the same database table (`@@map("jobs")`), so they must stay in sync.

---

## 13. How to Test & Run Locally

### Run the scraper once:

```bash
cd job-scraper
npm run scrape
```

Or with custom parameters:
```bash
node src/index.js scrape "Mumbai" "software engineer" 10
```

### Start the scheduler (runs every 6 hours):

```bash
cd job-scraper
npm run start
```

### Check scraper stats:

```bash
node src/index.js stats
```

### Check scheduler status:

```bash
node src/index.js status
```

### View scraper logs:

```bash
cat job-scraper/logs/combined.log
cat job-scraper/logs/error.log
```

### Trigger via the UI:

1. Login as admin (`/login`)
2. Navigate to `/admin/jobs`
3. Click "Scrape Jobs"
4. Enter location, keyword, limit
5. Click "Trigger Scraper"
6. Watch progress update in real-time

### Run only the scheduler (no API server):

```bash
cd job-scraper
node src/index.js start
```

This will start the cron scheduler independently. It will scrape every 6 hours and save directly to the database, bypassing the backend API entirely.

---

## Key Files Cheat Sheet

| What you want to do | File to edit |
|---------------------|-------------|
| Change scrape schedule | `job-scraper/src/scheduler.js` (cron expression) |
| Add a new job source | Create `job-scraper/src/scrapers/newsource.js` extending BaseScraper |
| Fix Indeed selectors | `job-scraper/src/scrapers/indeed.js` (extractJobFromCard) |
| Fix LinkedIn selectors | `job-scraper/src/scrapers/linkedin.js` (extractJobFromCard) |
| Fix Naukri selectors | `job-scraper/src/scrapers/naukri.js` (extractJobFromCard) |
| Add/edit job categories | `job-scraper/src/utils/categories.js` |
| Change rate limiting | `job-scraper/src/scrapers/base.js` or `job-scraper/.env` |
| Change search queries | `job-scraper/src/index.js` (searchQueries array) |
| Change where locations come from | `job-scraper/src/database/db.js` (getUniqueUserLocations) |
| Change progress polling frequency | `frontend/src/pages/admin/AdminJobsPage.jsx` (1500ms interval) |
| Change max pages per source | `job-scraper/src/config.js` (maxPages) |

---

*Generated from codebase — EduGuideAI Job Scraper Deep Dive*
