import { Link } from 'react-router-dom';
import RegisterForm from '../features/auth/RegisterForm';
import { Sparkles } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 relative overflow-hidden">
      {/* Background decorations with enhanced color science */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center shadow-lg shadow-secondary-500/25 group-hover:shadow-secondary-500/40 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent tracking-tight">
              EduGuide AI
            </span>
          </Link>
          <p className="mt-3 text-gray-400 text-sm">
            Create your account and start your career journey.
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="card bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass rounded-3xl overflow-hidden">
          <div className="card-body p-6 md:p-8">
            <RegisterForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-600">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
