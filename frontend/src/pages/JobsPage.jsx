import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search, SlidersHorizontal, MapPin, DollarSign, Briefcase, Bookmark, Clock,
  X, Building2, AlertTriangle, RefreshCw, Inbox, ExternalLink, Sparkles
} from 'lucide-react';
import { fetchJobs, saveJob, removeSavedJob, fetchSavedJobs } from '../store/slices/jobSlice';
import { fetchProfile as fetchProfileThunk } from '../store/slices/profileSlice';
import { Link } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { ROUTES } from '../utils/constants';

const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error, savedJobs, pagination } = useSelector((state) => state.jobs);
  const { profile, skills, interests } = useSelector((state) => state.profile);

  const [search, setSearch] = useState('');
  const [detectedLocation, setDetectedLocation] = useState('');
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    location: '',
    experience: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchData = useCallback(() => {
    const params = { page: 1, limit: 12 };
    if (search) params.search = search;
    if (filters.category) params.category = filters.category;
    if (filters.type) params.type = filters.type;
    if (filters.location) params.location = filters.location;
    if (filters.experience) params.experience = filters.experience;
    dispatch(fetchJobs(params));
  }, [dispatch, search, filters]);

  useEffect(() => {
    dispatch(fetchSavedJobs());
    if (!profile) {
      dispatch(fetchProfileThunk());
    }

    // Detect browser Geolocation and IP Geolocation
    const detectLocations = async () => {
      // 1. Try IP Geolocation first with fallbacks (immediate, no permission prompt needed)
      let detectedCity = '';

      // Try IP Geolocation API 1: ipwhois.app (high monthly limit, HTTPS free)
      try {
        const ipRes = await fetch('https://ipwhois.app/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData && ipData.city) {
            detectedCity = ipData.city;
          }
        }
      } catch (e) {
        console.warn('ipwhois.app geolocation failed, trying fallback...', e);
      }

      // Try IP Geolocation API 2: freeipapi.com (very generous rate limit, HTTPS free)
      if (!detectedCity) {
        try {
          const ipRes = await fetch('https://freeipapi.com/api/json');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData && ipData.cityName) {
              detectedCity = ipData.cityName;
            }
          }
        } catch (e) {
          console.warn('freeipapi.com geolocation failed, trying fallback...', e);
        }
      }

      // Try IP Geolocation API 3: ipapi.co as a last resort
      if (!detectedCity) {
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData && ipData.city) {
              detectedCity = ipData.city;
            }
          }
        } catch (e) {
          console.warn('ipapi.co geolocation failed:', e);
        }
      }

      if (detectedCity) {
        setDetectedLocation(detectedCity);
      }

      // 2. Try browser Geolocation for high precision (requires permission)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const geoData = await geoRes.json();
              const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.suburb;
              if (city) {
                setDetectedLocation(city);
              }
            } catch (e) {
              console.error('Reverse geocoding failed:', e);
            }
          },
          (err) => console.log('Browser Geolocation denied/failed:', err)
        );
      }
    };

    detectLocations();
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Automatically merge detectedLocation and profile city once loaded
  useEffect(() => {
    const locations = [];
    if (detectedLocation) locations.push(detectedLocation);
    if (profile?.city) locations.push(profile.city);

    if (locations.length > 0) {
      setFilters((prev) => ({
        ...prev,
        location: [...new Set(locations)].join(', '),
      }));
    }
  }, [detectedLocation, profile]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 400);
    return () => clearTimeout(timeout);
  }, [search, filters, fetchData]);

  const handleSaveJob = async (jobId) => {
    const isSaved = (savedJobs || []).some((j) => j.jobId === jobId);
    if (isSaved) {
      const savedJob = (savedJobs || []).find((j) => j.jobId === jobId);
      if (savedJob) await dispatch(removeSavedJob(savedJob.id));
    } else {
      await dispatch(saveJob(jobId));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', type: '', location: '', experience: '' });
    setSearch('');
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || search;

  // Get all active jobs (or fetched jobs) and score them based on matching profile
  const scoredJobs = (jobs || []).map(job => {
    if (showAllJobs || !profile) {
      return { job, score: 1, reasons: [], locationMatches: true, skillMatches: true };
    }

    const userCity = profile?.city?.toLowerCase() || '';
    const userState = profile?.state?.toLowerCase() || '';
    const userCountry = profile?.country?.toLowerCase() || '';
    const detLoc = detectedLocation?.toLowerCase() || '';
    const jobLoc = job.location?.toLowerCase() || '';

    // Check location match
    const locationMatches = !userCity && !detLoc
      ? true
      : (userCity && jobLoc.includes(userCity)) ||
        (userState && jobLoc.includes(userState)) ||
        (userCountry && jobLoc.includes(userCountry)) ||
        (detLoc && jobLoc.includes(detLoc));

    // Check skills/interests match
    const userSkills = (skills || []).map(s => s.skill?.name?.toLowerCase()).filter(Boolean);
    const userInterests = (interests || []).map(i => i.name?.toLowerCase()).filter(Boolean);

    const jobTitle = job.title?.toLowerCase() || '';
    const jobCategory = job.category?.toLowerCase() || '';
    const jobDesc = job.description?.toLowerCase() || '';
    const jobSkillsRequired = (job.skills || []).map(s => s.toLowerCase());

    const matchedSkills = userSkills.filter(skill => 
      jobTitle.includes(skill) || 
      jobDesc.includes(skill) || 
      jobSkillsRequired.some(js => js.includes(skill))
    );

    const matchedInterests = userInterests.filter(interest => 
      jobTitle.includes(interest) || 
      jobDesc.includes(interest) ||
      jobCategory.includes(interest)
    );

    const skillMatches = userSkills.length === 0 && userInterests.length === 0
      ? true
      : (matchedSkills.length > 0 || matchedInterests.length > 0);

    // Calculate score
    let score = 0;
    const reasons = [];

    if (locationMatches) {
      score += 50;
      reasons.push('Location Match');
    }
    if (matchedSkills.length > 0) {
      score += matchedSkills.length * 20;
      reasons.push(`${matchedSkills.length} Skill(s) Matched`);
    }
    if (matchedInterests.length > 0) {
      score += matchedInterests.length * 15;
      reasons.push(`${matchedInterests.length} Interest(s) Matched`);
    }

    return { job, score, reasons, locationMatches, skillMatches };
  });

  // Program progressive matching fallback layers
  let displayJobs = [];
  let recommendationGrade = '';

  if (activeTab === 'saved') {
    displayJobs = (savedJobs || []).map((s) => s.job).filter(Boolean);
  } else if (showAllJobs || !profile) {
    displayJobs = jobs || [];
  } else {
    // Grade 1: Excellent Match (both location AND skills/interests match)
    const strictMatches = scoredJobs.filter(sj => sj.locationMatches && sj.skillMatches && sj.score > 0);
    if (strictMatches.length > 0) {
      displayJobs = [...strictMatches].sort((a, b) => b.score - a.score).map(sj => sj.job);
      recommendationGrade = 'Excellent Match';
    } else {
      // Grade 2: Profile Match (Location OR skills/interests match)
      const softMatches = scoredJobs.filter(sj => (sj.locationMatches || sj.skillMatches) && sj.score > 0);
      if (softMatches.length > 0) {
        displayJobs = [...softMatches].sort((a, b) => b.score - a.score).map(sj => sj.job);
        recommendationGrade = 'Profile Match';
      } else {
        // Grade 3: Global fallback (show all jobs sorted by best match score)
        displayJobs = [...scoredJobs].sort((a, b) => b.score - a.score).map(sj => sj.job);
        recommendationGrade = 'All Opportunities';
      }
    }
  }

  // Apply manual search and filters as a client-side layer to guarantee instant correctness
  if (search) {
    const q = search.toLowerCase();
    displayJobs = displayJobs.filter(job => 
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q) ||
      (job.skills || []).some(s => s.toLowerCase().includes(q)) ||
      job.category?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    displayJobs = displayJobs.filter(job => job.category === filters.category);
  }
  if (filters.type) {
    displayJobs = displayJobs.filter(job => job.type?.toLowerCase() === filters.type.toLowerCase());
  }
  if (filters.location) {
    const locations = filters.location.split(',').map(l => l.trim().toLowerCase()).filter(Boolean);
    if (locations.length > 0) {
      displayJobs = displayJobs.filter(job => {
        const jobLoc = job.location?.toLowerCase() || '';
        return locations.some(loc => jobLoc.includes(loc));
      });
    }
  }
  if (filters.experience) {
    const exp = filters.experience.toLowerCase();
    displayJobs = displayJobs.filter(job => job.experience?.toLowerCase().includes(exp));
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.totalPages) {
      const params = { page: newPage, limit: 12 };
      if (search) params.search = search;
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.location) params.location = filters.location;
      if (filters.experience) params.experience = filters.experience;
      dispatch(fetchJobs(params));
      
      // Smooth scroll back to top of jobs list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories = [
    'Technology', 'Design', 'Marketing', 'Sales', 'Finance', 'Human Resources',
    'Healthcare', 'Education', 'Legal', 'Operations', 'Customer Service', 'Other'
  ];

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

  const getTypeBadgeColor = (type) => {
    const colors = {
      'full-time': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      'part-time': 'bg-sky-500/15 text-sky-400 border-sky-500/20',
      contract: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      internship: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
      freelance: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    };
    return colors[type?.toLowerCase()] || 'bg-gray-500/15 text-gray-400 border-gray-500/20';
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Jobs</span> Board
          </h1>
          <p className="text-gray-400">Discover career opportunities tailored for you.</p>
        </div>
      </div>

      {/* Tabs & Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'all' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'saved' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved ({(savedJobs || []).length})
          </button>
        </div>

        {/* Profile-matching controls */}
        {activeTab === 'all' && profile && (
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-2xl backdrop-blur-md">
            <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400 animate-duration-1000" />
              Filtered by Profile {recommendationGrade ? `(${recommendationGrade})` : ''}
            </span>
            <div className="w-px h-4 bg-white/10" />
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={showAllJobs} 
                onChange={(e) => setShowAllJobs(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              <span className="text-xs text-gray-300 ml-2 font-medium select-none">
                Show All
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, company, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${
              showFilters
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-white/[0.05] text-gray-300 border-white/[0.1] hover:bg-white/[0.1]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/[0.08]">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
            >
              <option value="">All Types</option>
              {jobTypes.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
              {filters.location && (
                <span className="text-[10px] text-indigo-400 font-medium ml-1 animate-pulse flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" /> Auto-matching locations
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Experience..."
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                  title="Clear filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
          <button onClick={fetchData} className="ml-auto text-sm text-red-400 hover:text-red-300 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && jobs.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Spinner size="xl" className="mx-auto mb-4 text-indigo-500" />
            <p className="text-gray-400">Finding jobs...</p>
          </div>
        </div>
      ) : displayJobs.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Inbox className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'saved' ? 'No saved jobs' : 'No jobs found'}
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-4">
              {activeTab === 'saved'
                ? 'Bookmark jobs to save them for later.'
                : 'Try adjusting your search or filters.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayJobs.map((job) => {
              const isSaved = (savedJobs || []).some((s) => s.jobId === job.id);
              return (
                <div
                  key={job.id}
                  className="group p-5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]
                             hover:bg-white/[0.07] hover:border-white/[0.15] hover:shadow-xl hover:shadow-indigo-500/5
                             hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <Link
                          to={ROUTES.JOB_DETAIL.replace(':id', job.id)}
                          className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                          isSaved
                            ? 'text-indigo-400 bg-indigo-400/10'
                            : 'text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> {job.salaryRange}
                        </span>
                      )}
                      {job.experience && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {job.experience}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {job.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] mt-auto">
                    <div className="flex flex-wrap gap-1.5 mr-2">
                      {job.type && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getTypeBadgeColor(job.type)}`}>
                          {job.type}
                        </span>
                      )}
                      {job.category && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-white/[0.05] text-gray-400 border border-white/[0.1] max-w-[100px] truncate">
                          {job.category}
                        </span>
                      )}
                    </div>
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-md shadow-primary-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      >
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : job.postedAt && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06] mt-6">
              <p className="text-sm text-gray-400">
                Showing{' '}
                <span className="font-semibold text-white">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-white">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-semibold text-white">{pagination.total}</span> jobs
              </p>
              
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all duration-200"
                >
                  Prev
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pagination.page === p
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobsPage;
