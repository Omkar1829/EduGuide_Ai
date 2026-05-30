import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
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
  TrendingUp
} from 'lucide-react'

const AIDashboard = () => {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    setAnalysis({
      personalityType: 'INTJ - Architect',
      strengths: ['Analytical Thinking', 'Problem Solving', 'Creativity'],
      weakAreas: ['Public Speaking', 'Team Management'],
      learningStyle: 'Visual Learner',
    })
    setRecommendations([
      { type: 'career', title: 'Software Engineer', match: 95 },
      { type: 'career', title: 'Data Scientist', match: 88 },
      { type: 'career', title: 'Product Manager', match: 82 },
    ])
  }, [])

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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Recommendations
            </h3>
          </div>
        }>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{rec.title}</span>
                  <span className="text-sm font-bold text-primary-400">{rec.match}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${rec.match}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 capitalize">{rec.type} match</p>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" fullWidth className="mt-4" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
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
    </div>
  )
}

export default AIDashboard
