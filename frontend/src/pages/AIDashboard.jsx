import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  Eye,
  Code,
  BarChart3,
  Palette,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Info,
  RefreshCw
} from 'lucide-react'
import { fetchCareerRecommendations, generateRecommendationsThunk } from '../store/slices/aiDashboardSlice'

const renderReasoning = (reasoning) => {
  if (!reasoning) return null;
  if (Array.isArray(reasoning)) {
    return (
      <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-400">
        {reasoning.map((item, idx) => (
          <li key={idx}>{String(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof reasoning === 'object') {
    return (
      <div className="space-y-2 text-xs text-gray-400">
        {Object.entries(reasoning).map(([key, value]) => (
          <div key={key}>
            <strong className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
            {Array.isArray(value) ? value.join(', ') : String(value)}
          </div>
        ))}
      </div>
    );
  }
  return <p className="text-xs text-gray-400">{String(reasoning)}</p>;
};

const AIDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [analysis, setAnalysis] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecId, setSelectedRecId] = useState(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  const { careerRecommendations } = useSelector((state) => state.aiDashboard)

  const handleGenerateRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      await dispatch(generateRecommendationsThunk()).unwrap()
      toast.success('AI recommendations calculated successfully!')
    } catch (err) {
      toast.error(err || 'Failed to generate recommendations. Ensure My Profile details are complete.')
    } finally {
      setLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    dispatch(fetchCareerRecommendations())
    setAnalysis({
      personalityType: 'INTJ - Architect',
      strengths: ['Analytical Thinking', 'Problem Solving', 'Creativity'],
      weakAreas: ['Public Speaking', 'Team Management'],
      learningStyle: 'Visual Learner',
    })
  }, [dispatch])

  const handleToggleReasoning = (recId) => {
    setSelectedRecId(selectedRecId === recId ? null : recId)
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span>
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">AI</span>{' '}
            Dashboard
          </span>
        </h1>
        <p className="text-gray-400">Personalized insights powered by artificial intelligence.</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Profile Match', value: '95%', icon: Target, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
          { label: 'Skills Analyzed', value: '12', icon: Zap, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
          { label: 'Career Paths', value: '3', icon: TrendingUp, color: 'from-primary-500 to-secondary-500', shadow: 'shadow-primary-500/20' },
        ].map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-white/15 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personality Analysis */}
        <Card className="lg:col-span-2" header={
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-400" />
              Personality Analysis
            </h3>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </span>
          </div>
        }>
          {analysis && (
            <div className="space-y-5">
              {/* Personality Type Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/15">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{analysis.personalityType}</h3>
                  <p className="text-sm text-gray-400">Your personality profile</p>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.strengths.map((strength, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Areas for Improvement
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.weakAreas.map((area, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Style */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-primary-400" />
                  Learning Style
                </h4>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  {analysis.learningStyle}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* AI Recommendations */}
        <Card header={
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Recommendations
            </h3>
            {careerRecommendations && careerRecommendations.length > 0 && (
              <button
                onClick={handleGenerateRecommendations}
                disabled={loadingRecommendations}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors disabled:opacity-50 shrink-0"
                title="Recalculate AI matches based on your latest profile details"
              >
                <RefreshCw className={`w-3 h-3 ${loadingRecommendations ? 'animate-spin' : ''}`} />
                Recalculate
              </button>
            )}
          </div>
        }>
          <div className="space-y-3">
            {careerRecommendations && careerRecommendations.length > 0 ? (
              careerRecommendations.slice(0, 3).map((rec, index) => {
                const matchPct = Math.round((rec.confidence || 0) * 100);
                return (
                  <div
                    key={rec.id || index}
                    onClick={() => {
                      setSelectedRecId(rec.id);
                      setIsModalOpen(true);
                    }}
                    className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer group animate-fade-in"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{rec.title}</span>
                      <span className="text-sm font-bold text-primary-400">{matchPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${matchPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500 capitalize">{rec.type?.toLowerCase() || 'career'} match</p>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-400 transition-colors" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <Info className="w-7 h-7 text-indigo-400/60 mx-auto mb-2.5" />
                <h4 className="text-xs font-bold text-white mb-1">No AI recommendations yet</h4>
                <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto mb-4 leading-normal">
                  Calculate tailored careers matching your academic records, interests, and professional skills portfolio.
                </p>
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={handleGenerateRecommendations}
                  loading={loadingRecommendations}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-2 px-3 rounded-lg shadow-md shrink-0 shadow-indigo-500/10 active:scale-95 transition-all mx-auto block"
                >
                  Check Recommendations
                </Button>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            fullWidth 
            className="mt-4" 
            icon={<ArrowRight className="w-4 h-4" />} 
            iconPosition="right"
            onClick={() => setIsModalOpen(true)}
          >
            View All Recommendations
          </Button>
        </Card>
      </div>

      {/* Career Path Suggestions */}
      <Card header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Career Path Suggestions
          </h3>
          <span className="text-xs text-gray-500">Based on your profile</span>
        </div>
      }>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Technology', paths: ['Software Engineering', 'Data Science', 'AI/ML'], icon: Code, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
            { title: 'Business', paths: ['Product Management', 'Consulting', 'Entrepreneurship'], icon: BarChart3, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
            { title: 'Creative', paths: ['UX Design', 'Content Strategy', 'Digital Marketing'], icon: Palette, color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
          ].map((category, index) => (
            <Link
              key={index}
              to="/courses"
              className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300 group cursor-pointer block"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-lg ${category.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-3 text-lg">{category.title}</h3>
              <ul className="space-y-2">
                {category.paths.map((path, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    <div className={`w-1.5 h-1.5 rounded-full ${category.bg} ${category.border} border`} />
                    {path}
                  </li>
                ))}
              </ul>
              <div 
                className={`mt-4 text-sm font-medium ${category.text} flex items-center gap-1 hover:gap-2 transition-all duration-200`}
              >
                Explore
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Career Recommendations Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecId(null);
        }}
        title="AI Career Path Insights"
        size="lg"
      >
        <div className="space-y-5 py-2">
          <div className="flex items-center gap-2 mb-4 bg-primary-500/10 border border-primary-500/20 p-3.5 rounded-xl">
            <Sparkles className="w-5 h-5 text-primary-400 shrink-0 animate-pulse" />
            <p className="text-xs text-gray-300 leading-relaxed">
              These suggestions are computed using a deep-learning analysis of your skill levels, interests, strengths, and academic history. Click on any path to toggle deep-dive AI reasoning.
            </p>
          </div>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
            {careerRecommendations && careerRecommendations.length > 0 ? (
              careerRecommendations.map((rec, index) => {
                const matchPct = Math.round((rec.confidence || 0) * 100);
                const isExpanded = selectedRecId === rec.id;
                
                return (
                  <div 
                    key={rec.id || index}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/12 transition-all duration-300 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-primary-500/10 border border-primary-500/20 text-primary-300 mb-1.5">
                          {rec.type || 'CAREER'}
                        </span>
                        <h4 className="text-lg font-bold text-white tracking-tight">{rec.title}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                        <span className="text-xs text-gray-500">Confidence Score:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow shadow-emerald-500/10">
                          {matchPct}% Match
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 leading-relaxed font-normal bg-white/[0.01] p-3 rounded-xl border border-white/5">
                      {rec.description}
                    </p>
                    
                    {/* Expandable Reasoning Accordion */}
                    <div className="border-t border-white/5 pt-3">
                      <button
                        onClick={() => handleToggleReasoning(rec.id)}
                        className="flex items-center justify-between w-full text-xs font-bold text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-primary-400" />
                          Deep AI Reasoning Insights
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-3 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/15 text-xs text-gray-300 space-y-3.5 animate-slide-down">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-indigo-400" /> Analyzed Fit Factors
                          </div>
                          {renderReasoning(rec.reasoning)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <Info className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 italic">No recommendations loaded.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AIDashboard
