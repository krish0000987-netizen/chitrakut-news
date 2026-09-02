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
    <div className="min-h-screen bg-[#F4F4F5] text-black flex">
      {/* Left Brand Panel - Pure Black High Contrast */}
      <div className="hidden lg:flex flex-1 bg-black text-white p-10 flex-col justify-between relative overflow-hidden border-r-2 border-black">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.jpg" alt="logo" className="h-10 w-auto rounded bg-white p-1" />
            <div>
              <h1 className="font-black text-xl leading-none font-devanagari">चित्रकूट ज्योति</h1>
              <p className="text-xs text-amber-400 font-bold tracking-widest uppercase">न्यूज़रूम CMS • भोपाल</p>
            </div>
          </div>
          <h2 className="font-devanagari font-black text-4xl leading-tight mt-16 text-white">सत्य, साहस <br/>और सरोकार</h2>
          <p className="text-neutral-300 mt-3 max-w-md text-sm leading-relaxed font-devanagari">समाचार, ई-पेपर, ब्रेकिंग न्यूज़ एवं वेबसाइट लेआउट प्रबंधित करने हेतु पेशेवर एडमिन नियंत्रण कक्ष।</p>
        </div>
        <p className="relative z-10 text-xs text-neutral-400 font-mono">© 2026 Chitrakoot Jyoti • Newsroom Management System</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-6">
            <img src="/assets/logo.jpg" alt="logo" className="h-12 w-auto rounded border-2 border-black bg-white" />
            <div className="text-left">
              <h1 className="font-black text-lg leading-none text-black font-devanagari">चित्रकूट ज्योति</h1>
              <p className="text-xs text-neutral-600 font-bold">न्यूज़रूम CMS</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-xl p-6 sm:p-8">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow"><Lock className="w-6 h-6" /></div>
              <h2 className="font-black text-xl tracking-tight text-black font-devanagari">संपादक लॉगिन (Editor Login)</h2>
              <p className="text-xs text-neutral-600 mt-1 font-devanagari">न्यूज़रूम डैशबोर्ड में प्रवेश करें</p>
            </div>

            <div className="bg-neutral-100 border-2 border-black p-3.5 rounded-xl mb-5 text-xs text-black">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black uppercase tracking-wider text-[11px] text-black font-devanagari">
                  🔐 सक्रिय एडमिन लॉगिन क्रेडेंशियल्स:
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-black">
                  <div>
                    <span className="text-neutral-500 font-bold">आईडी:</span> <span className="font-black text-black">admin@chitrakootjyoti.com</span><br/>
                    <span className="text-neutral-500 font-bold">पासवर्ड:</span> <span className="font-black text-black">Admin@123456</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEmail('admin@chitrakootjyoti.com'); setPassword('Admin@123456'); }}
                    className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded-lg text-[10px] font-sans font-black shadow"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 text-red-700 rounded-xl text-xs flex gap-2 font-bold"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            {info && <div className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-600 text-emerald-800 rounded-xl text-xs font-bold">{info}</div>}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1 font-devanagari">ईमेल आईडी (Email) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@chitrakootjyoti.com" className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-black bg-white text-black text-sm font-medium outline-none focus:bg-neutral-50" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-black mb-1 font-devanagari">पासवर्ड (Password) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-black bg-white text-black text-sm font-medium outline-none focus:bg-neutral-50" required />
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-neutral-600 hover:text-black">{show?<EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />}</button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-black font-bold font-devanagari"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="rounded border-2 border-black accent-black" /> मुझे याद रखें</label>
                <button type="button" onClick={onForgot} className="text-black font-black hover:underline font-devanagari">पासवर्ड भूल गए?</button>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-black hover:bg-neutral-800 disabled:opacity-60 text-white font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors font-devanagari">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'लॉगिन हो रहा है...' : 'न्यूज़रूम में प्रवेश करें (Sign In)'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-200 text-xs text-center">
              <p><Link to="/" className="text-black font-black hover:underline inline-flex items-center gap-1 font-devanagari"><Newspaper className="w-3.5 h-3.5" /> मुख्य वेबसाइट देखें</Link></p>
            </div>
          </div>

          <p className="text-center text-[10px] text-neutral-500 font-mono mt-4 font-bold">Secure • Supabase Auth • Asia/Kolkata</p>
        </div>
      </div>
    </div>
  );
};
