import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseRecommendations } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  GraduationCap,
  Star,
  Clock,
  Signal,
  ExternalLink,
  Search,
  AlertCircle,
  BookOpen,
} from "lucide-react";

const CourseCard = ({ course }) => {
  const matchScore = course.matchScore || course.match || 0;

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">
              {course.title || course.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {course.provider || course.platform || "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Star className="w-2.5 h-2.5 text-indigo-400" />
          <span className="text-xs font-bold text-indigo-400">{matchScore}%</span>
        </div>
      </div>

      {course.reasoning && (
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          {course.reasoning}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {(course.skills || course.tags || []).slice(0, 4).map((skill, i) => (
          <span
            key={i}
            className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-gray-400 border border-white/5"
          >
            {typeof skill === "string" ? skill : skill.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          )}
          {course.level && (
            <span className="flex items-center gap-1">
              <Signal className="w-3 h-3" />
              {course.level}
            </span>
          )}
        </div>
        <a
          href={course.url || course.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="sm">
            <ExternalLink className="w-3 h-3 mr-1" /> Enroll
          </Button>
        </a>
      </div>
    </div>
  );
};

const CourseRecommendations = () => {
  const dispatch = useDispatch();
  const { courseRecommendations, loading, error } = useSelector((s) => s.ai);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    maxPrice: "",
  });

  const handleAnalyze = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v.trim())
    );
    dispatch(fetchCourseRecommendations(activeFilters));
  };

  const courses = Array.isArray(courseRecommendations)
    ? courseRecommendations
    : courseRecommendations?.courses || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">Course</span> Recommendations
        </h2>
      </div>

      <Card>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Category</label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              >
                <option value="">All Categories</option>
                <option value="programming">Programming</option>
                <option value="data-science">Data Science</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Level</label>
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, level: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                placeholder="e.g., 100"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>
          <Button type="submit" isLoading={loading} fullWidth>
            <Search className="w-4 h-4 mr-2" /> Get Recommendations
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
              <div className="h-8 bg-white/5 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <CourseCard key={course.id || index} course={course} />
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="w-10 h-10 text-gray-600 mb-3 mx-auto" />
          <p className="text-gray-400">
            Get AI-powered course recommendations based on your profile.
          </p>
        </Card>
      )}
    </div>
  );
};

export default CourseRecommendations;
