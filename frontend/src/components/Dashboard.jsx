import { useState, useEffect } from 'react';
import { jobsAPI } from "../api";
import { 
  Plus, LogOut, Briefcase, MapPin, DollarSign, ExternalLink, 
  Trash2, Target, Trophy, XCircle, LayoutDashboard, Sparkles, 
  CheckCircle2, X, Loader2, UserCircle, FileText, Upload, Trash
} from 'lucide-react';
import { cn } from '../lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function Dashboard() {
  // --- STATE ---
  const [view, setView] = useState('overview'); 
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [resumeText, setResumeText] = useState(localStorage.getItem('resume_text') || '');
  const [fileName, setFileName] = useState(localStorage.getItem('resume_filename') || '');

  const [formData, setFormData] = useState({
    company_name: '', title: '', location: '', 
    salary_range: '', job_url: '', status: 'saved', notes: '' 
  });

  useEffect(() => { loadJobs(); }, []);

  // --- ACTIONS ---
  const loadJobs = async () => {
    try {
      const res = await jobsAPI.getAll();
      setJobs(res.data);
    } catch (err) { console.error("Failed to load jobs:", err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(event.target.result);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
          }
          setResumeText(fullText);
          setFileName(file.name);
          localStorage.setItem('resume_text', fullText);
          localStorage.setItem('resume_filename', file.name);
        } catch (err) {
          alert("Failed to read PDF. Try a .txt file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
        setFileName(file.name);
        localStorage.setItem('resume_text', event.target.result);
        localStorage.setItem('resume_filename', file.name);
      };
      reader.readAsText(file);
    }
  };

  const clearResume = () => {
    setResumeText('');
    setFileName('');
    localStorage.removeItem('resume_text');
    localStorage.removeItem('resume_filename');
  };

  const handleAIAnalysis = async (job) => {
    setAiResult(null);
    setAiError(null);
    setSelectedJob(job);
    setAiLoading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 5 : prev));
    }, 300);

    try {
      const storedResume = localStorage.getItem('resume_text');
      if (!storedResume || storedResume.trim().length === 0) {
        throw new Error('No resume found. Please upload your resume in the Resume Vault first.');
      }

      const response = await fetch('http://localhost:8000/analyze-match', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobDescription: job.notes || job.title,
          resumeText: storedResume
        })
      });

      if (!response.ok) throw new Error('AI analysis failed');
      const data = await response.json();
      
      setUploadProgress(100);
      setTimeout(() => {
        setAiResult(data);
        setAiLoading(false);
      }, 500);

    } catch (error) {
      setAiError(error.message);
      setAiLoading(false);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobsAPI.create(formData);
      setShowForm(false);
      setFormData({ company_name: '', title: '', location: '', salary_range: '', job_url: '', status: 'saved', notes: '' });
      loadJobs();
    } catch (err) { alert('Failed to create job'); }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await jobsAPI.delete(jobId);
      loadJobs();
    } catch (err) { alert('Failed to delete'); }
  };

  const statusStyles = {
    saved: 'bg-slate-100 text-slate-600 border-slate-200',
    applied: 'bg-blue-50 text-blue-600 border-blue-100',
    interview_scheduled: 'bg-orange-50 text-orange-600 border-orange-100',
    offer: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rejected: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans antialiased selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              JobTracker
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-bold text-slate-400">
              <button onClick={() => setView('overview')} className={cn("h-16 flex items-center transition-all", view === 'overview' ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-600")}>Overview</button>
              <button onClick={() => setView('resume')} className={cn("h-16 flex items-center transition-all", view === 'resume' ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-600")}>Resume Vault</button>
            </nav>
          </div>
          <button onClick={handleLogout} className="text-sm font-bold text-slate-400 hover:text-rose-500 transition flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        {view === 'resume' ? (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 p-12 shadow-sm text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6"><Upload size={32} /></div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Resume Vault</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">Upload your resume to enable AI Match Insights.</p>

              <label className="group relative block w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-[32px] p-16 transition-all cursor-pointer bg-slate-50/50 hover:bg-white">
                <input type="file" className="hidden" accept=".txt,.pdf" onChange={handleFileUpload} />
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform border border-slate-100"><Plus className="text-indigo-600 w-6 h-6" /></div>
                  <p className="text-sm font-black text-slate-700 uppercase tracking-widest">{fileName ? "Replace File" : "Choose File"}</p>
                </div>
              </label>

              {fileName && (
                <div className="mt-10 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50"><FileText size={20} /></div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-700 truncate max-w-[200px]">{fileName}</p>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} /> Sync Complete</p>
                    </div>
                  </div>
                  <button onClick={clearResume} className="p-2 hover:bg-rose-50 rounded-lg text-rose-400"><Trash size={18} /></button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">My Applications</h2>
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-100">
                {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Close' : 'Add Job'}
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-10 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Company Name" className="border rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-900" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} required />
                  <input type="text" placeholder="Job Title" className="border rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-900" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                  <textarea 
                    placeholder="Paste full Job Description here for AI Analysis..." 
                    className="md:col-span-2 border rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-900 min-h-[120px]"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                  <button type="submit" className="md:col-span-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm">Save Application</button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div key={job.id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-400 transition-all flex flex-col shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase border tracking-widest", statusStyles[job.status])}>
                      {job.status.replace('_', ' ')}
                    </span>
                    <button onClick={() => handleDelete(job.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">{job.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 font-semibold">{job.company_name || job.company?.name}</p>
                  <button onClick={() => handleAIAnalysis(job)} className="mt-auto w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 border border-indigo-100">
                    <Sparkles className="w-3.5 h-3.5" /> AI Match Insights
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* --- AI INSIGHTS MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedJob(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Analysis</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">{selectedJob.company_name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-10">
              {aiLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-8">
                  <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-2 animate-pulse">
                      {uploadProgress < 100 ? "Analyzing Match..." : "Finalizing Insights..."}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {uploadProgress}% Complete
                    </p>
                  </div>
                </div>
              ) : aiError ? (
                <div className="py-10 text-center">
                  <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-900">{aiError}</p>
                </div>
              ) : aiResult ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-8 bg-indigo-50/50 p-8 rounded-[24px] border border-indigo-100">
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                         <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-indigo-100/50" />
                         <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-indigo-600" style={{ strokeDasharray: 251.2, strokeDashoffset: 251.2 - (251.2 * aiResult.score) / 100 }} strokeLinecap="round" />
                       </svg>
                       <span className="absolute text-2xl font-black text-indigo-900">{aiResult.score}%</span>
                    </div>
                    <div>
                      <h4 className="font-black text-indigo-900 text-lg uppercase">Match Score</h4>
                      <p className="text-sm text-indigo-700/70 font-medium leading-relaxed">{aiResult.strategy}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Target className="w-4 h-4 text-indigo-600" /> The Resume Fixer
                    </div>
                    <div className="p-6 bg-slate-900 rounded-2xl text-sm text-slate-200 leading-relaxed font-medium italic">
                      "{aiResult.resumeFix}"
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Key Missing Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.missingKeywords?.map(kw => (
                          <span key={kw} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-black uppercase tracking-tight border border-indigo-100">+ {kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
               <button onClick={() => setSelectedJob(null)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl shadow-slate-200">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}