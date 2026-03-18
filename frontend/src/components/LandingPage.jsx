import { Briefcase, CheckCircle, ArrowRight, Zap, Shield, BarChart3, Search, Filter, Plus } from 'lucide-react';

export default function LandingPage({ onNavigateLogin, onNavigateRegister, onNavigateHome }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer hover:opacity-80 transition-all active:scale-95"
        >
          <div className="w-9 h-9 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            JobTracker
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <button className="hover:text-[#6366f1] transition-colors">Features</button>
          <button className="hover:text-[#6366f1] transition-colors">Pricing</button>
          <button onClick={onNavigateLogin} className="hover:text-slate-900 transition-colors">Log in</button>
          <button 
            onClick={onNavigateRegister}
            className="bg-[#6366f1] text-white px-6 py-2.5 rounded-full hover:bg-[#4f46e5] transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            Sign up for free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-[#6366f1] text-xs font-black uppercase tracking-widest mb-6">
            New: AI Resume Builder 2.0
          </span>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            Less Hassle,<br />
            <span className="text-[#6366f1]">More Interviews.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg font-medium">
            JobTracker helps you organize your job search, create tailored resumes in seconds, and track every application in one beautiful dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onNavigateRegister}
              className="px-10 py-5 bg-[#6366f1] text-white rounded-2xl font-bold text-lg hover:bg-[#4f46e5] transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 group"
            >
              Sign Up for Free 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95">
              View Demo
            </button>
          </div>
        </div>

        {/* Hero Visual - Skeleton UI Mockup */}
        <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <div className="aspect-[4/3] bg-white rounded-[40px] border-[12px] border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col relative z-10">
             
             {/* Mockup Header */}
             <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                 <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                 <div className="w-3 h-3 rounded-full bg-slate-200"></div>
               </div>
               <div className="flex gap-3">
                 <div className="w-20 h-6 bg-slate-200 rounded-lg"></div>
                 <div className="w-8 h-6 bg-indigo-200 rounded-lg"></div>
               </div>
             </div>

             {/* Mockup Content */}
             <div className="p-8 flex-1 space-y-8">
               {/* Search & Actions */}
               <div className="flex justify-between">
                 <div className="w-1/2 h-10 bg-slate-100 rounded-xl flex items-center px-4">
                   <Search className="w-4 h-4 text-slate-300" />
                 </div>
                 <div className="w-28 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                 </div>
               </div>

               {/* Grid Cards */}
               <div className="grid grid-cols-2 gap-4">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="p-4 rounded-2xl border border-slate-100 space-y-3">
                     <div className="w-1/3 h-4 bg-indigo-50 rounded-full"></div>
                     <div className="w-full h-5 bg-slate-100 rounded-full"></div>
                     <div className="w-2/3 h-3 bg-slate-50 rounded-full"></div>
                     <div className="pt-2 flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-50"></div>
                        <div className="flex-1 h-8 rounded-lg bg-slate-50"></div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/20 to-transparent pointer-events-none" />
          </div>

          {/* Abstract Floating Shapes (Huntr Style) */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-teal-300 rounded-[30%] rotate-12 blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-400 rounded-full blur-[80px] opacity-20 animate-bounce duration-[5000ms]" />
          <div className="absolute top-1/2 -right-8 w-16 h-16 bg-amber-300 rounded-2xl rotate-45 blur-2xl opacity-40" />
        </div>
      </section>

      {/* Features Ribbon */}
      <section className="bg-slate-50/50 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: <Zap className="w-5 h-5" />, label: 'Autofill Apps' },
            { icon: <CheckCircle className="w-5 h-5" />, label: 'Resume Checker' },
            { icon: <Shield className="w-5 h-5" />, label: 'Safe & Secure' },
            { icon: <BarChart3 className="w-5 h-5" />, label: 'Visual Analytics' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-slate-400 hover:text-slate-600 transition-colors">
              <span className="p-2 bg-white rounded-lg shadow-sm text-[#6366f1]">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}