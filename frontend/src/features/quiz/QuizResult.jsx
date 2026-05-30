const QuizResult = ({ result }) => {
  if (!result) return null;

  const { score, maxScore, percentage, answers = [] } = result;

  const getPerformanceLevel = (pct) => {
    if (pct >= 90) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (pct >= 75) return { label: 'Very Good', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
    if (pct >= 60) return { label: 'Good', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    if (pct >= 40) return { label: 'Average', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
    return { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  const performance = getPerformanceLevel(percentage);
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = answers.filter((a) => !a.isCorrect).length;

  const getCircleColor = (pct) => {
    if (pct >= 75) return 'stroke-green-500';
    if (pct >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-8 text-center">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/10"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={2 * Math.PI * 54 * (1 - percentage / 100)}
              className={`${getCircleColor(percentage)} transition-all duration-1000`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{Math.round(percentage)}%</span>
            <span className="text-sm text-gray-400">{score}/{maxScore}</span>
          </div>
        </div>

        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${performance.bg} ${performance.color} border ${performance.border}`}>
          {performance.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{correctAnswers}</div>
          <div className="text-sm text-gray-400">Correct</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">{incorrectAnswers}</div>
          <div className="text-sm text-gray-400">Incorrect</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{answers.length}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
