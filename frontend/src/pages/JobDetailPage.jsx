import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Calendar, Bookmark, ExternalLink } from 'lucide-react';
import { fetchJobs, fetchJobById, saveJob, removeSavedJob, updateJobStatus, clearCurrentJob } from '../store/slices/jobSlice';
import JobList from '../features/jobs/JobList';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentJob, savedItems, loading } = useSelector((state) => state.jobs);
  const { items: similarJobs } = useSelector((state) => state.jobs);

  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob?.category) {
      dispatch(fetchJobs({ category: currentJob.category, limit: 4 }));
    }
  }, [dispatch, currentJob?.category]);

  const handleSave = async () => {
    const isSaved = savedItems.some((j) => j.jobId === id);
    if (isSaved) {
      const savedJob = savedItems.find((j) => j.jobId === id);
      if (savedJob) {
        await dispatch(removeSavedJob(savedJob.id));
      }
    } else {
      await dispatch(saveJob(id));
    }
  };

  const handleStatusUpdate = async (status) => {
    await dispatch(updateJobStatus({ jobId: id, status }));
    setShowStatusModal(false);
  };

  if (loading || !currentJob) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="p-6 rounded-2xl bg-white/[0.04] space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/2" />
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
              <div className="h-4 bg-white/10 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    company,
    location,
    salaryRange,
    experience,
    skills = [],
    category,
    type,
    postedAt,
    url,
    savedJob,
  } = currentJob;

  const isSaved = savedItems.some((j) => j.jobId === id);
  const similarFiltered = similarJobs.filter((j) => j.id !== id).slice(0, 3);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'full-time': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'part-time': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      contract: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      internship: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[type?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const statusOptions = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Card */}
          <div className="relative p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeBadgeColor(type)}`}>
                  {type || 'Full-time'}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/[0.05] text-gray-300 border border-white/[0.1]">
                  {category}
                </span>
                {savedJob?.status && savedJob.status !== 'saved' && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 capitalize">
                    {savedJob.status}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
              <p className="text-xl text-gray-300 mb-4">{company}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </span>
                )}
                {salaryRange && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    {salaryRange}
                  </span>
                )}
                {experience && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {experience}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Posted {formatDate(postedAt)}
                </span>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-white text-lg font-semibold mb-3">Job Description</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {description || 'No description available for this job.'}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
            <h3 className="text-white text-lg font-semibold mb-4">Skills Required</h3>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No specific skills mentioned</p>
            )}
          </div>

          {similarFiltered.length > 0 && (
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">Similar Jobs</h3>
              <JobList
                jobs={similarFiltered}
                loading={false}
                savedJobIds={savedItems.map((j) => j.jobId)}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] sticky top-24 space-y-6">
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save Job'}
              </button>

              <button
                onClick={() => setShowStatusModal(true)}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1] transition-all duration-200"
              >
                Update Status
              </button>

              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-center bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply on Company Site
                </a>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-white font-medium">Job Details</h4>
              <div className="space-y-3 text-sm">
                {company && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company</span>
                    <span className="text-white">{company}</span>
                  </div>
                )}
                {location && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{location}</span>
                  </div>
                )}
                {type && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white capitalize">{type}</span>
                  </div>
                )}
                {experience && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white">{experience}</span>
                  </div>
                )}
                {salaryRange && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Salary</span>
                    <span className="text-white">{salaryRange}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="p-6 w-full max-w-md rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl shadow-black/50">
            <h3 className="text-xl font-bold text-white mb-4">Update Application Status</h3>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusUpdate(option.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                    savedJob?.status === option.value
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1] transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
