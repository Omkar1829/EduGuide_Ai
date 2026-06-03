export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    COMPLETE_WIZARD: '/profile/complete-wizard',
    UPLOAD_AVATAR: '/profile/avatar',
  },
  RECOMMENDATIONS: {
    GET: '/recommendations',
    GET_AI: '/recommendations/ai',
    SAVE: '/recommendations/save',
    REMOVE: '/recommendations/:id',
  },
  COURSES: {
    LIST: '/courses',
    GET: '/courses/:id',
    ENROLL: '/courses/:id/enroll',
    PROGRESS: '/courses/:id/progress',
  },
  JOBS: {
    LIST: '/jobs',
    GET: '/jobs/:id',
    APPLY: '/jobs/:id/apply',
    SAVED: '/jobs/saved',
    SAVE: '/jobs/:id/save',
  },
  QUIZ: {
    GET_CATEGORIES: '/quiz/categories',
    GET_QUIZ: '/quiz/:id',
    SUBMIT: '/quiz/:id/submit',
    RESULTS: '/quiz/results',
    HISTORY: '/quiz/history',
  },
  AI_DASHBOARD: {
    GET: '/ai-dashboard',
    ANALYSIS: '/ai-dashboard/analysis',
    RECOMMENDATIONS: '/ai-dashboard/recommendations',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    CLEAR: '/notifications/clear',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    COURSES: '/admin/courses',
    JOBS: '/admin/jobs',
    ANALYTICS: '/admin/analytics',
  },
}

export const ROLES = {
  STUDENT: 'STUDENT',
  COUNSELOR: 'COUNSELOR',
  ADMIN: 'ADMIN',
}

export const QUIZ_CATEGORIES = [
  { id: 'personality', name: 'Personality Assessment', icon: 'fas fa-brain' },
  { id: 'skills', name: 'Skills Evaluation', icon: 'fas fa-cogs' },
  { id: 'interests', name: 'Career Interests', icon: 'fas fa-compass' },
  { id: 'aptitude', name: 'Aptitude Test', icon: 'fas fa-chart-line' },
  { id: 'values', name: 'Work Values', icon: 'fas fa-heart' },
  { id: 'learning-style', name: 'Learning Style', icon: 'fas fa-graduation-cap' },
]

export const RECOMMENDATION_TYPES = {
  CAREER: 'career',
  COURSE: 'course',
  SKILL: 'skill',
  JOB: 'job',
}

export const DARK_MODE = {
  STORAGE_KEY: 'eduguide-dark-mode',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
}

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-]{10,}$/,
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE_WIZARD: '/profile-wizard',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  AI_DASHBOARD: '/ai-dashboard',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',
  QUIZ: '/quiz',
  SETTINGS: '/settings',
  ADMIN: '/admin',
}
