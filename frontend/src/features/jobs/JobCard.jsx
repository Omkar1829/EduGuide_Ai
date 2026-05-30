import { Link } from 'react-router-dom';

const JobCard = ({ job, onSave, saved }) => {
  const {
    id,
    title,
    company,
    location,
    salaryRange,
    experience,
    skills = [],
    category,
    type,
    postedAt,
  } = job;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'full-time': 'bg-green-500/20 text-green-400 border-green-500/30',
      'part-time': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      contract: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      internship: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[type?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="glass-card-hover p-5 group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/jobs/${id}`}
            className="text-white font-semibold hover:text-primary-400 transition-colors line-clamp-1"
          >
            {title}
          </Link>
          <p className="text-gray-400 text-sm mt-1">{company}</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onSave?.(id);
          }}
          className={`p-2 rounded-lg transition-all duration-200 ${
            saved
              ? 'bg-primary-500/20 text-primary-400'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <svg
            className={`w-5 h-5 ${saved ? 'fill-current' : ''}`}
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-400">
        {location && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </span>
        )}
        {salaryRange && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {salaryRange}
          </span>
        )}
        {experience && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {experience}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTypeBadgeColor(type)}`}>
          {type || 'Full-time'}
        </span>
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/5 text-gray-400 border border-white/10">
          {category}
        </span>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-md bg-primary-500/10 text-primary-300 border border-primary-500/20"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400">
              +{skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-500">
        <span>Posted {formatDate(postedAt)}</span>
        <Link
          to={`/jobs/${id}`}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
