import { useState } from 'react';
import { Briefcase, User, Mail, Lock, UserCircle, Eye, EyeOff, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../api';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function Login({ onLogin, onBackToHome, initialMode = true }) {
  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // forgot password: null | 'email' | 'code'
  const [forgotStep, setForgotStep] = useState(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', full_name: ''
  });

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotStep('code');
    } catch {
      setForgotError('Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      await axios.post('/api/auth/reset-password', {
        email: forgotEmail,
        code: resetCode,
        new_password: newPassword,
      });
      toast.success('Password reset! Please sign in.');
      setForgotStep(null);
      setForgotEmail('');
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      setForgotError(err.response?.data?.detail || 'Invalid or expired code.');
    } finally {
      setForgotLoading(false);
    }
  };

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
        toast.success("Account created! Welcome!");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased text-slate-900">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#6366f1] flex-col justify-between p-12">
        {/* Logo */}
        <button onClick={onBackToHome} className="flex items-center gap-2.5 hover:opacity-80 transition-all active:scale-95 w-fit">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">JobTracker</span>
        </button>

        {/* Headline */}
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-6">
            Your job search,<br />finally under control.
          </h2>
          <div className="space-y-4">
            {[
              'Track every application in one place',
              'AI resume match score & keyword gaps',
              'Know exactly where you stand, always',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs">&copy; 2026 JobTracker. Built for serious career growth.</p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#F8FAFC]">
        {/* Mobile nav */}
        <nav className="lg:hidden px-6 h-16 flex items-center justify-between border-b border-slate-100 bg-white">
          <button onClick={onBackToHome} className="flex items-center gap-2 hover:opacity-75 transition-all">
            <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-900">JobTracker</span>
          </button>
          <button onClick={onBackToHome} className="text-sm text-slate-400 hover:text-slate-700 transition-colors">← Home</button>
        </nav>

        {/* Desktop back link */}
        <div className="hidden lg:flex justify-end px-10 pt-8">
          <button onClick={onBackToHome} className="text-sm text-slate-400 hover:text-slate-700 transition-colors">← Back to home</button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-[460px] animate-in fade-in zoom-in-95 duration-300">

            {/* ── FORGOT PASSWORD: Step 1 — enter email ── */}
            {forgotStep === 'email' && (
              <div>
                <button type="button" onClick={() => { setForgotStep(null); setForgotError(''); }} className="text-sm text-slate-400 hover:text-slate-700 mb-6 flex items-center gap-1">← Back to sign in</button>
                <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
                <p className="text-slate-500 text-sm mb-8">Enter the email on your account and we'll send a 6-digit code.</p>
                {forgotError && <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2"><XCircle className="w-4 h-4" />{forgotError}</div>}
                <form onSubmit={handleForgotEmail} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="name@company.com" required value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] outline-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3.5 bg-[#6366f1] text-white rounded-xl font-bold text-sm hover:bg-[#4f46e5] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {forgotLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Code <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>
            )}

            {/* ── FORGOT PASSWORD: Step 2 — enter code + new password ── */}
            {forgotStep === 'code' && (
              <div>
                <button type="button" onClick={() => { setForgotStep('email'); setForgotError(''); }} className="text-sm text-slate-400 hover:text-slate-700 mb-6 flex items-center gap-1">← Back</button>
                <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                <p className="text-slate-500 text-sm mb-8">We sent a 6-digit code to <span className="font-semibold text-slate-700">{forgotEmail}</span>. Enter it below with your new password.</p>
                {forgotError && <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2"><XCircle className="w-4 h-4" />{forgotError}</div>}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">6-Digit Code</label>
                    <input type="text" placeholder="123456" required maxLength={6} value={resetCode}
                      onChange={e => setResetCode(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] outline-none tracking-widest text-center font-bold text-lg" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="password" placeholder="••••••••" required value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] outline-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3.5 bg-[#6366f1] text-white rounded-xl font-bold text-sm hover:bg-[#4f46e5] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {forgotLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>
            )}

            {/* ── NORMAL LOGIN / REGISTER ── */}
            {!forgotStep && <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isLogin ? 'Welcome back! Please enter your details.' : 'Join job seekers tracking their careers.'}
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
                    <input name="full_name" type="text" placeholder="John Doe" required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] transition-all outline-none"
                      onChange={handleInputChange} />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input name="username" type="text" placeholder="johndoe123" required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] transition-all outline-none"
                    onChange={handleInputChange} />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input name="email" type="email" placeholder="name@company.com" required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] transition-all outline-none"
                      onChange={handleInputChange} />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                  {isLogin && <button type="button" onClick={() => { setForgotStep('email'); setForgotError(''); }} className="text-[11px] font-bold text-[#6366f1] hover:underline">Forgot password?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] transition-all outline-none"
                    onChange={handleInputChange} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full mt-2 py-3.5 bg-[#6366f1] text-white rounded-xl font-bold text-sm hover:bg-[#4f46e5] transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70">
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
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#6366f1] hover:underline">
                  {isLogin ? 'Sign up for free' : 'Log in here'}
                </button>
              </p>
            </div>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
