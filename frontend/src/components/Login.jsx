import { useState } from 'react';
import { Briefcase, User, Mail, Lock, UserCircle, Eye, EyeOff, ArrowRight, XCircle } from 'lucide-react';
import { authAPI } from '../api';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export default function Login({ onLogin, onBackToHome, initialMode = true }) {
  // Sets whether to show Login (true) or Register (false) based on which button was clicked
  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', full_name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);
        const response = await authAPI.login(params);
        localStorage.setItem('token', response.data.access_token);
        onLogin();
      } else {
        await authAPI.register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name
        });
        toast.success("Account created! Welcome!")
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans antialiased text-slate-900">
      
      {/* Clickable Brand Header to go home */}
      <button 
        onClick={onBackToHome}
        className="flex items-center gap-2.5 mb-10 hover:opacity-70 transition-all active:scale-95"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">JobTracker</span>
      </button>

      <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h1>
            <p className="text-slate-500 text-sm">
              {isLogin 
                ? 'Welcome back! Please enter your details.' 
                : 'Join thousands of hunters tracking their careers.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                <div className="relative group">
                  <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  name="username"
                  type="text"
                  placeholder="johndoe123"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                {isLogin && <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none"
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-slate-900 hover:underline"
              >
                {isLogin ? 'Sign up for free' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs tracking-tight">
          &copy; 2026 JobTracker. Built for serious career growth.
        </p>
      </div>
    </div>
  );
}