import { MapPin, DollarSign, Briefcase } from 'lucide-react'

const JobCard = ({ job }) => {
  const {
    title = 'Job Title',
    company = 'Company',
    location = 'Remote',
    salary = '',
    skills = [],
    type = 'Full-time',
    postedAgo = '',
    logo = null,
  } = job || {}

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex gap-4 group hover:border-white/[0.15] hover:shadow-xl hover:shadow-violet-500/[0.06] hover:scale-[1.01] transition-all duration-300">
      {/* Company Logo */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/15 border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-white/[0.15] group-hover:shadow-lg group-hover:shadow-violet-500/10 transition-all duration-300">
        {logo ? (
          <img src={logo} alt={company} className="w-8 h-8 rounded-lg object-cover" />
        ) : (
          <span className="text-lg font-bold bg-gradient-to-br from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {company.charAt(0)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-white leading-tight truncate group-hover:text-indigo-300 transition-colors duration-300">
            {title}
          </h4>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold whitespace-nowrap">
            {type}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-1 font-medium">{company}</p>

        <div className="flex items-center gap-3 mt-2.5 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
          {salary && (
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
              <DollarSign className="w-3 h-3" />
              {salary}
            </span>
          )}
          {postedAgo && (
            <span className="text-gray-600">{postedAgo}</span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.06] text-[10px] text-gray-300 font-medium hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-white transition-all duration-200"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.03] text-[10px] text-gray-600 font-medium">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCard
