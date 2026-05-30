import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles, Brain, Timer, HelpCircle, Inbox, Award, ArrowRight
} from 'lucide-react';
import { fetchQuizzes, generateAIQuiz } from '../store/slices/quizSlice';
import QuizCard from '../features/quiz/QuizCard';
import Spinner from '../components/common/Spinner';

const QuizPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use state.quizzes from store
  const { quizzes = [], loading } = useSelector((state) => state.quizzes || {});
  const { user } = useSelector((state) => state.auth || {});

  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes({ limit: 20 }));
  }, [dispatch]);

  const handleGenerateAIQuiz = async () => {
    setGeneratingQuiz(true);
    setErrorMsg(null);
    try {
      const result = await dispatch(generateAIQuiz()).unwrap();
      if (result?.id) {
        navigate(`/quiz/${result.id}`);
      }
    } catch (err) {
      console.error('Failed to generate AI quiz:', err);
      setErrorMsg(err || 'Failed to generate your personalized AI quiz. Make sure your profile details are fully set up!');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const completedQuizzes = quizzes.filter((q) => q.status === 'completed');
  const inProgressQuizzes = quizzes.filter((q) => q.status === 'in_progress');

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Quiz</span> Center
        </h1>
        <p className="text-gray-400">Personalized assessments custom-built by AI to map your skills and interests.</p>
      </div>

      {/* AI Quiz Generator Card */}
      <div className="relative rounded-3xl overflow-hidden glass border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-900 shadow-glass">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="space-y-4 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by Gemini AI
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Tailor-Made <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Assessment</span> for {user?.firstName || 'You'}
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Our AI counselor will analyze your academic records, interests, and verified skill levels to build a targeted 5-question test designed to test your knowledge, check your alignment, and suggest growth paths.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <Brain className="w-4 h-4 text-indigo-400" />
              Custom Skills & Goals
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <Timer className="w-4 h-4 text-pink-400" />
              5 Questions • 10 Mins
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <Award className="w-4 h-4 text-amber-400" />
              Verified Results & Scoring
            </span>
          </div>
        </div>

        <div className="relative z-10 shrink-0 w-full md:w-auto">
          {generatingQuiz ? (
            <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md w-full md:w-64 min-h-[140px]">
              <Spinner size="lg" className="text-indigo-400 mb-3" />
              <p className="text-white text-sm font-semibold animate-pulse">Designing Quiz...</p>
              <p className="text-gray-400 text-[10px] mt-1 text-center">AI is analyzing profile metrics</p>
            </div>
          ) : (
            <button
              onClick={handleGenerateAIQuiz}
              className="w-full md:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Generate AI Quiz
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 text-sm max-w-2xl">
          {errorMsg}
        </div>
      )}

      {/* In-progress Quizzes */}
      {inProgressQuizzes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            Continue Quiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quizzes */}
      {completedQuizzes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-pink-500 rounded-full" />
            Assessment History & Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedQuizzes.slice(0, 9).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
            ))}
          </div>
        </div>
      )}

      {/* Quizzes Loading/Empty states */}
      {loading && quizzes.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4 text-indigo-500" />
            <p className="text-gray-400">Loading your assessments...</p>
          </div>
        </div>
      )}

      {!loading && quizzes.length === 0 && !generatingQuiz && (
        <div className="text-center py-20 glass border border-white/5 rounded-3xl bg-white/[0.02]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-white text-lg font-bold mb-2">No Quizzes Generated</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            Click the generator card above to launch your first personalized AI-crafted assessment!
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
