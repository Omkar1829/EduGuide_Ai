import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCareerRecommendation } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import {
  DollarSign,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  AlertTriangle,
  Compass,
  RefreshCw,
} from "lucide-react";

const ConfidenceGauge = ({ score }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "#10b981"
      : score >= 60
        ? "#6366f1"
        : score >= 40
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="5"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{score}%</span>
      </div>
    </div>
  );
};

const CareerCard = ({ career, onAccept, onReject }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <ConfidenceGauge score={career.confidence || career.match || 0} />
          <div>
            <h3 className="text-lg font-semibold text-white">
              {career.title || career.name}
            </h3>
            <p className="text-sm text-gray-400">
              {career.category || "Career Path"}
            </p>
          </div>
        </div>
        <span className="badge badge-primary text-xs">
          {career.matchType || "AI Match"}
        </span>
      </div>

      {career.salary && (
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span>
              {career.salary.min?.toLocaleString()} -{" "}
              {career.salary.max?.toLocaleString()}
            </span>
          </div>
          {career.growthOutlook && (
            <div className="flex items-center gap-1.5 text-indigo-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{career.growthOutlook}</span>
            </div>
          )}
        </div>
      )}

      {career.reasoning && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          Why this matches you
        </button>
      )}

      {expanded && career.reasoning && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4 text-sm text-gray-300 leading-relaxed">
          {career.reasoning}
        </div>
      )}

      {career.requiredSkills && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {career.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-0.5 rounded-lg ${
                  career.missingSkills?.includes(skill)
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {career.missingSkills?.includes(skill) ? "⚠ " : "✓ "}
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-white/5">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onAccept?.(career)}
        >
          <Check className="w-3.5 h-3.5 mr-1" /> Accept
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-gray-400 hover:text-red-400"
          onClick={() => onReject?.(career)}
        >
          <X className="w-3.5 h-3.5 mr-1" /> Reject
        </Button>
      </div>
    </div>
  );
};

const CareerRecommendationSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 animate-pulse">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/5"></div>
          <div className="flex-1">
            <div className="h-5 bg-white/5 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-white/5 rounded w-full"></div>
          <div className="h-3 bg-white/5 rounded w-2/3"></div>
        </div>
        <div className="flex gap-2 pt-3 border-t border-white/5">
          <div className="h-8 bg-white/5 rounded-xl flex-1"></div>
          <div className="h-8 bg-white/5 rounded-xl flex-1"></div>
        </div>
      </div>
    ))}
  </div>
);

const CareerRecommendation = () => {
  const dispatch = useDispatch();
  const { careerRecommendations, loading, error } = useSelector(
    (s) => s.ai
  );

  useEffect(() => {
    dispatch(fetchCareerRecommendation());
  }, [dispatch]);

  const handleAccept = (career) => {
    console.log("Accepted career:", career);
  };

  const handleReject = (career) => {
    console.log("Rejected career:", career);
  };

  if (loading) return <CareerRecommendationSkeleton />;

  if (error) {
    return (
      <Card className="text-center py-12">
        <AlertTriangle className="w-8 h-8 text-amber-400 mb-3 mx-auto" />
        <p className="text-gray-400 mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchCareerRecommendation())}>
          Retry
        </Button>
      </Card>
    );
  }

  const careers = Array.isArray(careerRecommendations)
    ? careerRecommendations
    : careerRecommendations?.recommendations || [];

  if (careers.length === 0) {
    return (
      <Card className="text-center py-12">
        <Compass className="w-10 h-10 text-gray-600 mb-3 mx-auto" />
        <p className="text-gray-400">
          No career recommendations yet. Complete your profile to get
          personalized suggestions.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">AI</span> Career Matches
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(fetchCareerRecommendation())}
          isLoading={loading}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers.map((career, index) => (
          <CareerCard
            key={career.id || index}
            career={career}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
};

export default CareerRecommendation;
