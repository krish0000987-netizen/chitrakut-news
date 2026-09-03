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
    <div className="min-h-screen bg-[#FDF8F7] text-slate-900 flex">
      {/* Left Brand Panel - Rich Crimson Red Theme */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#8B0000] via-[#700000] to-[#4c0000] text-white p-10 flex-col justify-between relative overflow-hidden border-r border-red-900 shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.jpg" alt="Logo" className="h-12 w-auto rounded-xl bg-white p-1.5 shadow" />
            <div>
              <p className="text-xs text-amber-300 font-bold tracking-widest uppercase font-mono">न्यूज़रूम CMS • भोपाल</p>
              <p className="text-[11px] text-red-200">एडमिनिस्ट्रेटर नियंत्रण कक्ष</p>
            </div>
          </div>
          <h2 className="font-devanagari font-black text-4xl leading-tight mt-16 text-white">
            सत्य, साहस <br/>और सरोकार
          </h2>
          <p className="text-red-100 mt-3 max-w-md text-sm leading-relaxed font-devanagari">
            समाचार, ई-पेपर, ब्रेकिंग न्यूज़ एवं वेबसाइट लेआउट प्रबंधित करने हेतु आधिकारिक एडमिन नियंत्रण कक्ष।
          </p>
        </div>
        <p className="relative z-10 text-xs text-red-200 font-mono">© 2026 Digital News • Newsroom Management System</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-6">
            <img src="/assets/logo.jpg" alt="Logo" className="h-14 w-auto rounded-xl border border-red-200 bg-white p-1 shadow" />
          </div>

          <div className="bg-white rounded-2xl border-2 border-red-100 shadow-xl p-6 sm:p-8">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-[#8B0000] text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-black text-xl tracking-tight text-slate-900 font-devanagari">संपादक लॉगिन (Editor Login)</h2>
              <p className="text-xs text-slate-500 mt-1 font-devanagari">न्यूज़रूम डैशबोर्ड में प्रवेश करें</p>
            </div>

            <div className="bg-red-50/70 border border-red-200 p-3.5 rounded-xl mb-5 text-xs text-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black uppercase tracking-wider text-[11px] text-[#8B0000] font-devanagari">
                  🔐 सक्रिय एडमिन लॉगिन क्रेडेंशियल्स:
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-red-200 shadow-xs">
                  <div>
                    <span className="text-slate-500 font-bold">आईडी:</span> <span className="font-black text-slate-900">admin@chitrakootjyoti.com</span><br/>
                    <span className="text-slate-500 font-bold">पासवर्ड:</span> <span className="font-black text-slate-900">Admin@123456</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEmail('admin@chitrakootjyoti.com'); setPassword('Admin@123456'); }}
                    className="px-2.5 py-1 bg-[#8B0000] hover:bg-[#700000] text-white rounded-lg text-[10px] font-sans font-black shadow-xs"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-xl text-xs flex gap-2 font-bold"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            {info && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold">{info}</div>}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1 font-devanagari">ईमेल आईडी (Email) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@chitrakootjyoti.com" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#8B0000] bg-white text-slate-900 text-sm font-medium outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1 font-devanagari">पासवर्ड (Password) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#8B0000] bg-white text-slate-900 text-sm font-medium outline-none" required />
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-900">{show?<EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />}</button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-bold font-devanagari"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="rounded border-slate-300 accent-[#8B0000]" /> मुझे याद रखें</label>
                <button type="button" onClick={onForgot} className="text-[#8B0000] font-black hover:underline font-devanagari">पासवर्ड भूल गए?</button>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-[#8B0000] hover:bg-[#700000] disabled:opacity-60 text-white font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors font-devanagari">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'लॉगिन हो रहा है...' : 'न्यूज़रूम में प्रवेश करें (Sign In)'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-center">
              <p><Link to="/" className="text-[#8B0000] font-black hover:underline inline-flex items-center gap-1 font-devanagari"><Newspaper className="w-3.5 h-3.5" /> मुख्य वेबसाइट देखें</Link></p>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-500 font-mono mt-4 font-bold">Secure • Supabase Auth • Asia/Kolkata</p>
        </div>
      </div>
    </div>
  );
};
