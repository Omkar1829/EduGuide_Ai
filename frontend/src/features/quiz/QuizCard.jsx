import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createQuiz } from '../../store/slices/quizSlice';
import { toast } from 'react-toastify';

const QuizCard = ({ quiz, onStart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [retaking, setRetaking] = useState(false);

  const {
    id,
    title,
    category,
    questions,
    status,
    totalScore,
    maxScore,
    duration,
    completedAt,
  } = quiz;

  const categoryConfig = {
    CAREER_INTEREST: {
      label: 'Career Interest',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    PERSONALITY: {
      label: 'Personality',
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    SKILL_ASSESSMENT: {
      label: 'Skill Assessment',
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    APTITUDE: {
      label: 'Aptitude',
      color: 'from-orange-500 to-red-500',
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    LEARNING_STYLE: {
      label: 'Learning Style',
      color: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  };

  const config = categoryConfig[category] || categoryConfig.CAREER_INTEREST;
  const questionCount = Array.isArray(questions) ? questions.length : 0;

  const getScorePercentage = () => {
    if (!totalScore || !maxScore) return 0;
    return Math.round((totalScore / maxScore) * 100);
  };

  const handleRetake = async () => {
    setRetaking(true);
    try {
      const result = await dispatch(createQuiz({
        title,
        category,
        questions,
        duration
      })).unwrap();
      if (result?.id) {
        navigate(`/quiz/${result.id}`);
      }
    } catch (err) {
      toast.error('Failed to restart quiz');
      console.error(err);
    } finally {
      setRetaking(false);
    }
  };

  return (
    <div className="glass-card-hover overflow-hidden group">
      <div className={`h-2 bg-gradient-to-r ${config.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${config.bg}`}>
            <span className={config.text}>{config.icon}</span>
          </div>
          {status === 'completed' && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              Completed
            </span>
          )}
          {status === 'in_progress' && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              In Progress
            </span>
          )}
        </div>

        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {questionCount} questions
          </span>
          {duration && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration} min
            </span>
          )}
        </div>

        {status === 'completed' && totalScore !== null && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Score</span>
              <span className="text-white font-medium">{getScorePercentage()}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-500`}
                style={{ width: `${getScorePercentage()}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {status === 'completed' ? (
            <>
              <Link
                to={`/quiz/${id}/results`}
                className="flex-1 px-4 py-2 text-sm font-medium text-center rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
              >
                View Results
              </Link>
              <button
                onClick={handleRetake}
                disabled={retaking}
                className="flex-1 px-4 py-2 text-sm font-medium text-center rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 border border-primary-500/30 transition-all disabled:opacity-50"
              >
                {retaking ? 'Loading...' : 'Retake'}
              </button>
            </>
          ) : (
            <button
              onClick={() => onStart?.(id)}
              className="flex-1 px-4 py-2 text-sm font-medium text-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all"
            >
              {status === 'in_progress' ? 'Continue' : 'Start Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
