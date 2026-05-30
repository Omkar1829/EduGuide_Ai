const QuizQuestion = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showCorrect,
}) => {
  if (!question) return null;

  const { id, text, options = [], correctOption, explanation } = question;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 font-medium">
          {Math.round(((questionIndex + 1) / totalQuestions) * 100)}%
        </span>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
          style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <h3 className="text-white text-lg font-medium leading-relaxed">{text}</h3>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showCorrect && index === correctOption;
          const isWrong = showCorrect && isSelected && index !== correctOption;

          let optionStyle = 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20';
          if (isSelected && !showCorrect) {
            optionStyle = 'bg-primary-500/20 border-primary-500/50 ring-2 ring-primary-500/30';
          }
          if (isCorrect) {
            optionStyle = 'bg-green-500/20 border-green-500/50 ring-2 ring-green-500/30';
          }
          if (isWrong) {
            optionStyle = 'bg-red-500/20 border-red-500/50 ring-2 ring-red-500/30';
          }

          return (
            <button
              key={index}
              onClick={() => !showCorrect && onAnswerSelect(index)}
              disabled={showCorrect}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${optionStyle}`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                  isSelected && !showCorrect
                    ? 'bg-primary-500 text-white'
                    : isCorrect
                    ? 'bg-green-500 text-white'
                    : isWrong
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span
                className={`flex-1 ${
                  isCorrect
                    ? 'text-green-300'
                    : isWrong
                    ? 'text-red-300'
                    : isSelected
                    ? 'text-white'
                    : 'text-gray-300'
                }`}
              >
                {option}
              </span>
              {showCorrect && isCorrect && (
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isWrong && (
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {showCorrect && explanation && (
        <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-primary-300 font-medium text-sm mb-1">Explanation</p>
              <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
