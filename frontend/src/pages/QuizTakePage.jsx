import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Check, AlertTriangle, Loader2
} from 'lucide-react';
import { fetchQuizById, submitQuizAnswers, clearCurrentQuiz } from '../store/slices/quizSlice';
import QuizQuestion from '../features/quiz/QuizQuestion';
import QuizTimer from '../features/quiz/QuizTimer';

const QuizTakePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, loading, submitting } = useSelector((state) => state.quizzes);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizById(id));
    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [dispatch, id]);

  const questions = currentQuiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerSelect = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      await dispatch(submitQuizAnswers({ quizId: id, answers: formattedAnswers })).unwrap();
      navigate(`/quiz/${id}/results`);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  }, [answers, id, dispatch, navigate]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const getAnsweredCount = () => Object.keys(answers).length;

  if (loading || !currentQuiz) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-4">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-6 bg-white/10 rounded w-3/4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-white/5 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Exit Quiz
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {getAnsweredCount()}/{totalQuestions} answered
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">{currentQuiz.title}</h1>
              <p className="text-sm text-gray-400 capitalize">
                {currentQuiz.category?.replace(/_/g, ' ').toLowerCase()}
              </p>
            </div>
            {currentQuiz.duration && (
              <QuizTimer
                duration={currentQuiz.duration}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>

          <QuizQuestion
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            selectedAnswer={answers[currentQuestion?.id]}
            onAnswerSelect={handleAnswerSelect}
            showCorrect={showReview}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i === currentQuestionIndex
                    ? 'bg-indigo-500 scale-125'
                    : answers[questions[i]?.id] !== undefined
                    ? 'bg-emerald-500'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              />
            ))}
          </div>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2"
            >
              Submit Quiz
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Question Navigation Grid */}
        <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
          <h3 className="text-white font-medium mb-3">Question Navigation</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-full aspect-square rounded-lg text-xs font-medium transition-all duration-200 ${
                  i === currentQuestionIndex
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : answers[questions[i]?.id] !== undefined
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] border border-white/[0.08]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500" /> Current
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-white/[0.05] border border-white/[0.08]" /> Unanswered
            </span>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="p-6 w-full max-w-md rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl shadow-black/50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Submit Quiz?</h3>
              <p className="text-gray-400 mb-6">
                You have answered {getAnsweredCount()} of {totalQuestions} questions.
                {getAnsweredCount() < totalQuestions && (
                  <span className="text-amber-400 block mt-1">
                    You have {totalQuestions - getAnsweredCount()} unanswered questions.
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1] transition-all duration-200"
                >
                  Continue Quiz
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTakePage;
