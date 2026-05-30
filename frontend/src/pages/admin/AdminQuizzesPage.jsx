import { useState, useEffect, useCallback } from 'react'
import { Brain, Search, Trash2, Eye, X, Check, HelpCircle, AlertTriangle, Calendar } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import Spinner from '../../components/common/Spinner'
import api from '../../services/api'
import { toast } from 'react-toastify'

const AdminQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const [quizDetails, setQuizDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const categories = [
    'CAREER_INTEREST',
    'PERSONALITY',
    'SKILL_ASSESSMENT',
    'APTITUDE',
    'LEARNING_STYLE'
  ]

  const fetchQuizzes = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (status) params.append('status', status)

      const response = await api.get(`/admin/quizzes?${params.toString()}`)
      if (response.success) {
        setQuizzes(response.data.quizzes || [])
        setPagination(response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch quizzes')
      toast.error(err.message || 'Failed to fetch quizzes')
    } finally {
      setLoading(false)
    }
  }, [search, category, status])

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchQuizzes(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [search, category, status, fetchQuizzes])

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/quizzes/${id}`)
      if (response.success) {
        toast.success('Quiz deleted successfully')
        fetchQuizzes(pagination.page)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete quiz')
    }
  }

  const handleViewDetails = async (quiz) => {
    setViewTarget(quiz)
    setDetailsLoading(true)
    setQuizDetails(null)
    try {
      const response = await api.get(`/admin/quizzes/${quiz.id}`)
      if (response.success) {
        setQuizDetails(response.data)
      }
    } catch (err) {
      toast.error('Failed to load quiz details')
    } finally {
      setDetailsLoading(false)
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Quiz Title',
      sortable: true,
      render: (_, quiz) => (
        <div>
          <p className="font-semibold text-white">{quiz.title}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      ),
    },
    {
      key: 'studentName',
      label: 'Student',
      sortable: true,
      render: (name, quiz) => (
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-xs text-gray-500">{quiz.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (cat) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
          {cat ? cat.replace('_', ' ') : 'General'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (stat) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
          stat === 'completed' 
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
            : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
        }`}>
          {stat === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (_, quiz) => {
        const result = quiz.results?.[0]
        if (!result) return <span className="text-gray-500 text-sm">-</span>
        return (
          <span className="font-bold text-white">
            {result.score}/{result.maxScore} <span className="text-xs text-primary-400">({result.percentage.toFixed(0)}%)</span>
          </span>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (_, quiz) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewDetails(quiz)}
            className="p-2 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(quiz)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            title="Delete Quiz"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            Quizzes Management
          </h1>
          <p className="text-gray-400 mt-1">Review and manage generated students personality, skills, and aptitude quizzes.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by student name or quiz title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
        >
          <option value="">All Statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <AdminTable
        columns={columns}
        data={quizzes}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchQuizzes(page)}
        emptyMessage="No quizzes found matching filters"
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          handleDelete(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${deleteTarget?.title}" for ${deleteTarget?.studentName}? This will permanently wipe all results, score cards, and academic feedback.`}
      />

      {/* Details View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-gray-900 border border-white/[0.1] shadow-2xl flex flex-col max-h-[85vh] animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08] flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">{viewTarget.title}</h2>
                <p className="text-xs text-gray-500 mt-1">Student: <span className="text-white font-medium">{viewTarget.studentName}</span></p>
              </div>
              <button 
                onClick={() => setViewTarget(null)} 
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 scrollbar-thin space-y-6">
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Spinner size="lg" className="text-indigo-500 mb-4" />
                  <p className="text-gray-400">Loading quiz questions and student answers...</p>
                </div>
              ) : quizDetails ? (
                <>
                  {/* Results overview if completed */}
                  {quizDetails.results?.[0] ? (
                    <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <span className="text-xs text-indigo-300 font-medium block mb-1">Percentage</span>
                        <span className="text-2xl font-black text-white">{quizDetails.results[0].percentage.toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-indigo-300 font-medium block mb-1">Score Card</span>
                        <span className="text-2xl font-black text-white">{quizDetails.results[0].score}/{quizDetails.results[0].maxScore}</span>
                      </div>
                      <div>
                        <span className="text-xs text-indigo-300 font-medium block mb-1">Status</span>
                        <span className="px-2 py-0.5 inline-block text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-400 uppercase mt-1">Completed</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-amber-400 text-sm">
                      This quiz is in progress. Student has not submitted answers yet.
                    </div>
                  )}

                  {/* Question list */}
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-base flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-indigo-400" /> Questions List
                    </h3>
                    
                    {(() => {
                      let parsedQuestions = []
                      try {
                        parsedQuestions = typeof quizDetails.questions === 'string' 
                          ? JSON.parse(quizDetails.questions) 
                          : quizDetails.questions || []
                      } catch (e) {
                        parsedQuestions = quizDetails.questions || []
                      }
                      
                      const answers = quizDetails.results?.[0]?.answers || []

                      return parsedQuestions.map((q, idx) => {
                        const studentAnswer = answers.find(a => a.questionId === idx || a.questionText === q.questionText)
                        
                        return (
                          <div 
                            key={idx}
                            className={`p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] ${
                              studentAnswer 
                                ? studentAnswer.isCorrect 
                                  ? 'border-l-4 border-l-emerald-500' 
                                  : 'border-l-4 border-l-red-500'
                                : ''
                            }`}
                          >
                            <p className="font-semibold text-white text-sm">
                              {idx + 1}. {q.questionText}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pl-2">
                              {q.options?.map((opt, oIdx) => {
                                const isCorrectOpt = oIdx === q.correctOption || opt === q.correctOptionText
                                const isStudentOpt = studentAnswer?.selectedOption === oIdx || studentAnswer?.selectedOptionText === opt
                                
                                return (
                                  <div 
                                    key={oIdx}
                                    className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between border ${
                                      isCorrectOpt
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-semibold'
                                        : isStudentOpt
                                          ? 'bg-red-500/15 border-red-500/30 text-red-300'
                                          : 'bg-white/[0.02] border-white/[0.04] text-gray-400'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isCorrectOpt && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                  </div>
                                )
                              })}
                            </div>
                            
                            {studentAnswer?.explanation && (
                              <div className="mt-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-xs text-gray-400">
                                <span className="font-semibold text-indigo-400 block mb-1">AI Explanation:</span>
                                {studentAnswer.explanation}
                              </div>
                            )}
                          </div>
                        )
                      })
                    })()}
                  </div>

                  {/* AI Analysis feedback */}
                  {quizDetails.results?.[0]?.analysis && (
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4">
                      <h4 className="text-white font-bold text-base">Gemini Performance Feedback</h4>
                      {(() => {
                        let analysisObj = {}
                        try {
                          analysisObj = typeof quizDetails.results[0].analysis === 'string'
                            ? JSON.parse(quizDetails.results[0].analysis)
                            : quizDetails.results[0].analysis || {}
                        } catch (e) {
                          analysisObj = quizDetails.results[0].analysis || {}
                        }
                        
                        return (
                          <div className="space-y-4 text-xs">
                            {analysisObj.strengths?.length > 0 && (
                              <div>
                                <span className="text-emerald-400 font-semibold uppercase tracking-wider block mb-1.5">Strengths</span>
                                <ul className="list-disc pl-4 space-y-1 text-gray-300">
                                  {analysisObj.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                              </div>
                            )}
                            {analysisObj.weaknesses?.length > 0 && (
                              <div>
                                <span className="text-red-400 font-semibold uppercase tracking-wider block mb-1.5">Areas for Development</span>
                                <ul className="list-disc pl-4 space-y-1 text-gray-300">
                                  {analysisObj.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                              </div>
                            )}
                            {analysisObj.recommendations?.length > 0 && (
                              <div>
                                <span className="text-indigo-400 font-semibold uppercase tracking-wider block mb-1.5">Actionable Steps</span>
                                <ul className="list-disc pl-4 space-y-1 text-gray-300">
                                  {analysisObj.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-10 text-center text-gray-500">
                  Failed to load details.
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-white/[0.08] flex justify-end flex-shrink-0">
              <button 
                onClick={() => setViewTarget(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminQuizzesPage
