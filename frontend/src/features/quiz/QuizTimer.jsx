import { useState, useEffect, useCallback } from 'react';

const QuizTimer = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  const formatTime = useCallback((seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimerColor = useCallback(() => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage <= 10) return 'text-red-400';
    if (percentage <= 25) return 'text-orange-400';
    if (percentage <= 50) return 'text-yellow-400';
    return 'text-green-400';
  }, [timeLeft, duration]);

  const getProgressColor = useCallback(() => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage <= 10) return 'from-red-500 to-red-600';
    if (percentage <= 25) return 'from-orange-500 to-orange-600';
    if (percentage <= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  }, [timeLeft, duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onTimeUp]);

  const progress = (timeLeft / (duration * 60)) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-white/10"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
            className={`bg-gradient-to-r ${getProgressColor()} transition-all duration-1000`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {timeLeft <= 300 && timeLeft > 0 && (
        <div className="flex items-center gap-2 text-orange-400 animate-pulse">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">Time running out!</span>
        </div>
      )}
    </div>
  );
};

export default QuizTimer;
