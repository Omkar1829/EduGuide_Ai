import { BookOpen, Clock, Building2 } from 'lucide-react'

const CourseCard = ({ course }) => {
  const {
    title = 'Course Title',
    provider = 'Provider',
    duration = '0h',
    progress = 0,
    thumbnail = null,
    category = '',
  } = course || {}

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden group hover:border-white/[0.15] hover:shadow-xl hover:shadow-indigo-500/[0.06] hover:scale-[1.02] transition-all duration-300">
      {/* Thumbnail / Hero */}
      <div className="h-36 bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-fuchsia-600/10 flex items-center justify-center relative overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <BookOpen className="w-10 h-10 text-white/20 group-hover:scale-110 group-hover:text-white/30 transition-all duration-500" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />

        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white uppercase tracking-wider">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h4 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h4>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <Building2 className="w-3.5 h-3.5" />
            {provider}
          </span>
          <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-[10px] text-indigo-400 font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-700 shadow-sm shadow-indigo-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
