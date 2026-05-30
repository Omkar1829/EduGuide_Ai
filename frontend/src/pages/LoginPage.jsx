import { Link } from 'react-router-dom';
import LoginForm from '../features/auth/LoginForm';
import { Sparkles } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 relative overflow-hidden">
      {/* Background decorations with enhanced color science */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent tracking-tight">
              EduGuide AI
            </span>
          </Link>
          <p className="mt-3 text-gray-400 text-sm">
            Welcome back! Sign in to continue your journey.
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="card bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass rounded-3xl overflow-hidden">
          <div className="card-body p-6 md:p-8">
            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-600">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
