# EduGuide AI Job Scraper

A production-ready job scraper that crawls jobs from multiple sources and feeds them to the EduGuide AI database.

## Features

- **Multi-source scraping**: Indeed, LinkedIn, and Naukri
- **Rate limiting**: Configurable delays between requests
- **Retry logic**: Automatic retries with exponential backoff
- **Data cleaning**: HTML cleanup, skill extraction, salary normalization
- **Job categorization**: Automatic category assignment
- **Deduplication**: Prevents duplicate job entries
- **Cron scheduling**: Automated scraping every 6 hours
- **Logging**: Winston-based logging with file output
- **Error handling**: Graceful error recovery

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npm run db:generate
```

### 3. Configure environment

Edit `.env` file with your database connection string and preferences.

## Usage

### Start the scheduler (runs every 6 hours)

```bash
npm run start
```

### Run scrapers once

```bash
npm run scrape
```

### View scheduler status

```bash
node src/index.js status
```

### View job statistics

```bash
node src/index.js stats
```

### Trigger immediate run

```bash
node src/index.js trigger
```

## Configuration

Edit `.env` to customize:

```env
# Database
DATABASE_URL="postgresql://..."

# Scraper interval (cron expression)
SCRAPE_INTERVAL="0 */6 * * *"

# Rate limiting (ms between requests)
RATE_LIMIT_DELAY=2000

# Max retries for failed requests
MAX_RETRIES=3

# Max pages to scrape per source
MAX_PAGES=5

# Request timeout (ms)
REQUEST_TIMEOUT=30000
```

## Project Structure

```
job-scraper/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config.js
│   ├── index.js
│   ├── scrape-once.js
│   ├── scheduler.js
│   ├── database/
│   │   └── db.js
│   ├── scrapers/
│   │   ├── base.js
│   │   ├── indeed.js
│   │   ├── linkedin.js
│   │   └── naukri.js
│   └── utils/
│       ├── categories.js
│       ├── cleaner.js
│       └── logger.js
├── logs/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Database Schema

The scraper stores jobs with the following fields:

- `id`: UUID primary key
- `title`: Job title
- `description`: Full job description
- `company`: Company name
- `location`: Job location
- `url`: Original job URL
- `salary_range`: Salary information
- `experience`: Required experience
- `skills`: Array of required skills
- `category`: Job category (Technology, Design, etc.)
- `type`: Employment type (full-time, part-time, etc.)
- `is_active`: Whether the job is still active
- `posted_at`: When the job was posted
- `created_at`: When it was scraped
- `updated_at`: Last update time

## Adding New Scrapers

1. Create a new file in `src/scrapers/`
2. Extend `BaseScraper`
3. Implement the `scrape()` method
4. Register the scraper in `src/index.js`

Example:

```javascript
import { BaseScraper } from './base.js';

export class MyScraper extends BaseScraper {
  constructor() {
    super('MyScraper');
  }

  async scrape(query, location, maxPages) {
    // Implementation
  }
}
```

## Logging

Logs are stored in:
- `logs/combined.log`: All logs
- `logs/error.log`: Error logs only

## License

Private - EduGuide AI
