import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobMatches } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  Building2,
  Target,
  MapPin,
  DollarSign,
  ExternalLink,
  Bookmark,
  Search,
  AlertCircle,
} from "lucide-react";

const JobCard = ({ job }) => {
  const matchScore = job.matchScore || job.match || 0;
  const matchedSkills = job.matchedSkills || job.matched || [];
  const missingSkills = job.missingSkills || job.missing || [];

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">
              {job.title || job.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {job.company || job.organization || "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Target className="w-2.5 h-2.5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">{matchScore}%</span>
        </div>
      </div>

      {job.location && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3" />
          <span>{job.location}</span>
          {job.remote && (
            <span className="text-emerald-400 ml-1">(Remote)</span>
          )}
        </div>
      )}

      {job.salary && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <DollarSign className="w-3 h-3" />
          <span>{typeof job.salary === "string" ? job.salary : `${job.salary.min} - ${job.salary.max}`}</span>
        </div>
      )}

      {matchedSkills.length > 0 && (
        <div className="mb-2">
          <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
            Matched Skills
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {matchedSkills.map((skill, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                ✓ {typeof skill === "string" ? skill : skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className="mb-3">
          <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
            Missing Skills
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {missingSkills.map((skill, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"
              >
                ⚠ {typeof skill === "string" ? skill : skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.applicationTips && (
        <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-3">
          <h4 className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider mb-1">
            Application Tips
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {job.applicationTips}
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-white/5">
        <a
          href={job.url || job.applyUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="primary" size="sm" fullWidth>
            <ExternalLink className="w-3 h-3 mr-1" /> Apply
          </Button>
        </a>
        <Button variant="secondary" size="sm" className="flex-1">
          <Bookmark className="w-3 h-3 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
};

const JobMatches = () => {
  const dispatch = useDispatch();
  const { jobMatches, loading, error } = useSelector((s) => s.ai);
  const [filters, setFilters] = useState({
    skills: "",
    location: "",
    experienceLevel: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v.trim())
    );
    if (activeFilters.skills) {
      activeFilters.skills = activeFilters.skills.split(",").map((s) => s.trim());
    }
    dispatch(fetchJobMatches(activeFilters));
  };

  const jobs = Array.isArray(jobMatches)
    ? jobMatches
    : jobMatches?.jobs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">Job</span> Matches
        </h2>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, skills: e.target.value }))
                }
                placeholder="e.g., React, Node.js, Python"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="e.g., Remote, New York"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Experience Level
              </label>
              <select
                value={filters.experienceLevel}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    experienceLevel: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead / Manager</option>
              </select>
            </div>
          </div>
          <Button type="submit" isLoading={loading} fullWidth>
            <Search className="w-4 h-4 mr-2" /> Find Matching Jobs
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/5 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="h-3 bg-white/5 rounded"></div>
                <div className="h-3 bg-white/5 rounded w-2/3"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-white/5 rounded-xl flex-1"></div>
                <div className="h-8 bg-white/5 rounded-xl flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <Card className="text-center py-12">
          <Search className="w-10 h-10 text-gray-600 mb-3 mx-auto" />
          <p className="text-gray-400">
            Enter your skills to find AI-matched job opportunities.
          </p>
        </Card>
      )}
    </div>
  );
};

export default JobMatches;
