import * as cheerio from 'cheerio';

export function cleanHtml(html) {
  if (!html) return '';
  
  const $ = cheerio.load(html);
  
  $('script, style, noscript, iframe').remove();
  
  const text = $.text()
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
  
  return text;
}

export function extractSkillsFromText(text) {
  if (!text) return [];
  
  const technicalSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
    'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'NoSQL',
    'React', 'Angular', 'Vue', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js',
    'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot',
    'Laravel', 'Ruby on Rails', 'ASP.NET',
    'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind', 'Bootstrap',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'DynamoDB',
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
    'GraphQL', 'REST', 'RESTful', 'gRPC', 'WebSocket',
    'Git', 'GitHub', 'GitLab', 'Bitbucket',
    'Jenkins', 'CircleCI', 'Travis CI', 'GitHub Actions',
    'Linux', 'Unix', 'Bash', 'Shell',
    'TensorFlow', 'PyTorch', 'Machine Learning', 'ML', 'AI', 'Deep Learning',
    'Data Science', 'Data Analysis', 'Data Engineering',
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence',
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
    'Redux', 'MobX', 'Zustand', 'Context API',
    'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier',
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright',
    'Nginx', 'Apache', 'IIS',
    'Microservices', 'Serverless', 'CI/CD', 'DevOps',
    'Blockchain', 'Web3', 'Solidity',
    'Flutter', 'React Native', 'Ionic',
    'Salesforce', 'SAP', 'Oracle',
  ];
  
  const softSkills = [
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity',
    'Collaboration', 'Project Management', 'Analytical Skills',
    'Interpersonal Skills', 'Presentation', 'Negotiation',
  ];
  
  const allSkills = [...technicalSkills, ...softSkills];
  const textLower = text.toLowerCase();
  
  const foundSkills = allSkills.filter(skill => 
    textLower.includes(skill.toLowerCase())
  );
  
  return [...new Set(foundSkills)];
}

export function normalizeSalary(salaryStr) {
  if (!salaryStr) return null;
  
  let cleaned = salaryStr
    .replace(/\s+/g, ' ')
    .trim();
  
  cleaned = cleaned
    .replace(/₹/g, 'INR ')
    .replace(/\$/g, 'USD ')
    .replace(/€/g, 'EUR ')
    .replace(/£/g, 'GBP ');
  
  cleaned = cleaned
    .replace(/per annum/gi, '/year')
    .replace(/per month/gi, '/month')
    .replace(/per week/gi, '/week')
    .replace(/per hour/gi, '/hour')
    .replace(/p\.a\./gi, '/year')
    .replace(/p\.m\./gi, '/month')
    .replace(/lakh/gi, 'L')
    .replace(/lac/gi, 'L');
  
  cleaned = cleaned.replace(/\s*-\s*/g, ' - ');
  
  return cleaned || null;
}

export function deduplicateJobs(jobs) {
  const seen = new Map();
  
  return jobs.filter(job => {
    const key = generateJobKey(job);
    
    if (seen.has(key)) {
      const existing = seen.get(key);
      if (job.postedAt && existing.postedAt) {
        if (new Date(job.postedAt) > new Date(existing.postedAt)) {
          seen.set(key, job);
          return true;
        }
        return false;
      }
      return false;
    }
    
    seen.set(key, job);
    return true;
  });
}

function generateJobKey(job) {
  const title = (job.title || '').toLowerCase().trim();
  const company = (job.company || '').toLowerCase().trim();
  const location = (job.location || '').toLowerCase().trim();
  
  return `${title}|||${company}|||${location}`;
}

export function cleanJobData(rawJob) {
  return {
    title: cleanJobTitle(rawJob.title),
    description: cleanHtml(rawJob.description),
    company: cleanCompany(rawJob.company),
    location: cleanLocation(rawJob.location),
    url: cleanUrl(rawJob.url),
    salaryRange: normalizeSalary(rawJob.salaryRange),
    experience: normalizeExperience(rawJob.experience),
    skills: extractSkillsFromText(
      `${rawJob.title || ''} ${rawJob.description || ''}`
    ),
    category: rawJob.category || 'Other',
    type: normalizeJobType(rawJob.type),
    postedAt: rawJob.postedAt ? new Date(rawJob.postedAt) : new Date(),
  };
}

function cleanJobTitle(title) {
  if (!title) return 'Untitled Position';
  return title.replace(/\s+/g, ' ').trim();
}

function cleanCompany(company) {
  if (!company) return 'Unknown Company';
  return company.replace(/\s+/g, ' ').trim();
}

function cleanLocation(location) {
  if (!location) return null;
  return location.replace(/\s+/g, ' ').trim();
}

function cleanUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return null;
  }
}

function normalizeExperience(exp) {
  if (!exp) return null;
  
  let cleaned = exp.toLowerCase().trim();
  
  cleaned = cleaned.replace(/years?/gi, 'yrs');
  cleaned = cleaned.replace(/months?/gi, 'mo');
  
  return cleaned || null;
}

function normalizeJobType(type) {
  if (!type) return 'full-time';
  
  const typeLower = type.toLowerCase().trim();
  
  const typeMap = {
    'full time': 'full-time',
    'full-time': 'full-time',
    'fulltime': 'full-time',
    'part time': 'part-time',
    'part-time': 'part-time',
    'parttime': 'part-time',
    'contract': 'contract',
    'contractor': 'contract',
    'freelance': 'freelance',
    'freelancing': 'freelance',
    'temporary': 'temporary',
    'temp': 'temporary',
    'internship': 'internship',
    'intern': 'internship',
    'full-time internship': 'internship',
    'remote': 'full-time',
    'hybrid': 'full-time',
  };
  
  return typeMap[typeLower] || 'full-time';
}

export default {
  cleanHtml,
  extractSkillsFromText,
  normalizeSalary,
  deduplicateJobs,
  cleanJobData,
};
