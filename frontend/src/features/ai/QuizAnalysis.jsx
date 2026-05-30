import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizAnalysis } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  PieChart,
  AlertCircle,
  Briefcase,
  Lightbulb,
  ClipboardCheck,
} from "lucide-react";

const PerformanceGauge = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? { text: "text-emerald-400", stroke: "#10b981" }
      : score >= 60
        ? { text: "text-indigo-400", stroke: "#6366f1" }
        : score >= 40
          ? { text: "text-amber-400", stroke: "#f59e0b" }
          : { text: "text-rose-400", stroke: "#ef4444" };

  const label =
    score >= 80
      ? "Excellent"
      : score >= 60
        ? "Good"
        : score >= 40
          ? "Average"
          : "Needs Improvement";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color.text}`}>{score}%</span>
          <span className="text-[10px] text-gray-500">{label}</span>
        </div>
      </div>
    </div>
  );
};

const QuizAnalysis = () => {
  const dispatch = useDispatch();
  const { quizAnalysis, loading, error } = useSelector((s) => s.ai);
  const [quizId, setQuizId] = useState("");
  const [resultId, setResultId] = useState("");

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (quizId.trim() && resultId.trim()) {
      dispatch(
        fetchQuizAnalysis({ quizId: quizId.trim(), resultId: resultId.trim() })
      );
    }
  };

  const analysis = quizAnalysis?.analysis || quizAnalysis;
  const score = analysis?.score || analysis?.overallScore || 0;
  const categories = analysis?.categories || analysis?.categoryBreakdown || [];
  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const recommendations = analysis?.recommendations || [];
  const careerSuggestions = analysis?.careerSuggestions || analysis?.careers || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">Quiz</span> Analysis
        </h2>
      </div>

      {!quizAnalysis && (
        <Card>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Quiz ID</label>
                <input
                  type="text"
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  placeholder="Enter quiz ID"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Result ID</label>
                <input
                  type="text"
                  value={resultId}
                  onChange={(e) => setResultId(e.target.value)}
                  placeholder="Enter result ID"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!quizId.trim() || !resultId.trim()}
              isLoading={loading}
              fullWidth
            >
              <PieChart className="w-4 h-4 mr-2" /> Analyze Quiz Results
            </Button>
          </form>
        </Card>
      )}

      {error && (
        <Card className="border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 animate-pulse flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-white/5 mb-4"></div>
            <div className="h-4 bg-white/5 rounded w-2/3"></div>
          </div>
          <div className="lg:col-span-2 rounded-2xl bg-white/[0.04] border border-white/10 p-6 animate-pulse">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-white/5 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && quizAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Card className="text-center">
              <PerformanceGauge score={score} />
              <p className="text-sm text-gray-400 mt-3">Overall Performance</p>
            </Card>

            {careerSuggestions.length > 0 && (
              <Card header="Career Suggestions">
                <ul className="space-y-2">
                  {careerSuggestions.map((career, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {typeof career === "string"
                            ? career
                            : career.name || career.title}
                        </p>
                        {career.match && (
                          <p className="text-[10px] text-indigo-400">
                            {career.match}% match
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {categories.length > 0 && (
              <Card header="Category Breakdown">
                <div className="space-y-4">
                  {categories.map((cat, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-300">
                          {cat.name || cat.category}
                        </span>
                        <span className="text-sm font-bold text-indigo-400">
                          {cat.score || cat.percentage || 0}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                          style={{
                            width: `${cat.score || cat.percentage || 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {strengths.length > 0 && (
              <Card header="Strengths">
                <div className="flex flex-wrap gap-2">
                  {strengths.map((item, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    >
                      ✓ {typeof item === "string" ? item : item.text || item.skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {weaknesses.length > 0 && (
              <Card header="Areas for Improvement">
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map((item, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    >
                      ⚠ {typeof item === "string" ? item : item.text || item.skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {recommendations.length > 0 && (
              <Card header="Recommendations">
                <ul className="space-y-2">
                  {recommendations.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lightbulb className="w-2.5 h-2.5 text-indigo-400" />
                      </span>
                      <span>
                        {typeof item === "string"
                          ? item
                          : item.text || item.suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      )}

      {!loading && !quizAnalysis && (
        <Card className="text-center py-12">
          <ClipboardCheck className="w-10 h-10 text-gray-600 mb-3 mx-auto" />
          <p className="text-gray-400">
            Enter your quiz and result IDs to get AI-powered analysis.
          </p>
        </Card>
      )}
    </div>
  );
};

export default QuizAnalysis;
