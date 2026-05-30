import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Sparkles, ShieldAlert, Award, FileText, CheckCircle, AlertCircle, 
  ArrowRight, Download, Printer, Percent, Cpu, Briefcase 
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import PricingModal from '../components/common/PricingModal';
import Spinner from '../components/common/Spinner';

const ResumeBuilderPage = () => {
  const { user } = useSelector((state) => state.auth || {});
  
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const isProPlus = user?.subscriptionTier === 'PRO_PLUS';

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.warning('Please paste a job description first.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/ai/resume-builder/compare', { jobDescription });
      if (response.success) {
        setComparisonResult(response.data);
        toast.success('Resume customized perfectly!');
      } else {
        toast.error('Failed to compare. Try again.');
      }
    } catch (err) {
      toast.error(err.message || 'Error occurred while customizing resume.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Locked UI Screen for non-PRO_PLUS members
  if (!isProPlus) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -top-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-12 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 glass border border-amber-500/20 rounded-3xl p-8 max-w-lg shadow-glass bg-gray-900/60 backdrop-blur-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
            <Cpu className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Feature
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
            AI Resume Customizer
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            Compare your profile against any active job description instantly. Our advanced Gemini engine calculates a real-time match score, identifies skill gaps, and custom-tailors a clean, professional PDF resume using only your verified details.
          </p>

          <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 space-y-2 text-left text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tailor resumes automatically to match job keywords</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verify profile compatibility with matching and missing skills</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict compliance policy - no false or inflated entries</span>
            </div>
          </div>

          <button
            onClick={() => setShowPricingModal(true)}
            className="w-full py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Upgrade to Pro Plus
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <PricingModal 
          isOpen={showPricingModal} 
          onClose={() => setShowPricingModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8 print:p-0 print:bg-white print:text-black">
      {/* Header (hidden in print) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AI Resume</span> Builder
          </h1>
          <p className="text-gray-400">Match your verified profile perfectly to target job descriptions without any fluff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Paste JD Form (hidden in print) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="glass border border-white/10 rounded-2xl p-6 bg-slate-900/40 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-400" />
              Target Job Details
            </h2>
            <form onSubmit={handleCompare} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Paste Job Description
                </label>
                <textarea
                  rows="12"
                  placeholder="Paste the full job requirements, skills, or job description text here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm leading-relaxed"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    Customizing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Customize & Tailor Resume
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Guidelines info */}
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-gray-400 leading-relaxed">
            <h3 className="font-semibold text-gray-300 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              No False Entry Guarantee
            </h3>
            To prevent career fraud, the AI Resume Customizer only utilizes academic degree information, GPA, verified skills, and certifications registered directly in your Student Profile.
          </div>
        </div>

        {/* Right Side: Analysis and Preview */}
        <div className="lg:col-span-7 space-y-6">
          {comparisonResult ? (
            <>
              {/* Match Score Metrics (hidden in print) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
                <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 to-transparent flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-black">Compatibility</span>
                    <span className="text-2xl font-black text-white">{comparisonResult.matchScore}%</span>
                  </div>
                </div>

                <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-black">Matched Skills</span>
                    <span className="text-2xl font-black text-white">{comparisonResult.matchedSkills?.length || 0}</span>
                  </div>
                </div>

                <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-rose-500/10 to-transparent flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-black">Missing Gaps</span>
                    <span className="text-2xl font-black text-white">{comparisonResult.missingSkills?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Skills Analysis Accordions (hidden in print) */}
              <div className="glass border border-white/10 rounded-2xl p-6 bg-slate-900/20 space-y-4 print:hidden">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Skill Gap Assessment</h3>
                
                {comparisonResult.matchedSkills?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs text-emerald-400 font-semibold">Matched Keywords & Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {comparisonResult.matchedSkills.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {comparisonResult.missingSkills?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs text-rose-400 font-semibold">Missing/Highly Recommended Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {comparisonResult.missingSkills.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Box (hidden in print) */}
              <div className="flex justify-end gap-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/15 border border-white/10 flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  Print Resume
                </button>
              </div>

              {/* Paper Resume Document Preview */}
              <div className="bg-white text-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 aspect-[1/1.4] w-full max-w-2xl mx-auto flex flex-col justify-between font-sans leading-relaxed select-text">
                <div className="space-y-6">
                  {/* Name & Contact */}
                  <div className="border-b-2 border-slate-900 pb-5 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">{user?.email}</p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-200 pb-1">
                      Professional Summary
                    </h3>
                    <p className="text-xs text-slate-700 font-normal leading-relaxed text-justify">
                      {comparisonResult.tailoredResume?.summary}
                    </p>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-200 pb-1">
                      Academic Background
                    </h3>
                    <div className="space-y-3">
                      {comparisonResult.tailoredResume?.education?.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{edu.degree}</span>
                            <span className="text-slate-500 block">{edu.institution}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-700 font-semibold">{edu.period}</span>
                            <span className="text-emerald-600 font-bold block">{edu.gpa}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-200 pb-1">
                      Key Technical Competencies
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {comparisonResult.tailoredResume?.skills?.map((sk, idx) => (
                        <span key={idx} className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          • {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience & Projects */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-200 pb-1">
                      Experience & Selected Projects
                    </h3>
                    <div className="space-y-4">
                      {comparisonResult.tailoredResume?.experience?.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {exp.details?.map((det, dIdx) => (
                              <li key={dIdx} className="text-[11px] text-slate-700 leading-normal text-justify">
                                {det}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer validation */}
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-[9px] text-slate-400">
                  <span>Generated by EduGuide AI Counselor</span>
                  <span>100% Profile Verified Records</span>
                </div>
              </div>
            </>
          ) : (
            <div className="glass border border-white/5 rounded-3xl p-12 text-center bg-white/[0.01] flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-600 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">No Comparison Generated</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                Paste a target job description on the left and hit Customize to design your highly professional tailored resume instantly.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilderPage;
