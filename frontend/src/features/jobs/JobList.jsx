import JobCard from './JobCard';

const JobList = ({ jobs, loading, onSave, savedJobIds = [] }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass-card p-5 animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-white/10 rounded w-2/3" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-lg" />
            </div>
            <div className="flex gap-2 mb-3">
              <div className="h-6 bg-white/10 rounded-full w-20" />
              <div className="h-6 bg-white/10 rounded-full w-24" />
            </div>
            <div className="flex gap-1.5 mb-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-white/10 rounded w-16" />
              ))}
            </div>
            <div className="h-3 bg-white/10 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-white text-lg font-medium mb-2">No jobs found</h3>
        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onSave={onSave}
          saved={savedJobIds.includes(job.id)}
        />
      ))}
    </div>
  );
};

export default JobList;
