import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkillGap } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import ProgressBar from "../../components/common/ProgressBar";
import {
  Search,
  AlertCircle,
  Check,
  ExternalLink,
  Crosshair,
} from "lucide-react";

const SkillBar = ({ skill, current, required }) => {
  const gap = required - current;
  const gapColor =
    gap <= 10
      ? "text-emerald-400"
      : gap <= 25
        ? "text-amber-400"
        : "text-rose-400";
  const barColor =
    gap <= 10 ? "bg-emerald-500" : gap <= 25 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-200">{skill}</span>
        <span className={`text-xs font-bold ${gapColor}`}>Gap: {gap}%</span>
      </div>
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-indigo-500/60 rounded-full transition-all duration-700"
          style={{ width: `${current}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 border-r-2 border-dashed border-white/40 transition-all duration-700"
          style={{ width: `${required}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>Current: {current}%</span>
        <span>Required: {required}%</span>
      </div>
    </div>
  );
};

const SkillGapAnalysis = () => {
  const dispatch = useDispatch();
  const { skillGap, loading, error } = useSelector((s) => s.ai);
  const [targetCareer, setTargetCareer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetCareer.trim()) {
      dispatch(fetchSkillGap(targetCareer.trim()));
    }
  };

  const skills = skillGap?.skills || skillGap?.skillGaps || [];
  const gapScore = skillGap?.gapScore || skillGap?.overallScore || 0;
  const improvements = skillGap?.improvements || skillGap?.improvementPlan || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">Skill</span> Gap Analysis
        </h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={targetCareer}
            onChange={(e) => setTargetCareer(e.target.value)}
            placeholder="Enter target career (e.g., Software Engineer)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
          <Button type="submit" isLoading={loading}>
            <Search className="w-4 h-4 mr-1" /> Analyze
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
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-white/5 rounded w-full mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && skillGap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card header="Current vs Required Skills">
              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <SkillBar
                    key={skill.name || index}
                    skill={skill.name || skill.skill}
                    current={skill.current || skill.currentLevel || 0}
                    required={skill.required || skill.requiredLevel || 0}
                  />
                ))}
              </div>
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1.5 rounded-full bg-indigo-500/60" />
                  <span className="text-[10px] text-gray-500">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0 border-t-2 border-dashed border-white/40" />
                  <span className="text-[10px] text-gray-500">Required</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="text-center">
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={gapScore >= 70 ? "#10b981" : gapScore >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - gapScore / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{gapScore}%</span>
                  <span className="text-[10px] text-gray-500">Match</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">Overall Match Score</p>
            </Card>

            {improvements.length > 0 && (
              <Card header="Improvement Plan">
                <ul className="space-y-2.5">
                  {improvements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-indigo-400" />
                      </span>
                      <span>{typeof item === "string" ? item : item.text || item.action}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {skillGap?.resources && (
              <Card header="Resources">
                <ul className="space-y-2">
                  {skillGap.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {resource.title || resource.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      )}

      {!loading && !skillGap && (
        <Card className="text-center py-12">
          <Crosshair className="w-10 h-10 text-gray-600 mb-3 mx-auto" />
          <p className="text-gray-400">
            Enter your target career to analyze your skill gaps.
          </p>
        </Card>
      )}
    </div>
  );
};

export default SkillGapAnalysis;
