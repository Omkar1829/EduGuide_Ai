import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFutureSimulation } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  Code,
  BarChart3,
  Briefcase,
  CheckCircle,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  ArrowUp,
} from "lucide-react";

const pathIcons = {
  "Software Engineering": Code,
  "Data Science": BarChart3,
  "Product Management": Briefcase,
};

const defaultPaths = [
  { id: 1, name: "Software Engineering", color: "from-blue-500 to-cyan-500" },
  { id: 2, name: "Data Science", color: "from-purple-500 to-pink-500" },
  { id: 3, name: "Product Management", color: "from-emerald-500 to-teal-500" },
];

const PathSelector = ({ paths, selected, onToggle }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {paths.map((path) => {
      const isSelected = selected.includes(path.name);
      const IconComponent = pathIcons[path.name] || Briefcase;
      return (
        <button
          key={path.id}
          onClick={() => onToggle(path.name)}
          className={`p-4 rounded-xl border text-left transition-all ${
            isSelected
              ? "bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20"
              : "bg-white/[0.02] border-white/5 hover:border-white/10"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-3`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-sm font-medium text-white">{path.name}</h4>
          {isSelected && (
            <CheckCircle className="w-4 h-4 text-indigo-400 mt-2" />
          )}
        </button>
      );
    })}
  </div>
);

const ComparisonBar = ({ label, values, colors }) => (
  <div className="space-y-2">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
      {label}
    </span>
    <div className="space-y-2">
      {values.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-28 truncate">{item.label}</span>
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${colors[i]} transition-all duration-700`}
              style={{ width: `${item.value}%` }}
            />
          </div>
          <span className="text-xs font-bold text-white w-10 text-right">
            {item.display || `${item.value}%`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const FutureSimulator = () => {
  const dispatch = useDispatch();
  const { simulation, loading, error } = useSelector((s) => s.ai);
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [timeline, setTimeline] = useState(5);

  const togglePath = (name) => {
    setSelectedPaths((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleSimulate = () => {
    if (selectedPaths.length >= 2) {
      dispatch(
        fetchFutureSimulation({ paths: selectedPaths, timeline })
      );
    }
  };

  const results = simulation?.results || simulation?.paths || [];
  const comparison = simulation?.comparison || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">Future</span> Simulator
        </h2>
      </div>

      <Card>
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Select 2-3 career paths to compare
        </h3>
        <PathSelector
          paths={defaultPaths}
          selected={selectedPaths}
          onToggle={togglePath}
        />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Timeline</span>
            <span className="text-sm font-bold text-indigo-400">{timeline} years</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={timeline}
            onChange={(e) => setTimeline(Number(e.target.value))}
            className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>1 year</span>
            <span>15 years</span>
          </div>
        </div>

        <Button
          onClick={handleSimulate}
          disabled={selectedPaths.length < 2}
          isLoading={loading}
          fullWidth
          className="mt-6"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Simulate Future
        </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 animate-pulse">
              <div className="h-5 bg-white/5 rounded w-2/3 mb-3"></div>
              <div className="h-32 bg-white/5 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded"></div>
                <div className="h-3 bg-white/5 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <Card key={index}>
                <div className="text-center mb-4">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {result.path || result.name}
                  </h3>
                  <span className="text-xs text-gray-500">{timeline}-year projection</span>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-emerald-400">
                      {result.salary || result.projectedSalary || "N/A"}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5">Projected Salary</p>
                  </div>

                  <div className="text-center">
                    <span className="text-lg font-bold text-indigo-400">
                      {result.probability || result.successRate || "N/A"}%
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5">Success Probability</p>
                  </div>

                  {result.salaryProgression && (
                    <div className="space-y-1">
                      {result.salaryProgression.map((year, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Year {year.year || i + 1}</span>
                          <span className="text-gray-300 font-medium">{year.salary}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  {result.risks && result.risks.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-[10px] font-medium text-amber-400 uppercase tracking-wider mb-1.5">
                        Risks
                      </h4>
                      <ul className="space-y-1">
                        {result.risks.map((risk, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-400 mt-0.5 flex-shrink-0" />
                            {typeof risk === "string" ? risk : risk.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.opportunities && result.opportunities.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mb-1.5">
                        Opportunities
                      </h4>
                      <ul className="space-y-1">
                        {result.opportunities.map((opp, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                            <ArrowUp className="w-2.5 h-2.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {typeof opp === "string" ? opp : opp.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {comparison && Object.keys(comparison).length > 0 && (
            <Card header="Side-by-Side Comparison">
              <div className="space-y-6">
                {comparison.salaryComparison && (
                  <ComparisonBar
                    label="Salary Potential"
                    values={comparison.salaryComparison}
                    colors={["bg-emerald-500", "bg-purple-500", "bg-blue-500"]}
                  />
                )}
                {comparison.growthComparison && (
                  <ComparisonBar
                    label="Growth Outlook"
                    values={comparison.growthComparison}
                    colors={["bg-emerald-500", "bg-purple-500", "bg-blue-500"]}
                  />
                )}
                {comparison.demandComparison && (
                  <ComparisonBar
                    label="Market Demand"
                    values={comparison.demandComparison}
                    colors={["bg-emerald-500", "bg-purple-500", "bg-blue-500"]}
                  />
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {!loading && !simulation && (
        <Card className="text-center py-12">
          <Sparkles className="w-10 h-10 text-gray-600 mb-3 mx-auto" />
          <p className="text-gray-400">
            Select at least 2 career paths and simulate your future.
          </p>
        </Card>
      )}
    </div>
  );
};

export default FutureSimulator;
