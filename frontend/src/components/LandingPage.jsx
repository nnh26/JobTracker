import { Briefcase, ArrowRight, Search, Plus, Star, Target, FileText, TrendingUp, ChevronDown } from 'lucide-react';

const reviews = [
  { name: 'Sarah K.', role: 'Software Engineer', text: 'I used to track everything in a spreadsheet. JobTracker replaced all of that. I can see exactly where every application stands at a glance.', stars: 5 },
  { name: 'Marcus T.', role: 'Product Manager', text: 'The AI resume match is a game changer. It told me exactly what keywords I was missing before I even submitted.', stars: 5 },
  { name: 'Priya N.', role: 'UX Designer', text: 'Super clean and easy to use. I recommended it to everyone in my job search group.', stars: 5 },
  { name: 'James L.', role: 'Data Analyst', text: 'Finally stopped losing track of which jobs I applied to. This dashboard is exactly what I needed.', stars: 5 },
];

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

          {/* Abstract Floating Shapes */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-teal-300 rounded-[30%] rotate-12 blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-400 rounded-full blur-[80px] opacity-20 animate-bounce duration-[5000ms]" />
          <div className="absolute top-1/2 -right-8 w-16 h-16 bg-amber-300 rounded-2xl rotate-45 blur-2xl opacity-40" />
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex flex-col items-center pb-10 -mt-8 gap-1 text-slate-400">
        <span className="text-xs font-semibold uppercase tracking-widest">Scroll to explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>

      {/* ── FEATURE SECTIONS ── */}

      {/* Feature 1 - Track Applications */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-black text-[#6366f1] uppercase tracking-widest mb-3">Job Search CRM</p>
          <h2 className="text-4xl font-black tracking-tight leading-tight mb-5">
            Run a More<br />Organized Job Search
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8 max-w-md">
            Ditch the spreadsheets. Track every application by status — saved, applied, interviewing, offer — and always know exactly where you stand.
          </p>
          <button onClick={onNavigateRegister} className="px-8 py-4 bg-[#6366f1] text-white rounded-full font-bold hover:bg-[#4f46e5] transition-all active:scale-95">
            Start Tracking Applications
          </button>
        </div>

        <div className="relative">
          <div className="absolute top-4 right-0 w-[88%] h-[88%] bg-[#6366f1] rounded-3xl" />
          <div className="relative z-10 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100 px-6 pt-5 pb-0 gap-6 text-xs font-black uppercase tracking-wider text-slate-400">
              {['6 Saved', '3 Applied', '2 Interview', '1 Offer'].map((t, i) => (
                <div key={i} className={`pb-3 ${i === 0 ? 'border-b-2 border-[#6366f1] text-[#6366f1]' : ''}`}>{t}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 px-6 py-3 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <span>Position</span><span>Company</span><span>Location</span><span>Status</span>
            </div>
            {[
              { title: 'Senior Engineer', co: 'Stripe', loc: 'Remote', status: 'Applied', color: 'text-indigo-600 bg-indigo-50' },
              { title: 'Product Designer', co: 'Figma', loc: 'NYC', status: 'Interview', color: 'text-green-600 bg-green-50' },
              { title: 'Data Analyst', co: 'Notion', loc: 'SF', status: 'Saved', color: 'text-slate-500 bg-slate-100' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-6 py-4 text-sm border-b border-slate-50 items-center">
                <span className="font-semibold text-slate-800 text-xs">{row.title}</span>
                <span className="text-slate-500 text-xs">{row.co}</span>
                <span className="text-slate-400 text-xs">{row.loc}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${row.color}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 2 - AI Match */}
      <section className="bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute top-4 left-0 w-[88%] h-[88%] bg-slate-900 rounded-3xl" />
            <div className="relative z-10 bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-base text-slate-900">AI Match Score</p>
                  <p className="text-sm text-slate-400">Senior Engineer — Stripe</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#6366f1] flex items-center justify-center">
                  <span className="text-xl font-black text-[#6366f1]">87%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {['TypeScript', 'CI/CD', 'System Design', 'Kafka'].map(k => (
                    <span key={k} className="px-3 py-1 bg-rose-50 text-rose-500 text-xs font-bold rounded-full">{k}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl">
                <p className="text-xs font-black uppercase tracking-wider text-[#6366f1] mb-1">Resume Fix</p>
                <p className="text-sm text-slate-700">"Add a bullet mentioning TypeScript and CI/CD pipelines to your most recent role."</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-black text-[#6366f1] uppercase tracking-widest mb-3">AI Resume Match</p>
            <h2 className="text-4xl font-black tracking-tight leading-tight mb-5">
              Know Your Score<br />Before You Apply
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-md">
              Paste any job description and instantly see how well your resume matches. Get missing keywords and a one-line fix to boost your chances.
            </p>
            <button onClick={onNavigateRegister} className="px-8 py-4 bg-[#6366f1] text-white rounded-full font-bold hover:bg-[#4f46e5] transition-all active:scale-95">
              Try AI Match
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black tracking-tight text-center mb-4">Streamline Your Job Search</h2>
        <p className="text-slate-500 text-center mb-16 max-w-lg mx-auto">Three simple steps to a more focused, organized search.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Add a Job', desc: 'Paste in any job listing — title, company, location, and URL. Takes 10 seconds.', icon: <Target className="w-6 h-6" /> },
            { n: '2', title: 'Match Your Resume', desc: 'Upload your resume and get an instant AI score, missing keywords, and a fix suggestion.', icon: <FileText className="w-6 h-6" /> },
            { n: '3', title: 'Track & Win', desc: 'Move applications through stages as you hear back. Never lose track of where you stand.', icon: <TrendingUp className="w-6 h-6" /> },
          ].map((step, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#6366f1] text-white font-black text-xl flex items-center justify-center mb-6">
                {step.n}
              </div>
              <h3 className="text-xl font-black mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={onNavigateRegister} className="px-10 py-4 bg-[#6366f1] text-white rounded-full font-bold text-base hover:bg-[#4f46e5] transition-all active:scale-95">
            Sign Up — It's 100% Free
          </button>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="bg-slate-50/50 border-t border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black tracking-tight text-center mb-2">Loved by Job Seekers</h2>
          <p className="text-[#6366f1] font-bold text-center mb-16">Join 500+ people tracking their search</p>

          {/* Featured review */}
          <div className="bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-start gap-8 mb-8">
            <div className="flex-1">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-white text-lg leading-relaxed">
                "I used to maintain an Excel tracker for every job I applied to. Now I do everything through JobTracker. It keeps me organized, focused, and way less stressed during my search."
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="w-14 h-14 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-black text-xl mb-2 ml-auto">A</div>
              <p className="text-white font-bold text-sm">Alex R.</p>
              <p className="text-slate-400 text-xs">Marketing Manager</p>
            </div>
          </div>

          {/* Review grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                  <p className="text-slate-400 text-xs">{r.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={onNavigateRegister}
              className="px-10 py-4 bg-[#6366f1] text-white rounded-full font-bold text-base hover:bg-[#4f46e5] transition-all active:scale-95 inline-flex items-center gap-2 group"
            >
              Start Tracking Your Applications
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <div className="w-7 h-7 bg-[#6366f1] rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            JobTracker
          </div>
          <p className="text-sm text-slate-400">&copy; 2026 JobTracker. Built for serious career growth.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <button onClick={onNavigateLogin} className="hover:text-slate-600 transition-colors">Log in</button>
            <button onClick={onNavigateRegister} className="hover:text-slate-600 transition-colors">Sign up</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
