import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Newspaper, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { signIn, resetPassword, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [remember, setRemember] = useState(true);

  React.useEffect(()=>{ if(user) nav('/admin', { replace:true }); },[user]);

  const onSubmit = async (e:React.FormEvent)=>{
    e.preventDefault();
    setError(''); setInfo('');
    if (!email || !password) { setError('ईमेल और पासवर्ड आवश्यक है / Email and password required'); return; }
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
    else nav('/admin');
  };

  const onForgot = async ()=>{
    if (!email) { setError('पहले ईमेल डालें / Enter email first'); return; }
    const { error: err } = await resetPassword(email);
    if (err) setError(err); else setInfo('पासवर्ड रीसेट लिंक ईमेल पर भेजा गया / Reset link sent');
  };

  return (
    <div className="min-h-screen bg-[#FEFCF8] dark:bg-[#0B0F17] flex">
      <div className="hidden lg:flex flex-1 bg-[#8B0000] text-white p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80')", backgroundSize:'cover'}} />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.jpg" alt="logo" className="h-10 w-auto rounded bg-white p-1" />
            <div>
              <h1 className="font-black text-xl leading-none">Chitrakoot Jyoti</h1>
              <p className="text-xs text-amber-200">Newsroom CMS • Bhopal</p>
            </div>
          </div>
          <h2 className="font-devanagari font-black text-4xl leading-tight mt-16">सत्य, साहस <br/>और सरोकार</h2>
          <p className="text-amber-100 mt-3 max-w-md text-sm leading-relaxed">Professional newsroom to manage articles, e-paper, breaking news and homepage — without touching code.</p>
        </div>
        <p className="relative z-10 text-xs text-amber-200">© 2026 Chitrakoot Jyoti • Editorial System</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-6">
            <img src="/assets/logo.jpg" alt="logo" className="h-12 w-auto rounded border bg-white" />
            <div className="text-left">
              <h1 className="font-black text-lg leading-none text-[#8B0000]">Chitrakoot Jyoti</h1>
              <p className="text-xs text-slate-500">Newsroom CMS</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#8B0000] text-white rounded-xl flex items-center justify-center mx-auto mb-3"><Lock className="w-6 h-6" /></div>
              <h2 className="font-black text-xl uppercase tracking-tight">Editor Login</h2>
              <p className="text-xs text-slate-500 mt-1">Secure access to newsroom dashboard</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3.5 rounded-xl mb-5 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-400">
                  🔐 Working Admin Credentials:
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-1.5 rounded border border-amber-200 dark:border-amber-900/50">
                  <div>
                    <span className="text-slate-500">ID:</span> <span className="font-bold text-slate-800 dark:text-slate-100">admin@chitrakootjyoti.com</span><br/>
                    <span className="text-slate-500">Pass:</span> <span className="font-bold text-slate-800 dark:text-slate-100">Admin@123456</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEmail('admin@chitrakootjyoti.com'); setPassword('Admin@123456'); }}
                    className="px-2 py-1 bg-[#8B0000] hover:bg-[#7a0000] text-white rounded text-[10px] font-sans font-bold"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            {info && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs">{info}</div>}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Email / ईमेल *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@chitrakootjyoti.com" className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-[#8B0000] focus:bg-white" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Password / पासवर्ड *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-[#8B0000] focus:bg-white" required />
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">{show?<EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />}</button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="rounded" /> Remember me</label>
                <button type="button" onClick={onForgot} className="text-[#8B0000] font-bold hover:underline">Forgot password?</button>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-[#8B0000] hover:bg-[#7a0000] disabled:opacity-60 text-white font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In to Newsroom'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t text-xs text-center text-slate-500">
              <p><Link to="/" className="text-[#8B0000] font-bold hover:underline inline-flex items-center gap-1"><Newspaper className="w-3 h-3" /> View Website</Link></p>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-4">Secure • Supabase Auth • RLS • Asia/Kolkata</p>
        </div>
      </div>
    </div>
  );
};
