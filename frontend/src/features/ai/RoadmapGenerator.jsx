import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoadmap } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  Check,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Route,
  AlertCircle,
  MapPinned,
} from "lucide-react";

const MilestoneMarker = ({ completed }) => (
  <div
    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
      completed
        ? "bg-emerald-500 border-emerald-500"
        : "bg-transparent border-white/20"
    }`}
  >
    {completed && <Check className="w-2 h-2 text-white" />}
  </div>
);

const PhaseCard = ({ phase, index, isExpanded, onToggle }) => {
  const completedTasks =
    phase.tasks?.filter((t) => t.completed || t.status === "completed") || [];
  const progress = phase.tasks?.length
    ? Math.round((completedTasks.length / phase.tasks.length) * 100)
    : 0;

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {phase.title || phase.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {phase.duration || phase.timeline || "Flexible timeline"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-400">{progress}%</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          {phase.description && (
            <p className="text-sm text-gray-400 mt-4 mb-4">{phase.description}</p>
          )}

          <div className="space-y-2.5 mt-4">
            {phase.tasks?.map((task, taskIndex) => (
              <div
                key={task.id || taskIndex}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  task.completed || task.status === "completed"
                    ? "bg-emerald-500/5 border border-emerald-500/10"
                    : "bg-white/[0.02] border border-white/5"
                }`}
              >
                <MilestoneMarker
                  completed={task.completed || task.status === "completed"}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      task.completed || task.status === "completed"
                        ? "text-gray-400 line-through"
                        : "text-gray-200"
                    }`}
                  >
                    {task.title || task.name || task.description}
                  </p>
                  {task.resource && (
                    <a
                      href={task.resource.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {task.resource.title || "Resource"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {phase.resources && phase.resources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Resources
              </h4>
              <div className="flex flex-wrap gap-2">
                {phase.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                  >
                    {resource.title || resource.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RoadmapGenerator = () => {
  const dispatch = useDispatch();
  const { roadmap, loading, error } = useSelector((s) => s.ai);
  const [targetCareer, setTargetCareer] = useState("");
  const [expandedPhase, setExpandedPhase] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetCareer.trim()) {
      dispatch(fetchRoadmap(targetCareer.trim()));
    }
  };

  const phases = roadmap?.phases || roadmap?.steps || [];
  const totalTasks = phases.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedTasks = phases.reduce(
    (acc, p) =>
      acc +
      (p.tasks?.filter((t) => t.completed || t.status === "completed").length || 0),
    0
  );
  const overallProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">Career</span> Roadmap
        </h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={targetCareer}
            onChange={(e) => setTargetCareer(e.target.value)}
            placeholder="Enter target career (e.g., Full Stack Developer)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
          <Button type="submit" isLoading={loading}>
            <Route className="w-4 h-4 mr-1" /> Generate
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
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/5 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-white/5 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && roadmap && phases.length > 0 && (
        <>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Overall Progress</span>
              <span className="text-sm font-bold text-indigo-400">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>
                {completedTasks}/{totalTasks} tasks completed
              </span>
              <span>{phases.length} phases</span>
            </div>
          </Card>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/5 hidden md:block"></div>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={phase.id || index} className="relative md:pl-12">
                  <div className="absolute left-3 top-5 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-4 border-gray-950 hidden md:block z-10"></div>
                  <PhaseCard
                    phase={phase}
                    index={index}
                    isExpanded={expandedPhase === index}
                    onToggle={() =>
                      setExpandedPhase(expandedPhase === index ? -1 : index)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && !roadmap && (
        <Card className="text-center py-12">
          <MapPinned className="w-10 h-10 text-gray-600 mb-3 mx-auto" />
          <p className="text-gray-400">
            Enter a target career to generate your personalized roadmap.
          </p>
        </Card>
      )}
    </div>
  );
};

export default RoadmapGenerator;
