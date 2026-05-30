import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CloudUpload, Search, AlertCircle, Check, AlertTriangle, Lightbulb, RotateCcw,
} from "lucide-react";
import { fetchResumeAnalysis, clearResumeAnalysis } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const ScoreGauge = ({ score }) => {
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

  return (
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
        <span className={`text-3xl font-bold ${color.text}`}>{score}</span>
        <span className="text-[10px] text-gray-500">out of 100</span>
      </div>
    </div>
  );
};

const ResumeAnalyzer = () => {
  const dispatch = useDispatch();
  const { resumeAnalysis, loading, error } = useSelector((s) => s.ai);
  const [resumeContent, setResumeContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (ev) => setResumeContent(ev.target.result);
      reader.readAsText(file);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (ev) => setResumeContent(ev.target.result);
      reader.readAsText(file);
    }
  };

  const handleAnalyze = () => {
    if (resumeContent.trim()) {
      dispatch(fetchResumeAnalysis(resumeContent.trim()));
    }
  };

  const analysis = resumeAnalysis?.analysis || resumeAnalysis;
  const score = analysis?.score || analysis?.overallScore || 0;
  const sections = analysis?.sections || analysis?.sectionBreakdown || [];
  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const suggestions = analysis?.suggestions || analysis?.improvements || [];
  const keywords = analysis?.keywords || analysis?.keywordAnalysis || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Resume</span> Analyzer
        </h2>
      </div>

      {!resumeAnalysis && (
        <Card>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <CloudUpload className="w-10 h-10 mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400 mb-2">
              Drag & drop your resume text here
            </p>
            <p className="text-xs text-gray-600 mb-4">or</p>
            <label className="cursor-pointer">
              <span className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                Browse files
              </span>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4">
            <textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              placeholder="Or paste your resume content here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm resize-none transition-all duration-200"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!resumeContent.trim()}
            isLoading={loading}
            fullWidth
            className="mt-4"
          >
            <Search className="w-4 h-4 mr-2" /> Analyze Resume
          </Button>
        </Card>
      )}

      {error && (
        <Card className="border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] animate-pulse">
              <div className="h-5 bg-white/5 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-white/5 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] animate-pulse flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-white/5 mb-4"></div>
            <div className="h-4 bg-white/5 rounded w-2/3"></div>
          </div>
        </div>
      )}

      {!loading && resumeAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {sections.length > 0 && (
              <Card header="Section Breakdown">
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-300">
                          {section.name || section.title || section.section}
                        </span>
                        <span className="text-sm font-bold text-indigo-400">
                          {section.score || section.rating || 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                          style={{
                            width: `${section.score || section.rating || 0}%`,
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
                <ul className="space-y-2">
                  {strengths.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </span>
                      <span>{typeof item === "string" ? item : item.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {weaknesses.length > 0 && (
              <Card header="Areas for Improvement">
                <ul className="space-y-2">
                  {weaknesses.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      </span>
                      <span>{typeof item === "string" ? item : item.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {suggestions.length > 0 && (
              <Card header="Suggestions">
                <ul className="space-y-2">
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lightbulb className="w-3 h-3 text-indigo-400" />
                      </span>
                      <span>{typeof item === "string" ? item : item.text || item.suggestion}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="text-center">
              <div className="flex flex-col items-center">
                <ScoreGauge score={score} />
                <p className="text-sm text-gray-400 mt-3">Overall Score</p>
              </div>
            </Card>

            {keywords.length > 0 && (
              <Card header="Keywords Found">
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-0.5 rounded-lg ${
                        kw.found || kw.present
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {kw.found || kw.present ? "✓ " : "✗ "}
                      {kw.keyword || kw}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setResumeContent("");
                dispatch(clearResumeAnalysis());
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Analyze Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
