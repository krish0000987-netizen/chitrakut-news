import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Key, LogIn, ShieldCheck, Newspaper, ArrowRight, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loginType, setLoginType] = useState<'reader' | 'admin'>('reader');
  
  // Reader Form
  const [readerEmail, setReaderEmail] = useState('rajesh.s@example.com');
  const [readerPassword, setReaderPassword] = useState('reader2026');

  // Admin Form
  const [adminEmail, setAdminEmail] = useState('admin@chitrakootjyoti.com');
  const [adminPassword, setAdminPassword] = useState('Admin@123456');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReaderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerEmail || !readerPassword) {
      setError('Please enter valid email and password');
      return;
    }
    setError('');
    navigate('/profile');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setError('Please enter valid editorial credentials');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await signIn(adminEmail.trim(), adminPassword);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header Branding */}
        <div className="bg-red-900 text-white p-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
            <Newspaper className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="font-serif-title font-black text-2xl tracking-wide uppercase">
            BHARAT POST
          </h1>
          <p className="text-xs text-red-200 mt-1 uppercase tracking-wider font-semibold">
            Single Sign-On Authentication
          </p>
        </div>

        {/* Login Type Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button
            onClick={() => { setLoginType('reader'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              loginType === 'reader'
                ? 'border-red-900 text-red-900 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Subscriber Login</span>
          </button>
          
          <button
            onClick={() => { setLoginType('admin'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              loginType === 'admin'
                ? 'border-red-900 text-red-900 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Editorial CMS</span>
          </button>
        </div>

        {/* Credentials Notice */}
        <div className="p-6">
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3.5 rounded-xl mb-6 text-xs text-amber-900 dark:text-amber-200 font-sans-ui">
            <div className="flex items-center space-x-1.5 font-bold mb-1.5 text-amber-800 dark:text-amber-400">
              <Key className="w-4 h-4 shrink-0" />
              <span className="uppercase tracking-wider">
                DEMO CREDENTIALS ({loginType === 'reader' ? 'Subscriber' : 'CMS Admin'}):
              </span>
            </div>
            {loginType === 'reader' ? (
              <div className="font-mono text-[11px] space-y-1">
                <p>Email: <span className="font-bold text-slate-900 dark:text-slate-100">rajesh.s@example.com</span></p>
                <p>Passcode: <span className="font-bold text-slate-900 dark:text-slate-100">reader2026</span></p>
              </div>
            ) : (
              <div className="font-mono text-[11px] space-y-1">
                <p>Email: <span className="font-bold text-slate-900 dark:text-slate-100">admin@chitrakootjyoti.com</span></p>
                <p>Password: <span className="font-bold text-slate-900 dark:text-slate-100">Admin@123456</span></p>
                <p className="text-[10px] text-slate-500 mt-1">Or: editor@bharatpost.in / editor2026</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 p-3 rounded-lg text-xs font-bold mb-4 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Reader Form */}
          {loginType === 'reader' && (
            <form onSubmit={handleReaderLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subscriber Email ID
                </label>
                <input
                  type="email"
                  value={readerEmail}
                  onChange={(e) => setReaderEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={readerPassword}
                  onChange={(e) => setReaderPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded-xl uppercase tracking-wider transition-colors shadow flex items-center justify-center space-x-2 text-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Access Reader Account</span>
              </button>
            </form>
          )}

          {/* Admin Form */}
          {loginType === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bureau Chief / Editor ID
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CMS Access Token / Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold rounded-xl uppercase tracking-wider transition-colors shadow flex items-center justify-center space-x-2 text-xs"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Login to Newsroom CMS'}</span>
              </button>
            </form>
          )}

          {/* Quick Access Action */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 mb-2">Don't have an active subscription yet?</p>
            <Link
              to="/subscribe"
              className="text-xs font-bold text-red-800 dark:text-red-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Explore Bharat Post Subscription Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
