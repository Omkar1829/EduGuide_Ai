import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, Check, X, Info, RotateCcw
} from 'lucide-react';
import { fetchQuizResults, clearCurrentResult, fetchQuizById, createQuiz } from '../store/slices/quizSlice';
import QuizResult from '../features/quiz/QuizResult';
import { toast } from 'react-toastify';

const QuizResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentResult, currentQuiz, loading } = useSelector((state) => state.quizzes);
  const [retaking, setRetaking] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizResults(id));
    dispatch(fetchQuizById(id));
    return () => {
      dispatch(clearCurrentResult());
    };
  }, [dispatch, id]);

  if (loading || !currentResult) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-4">
            <div className="w-40 h-40 mx-auto bg-white/10 rounded-full" />
            <div className="h-6 bg-white/10 rounded w-1/4 mx-auto" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const resultData = Array.isArray(currentResult) ? currentResult[0] : currentResult;

  if (!resultData) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center text-white">
        <div className="text-center py-10 glass border border-white/5 rounded-3xl bg-white/[0.02] max-w-md w-full">
          <h3 className="text-white text-lg font-bold mb-2">No Results Found</h3>
          <p className="text-gray-400 text-sm mb-6">
            We couldn't retrieve results for this quiz. Try going back to the quiz center!
          </p>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Quiz Center
          </Link>
        </div>
      </div>
    );
  }

  const { score, maxScore, percentage, answers = [], analysis } = resultData;

  const handleRetake = async () => {
    if (!currentQuiz) {
      toast.warning("Quiz content is still loading, please wait.");
      return;
    }
    setRetaking(true);
    try {
      const result = await dispatch(createQuiz({
        title: currentQuiz.title,
        category: currentQuiz.category,
        questions: currentQuiz.questions,
        duration: currentQuiz.duration
      })).unwrap();
      if (result?.id) {
        navigate(`/quiz/${result.id}`);
      }
    } catch (err) {
      toast.error(err || 'Failed to restart quiz');
      console.error(err);
    } finally {
      setRetaking(false);
    }
  };

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
            Back to Quizzes
          </button>
        </div>

        {/* Result Component */}
        <QuizResult result={resultData} />

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Question Review</h2>
          {answers.map((answer, index) => (
            <div
              key={answer.questionId || index}
              className={`p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] border-l-4 ${
                answer.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                    answer.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-white font-medium">{answer.questionText || `Question ${index + 1}`}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className={`flex items-center gap-1.5 ${answer.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {answer.isCorrect ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      Your answer: {answer.selectedOptionText || `Option ${answer.selectedOption + 1}`}
                    </p>
                    {!answer.isCorrect && answer.correctOptionText && (
                      <p className="text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Correct answer: {answer.correctOptionText}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {answer.explanation && (
                <div className="ml-11 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-sm text-gray-300">
                    <span className="text-indigo-400 font-medium">Explanation: </span>
                    {answer.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Analysis */}
        {analysis && (
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Analysis</h3>
            <div className="space-y-5">
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-emerald-400 mb-2">Strengths</h4>
                  <ul className="space-y-1.5">
                    {analysis.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1.5">
                    {analysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                        <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-indigo-400 mb-2">Recommendations</h4>
                  <ul className="space-y-1.5">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            to="/quiz"
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-center bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
          </Link>
          <button
            onClick={handleRetake}
            disabled={retaking}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
