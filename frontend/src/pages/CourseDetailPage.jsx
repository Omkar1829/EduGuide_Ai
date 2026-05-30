import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Building2, Star, Clock, Users, ExternalLink } from 'lucide-react';
import {
  fetchCourses,
  fetchCourseById,
  clearCurrentCourse,
} from '../store/slices/courseSlice';
import CourseList from '../features/courses/CourseList';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, loading } = useSelector((state) => state.courses);
  const { courses: relatedCourses = [] } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourseById(id));
    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentCourse?.category) {
      dispatch(fetchCourses({ category: currentCourse.category, limit: 4 }));
    }
  }, [dispatch, currentCourse?.category]);

  if (loading || !currentCourse) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="h-64 bg-white/[0.05] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
            <div className="h-4 bg-white/10 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    provider,
    category,
    rating,
    price,
    currency = 'INR',
    duration,
    level,
    enrolledCount = 0,
    url,
  } = currentCourse;

  const formatPrice = (amount) => {
    if (amount === 0 || amount === null) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const relatedFiltered = relatedCourses.filter((c) => c.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8 pb-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Card */}
          <div className="relative p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-glass">
            {/* Subtle gradient glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />

            <div className="relative space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary-500/15 text-primary-400 border border-primary-500/20">
                  {category}
                </span>
                {level && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/[0.05] text-gray-300 border border-white/[0.1]">
                    {level}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold text-white leading-tight">{title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  {provider}
                </span>
                {rating && (
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {rating.toFixed(1)}
                  </span>
                )}
                {duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {duration}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-500" />
                  {enrolledCount.toLocaleString()} learners
                </span>
              </div>

              <div className="h-px bg-white/10 my-4" />

              <div>
                <h3 className="text-white text-lg font-bold mb-3">About this Course</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {description || 'No description available for this course.'}
                </p>
              </div>
            </div>
          </div>

          {relatedFiltered.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full" />
                Related Courses
              </h3>
              <CourseList courses={relatedFiltered} loading={false} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] sticky top-24 space-y-6 shadow-glass">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Course Price</span>
              <div className="text-3xl font-black text-white">{formatPrice(price)}</div>
            </div>

            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-xl shadow-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] border border-primary-500/30"
              >
                <ExternalLink className="w-4 h-4" />
                Go to Course Provider
              </a>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-gray-400 italic">
                Syllabus details curated by AI. Provider link coming soon!
              </div>
            )}

            <div className="space-y-4 pt-2">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Details</h4>
              <div className="space-y-3 text-xs">
                {category && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white font-semibold">{category}</span>
                  </div>
                )}
                {level && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skill Level</span>
                    <span className="text-white font-semibold capitalize">{level}</span>
                  </div>
                )}
                {duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-semibold">{duration}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Institution / Provider</span>
                  <span className="text-white font-semibold">{provider}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
