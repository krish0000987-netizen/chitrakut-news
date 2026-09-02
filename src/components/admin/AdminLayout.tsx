import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Layers, MapPin, Users, Image as ImageIcon, Newspaper, Zap, LayoutTemplate, Megaphone, Menu, MessageSquare, Users2, BarChart3, Settings, LogOut, Eye, Bell, Search, X } from 'lucide-react';

const navGroups = [
  { label: 'अवलोकन', items: [{ icon: LayoutDashboard, label: 'डैशबोर्ड', path: '/admin' }] },
  { label: 'समाचार सामग्री', items: [
    { icon: FileText, label: 'सभी लेख / समाचार', path: '/admin/articles' },
    { icon: FileText, label: 'ड्राफ्ट लेख', path: '/admin/articles?status=draft' },
    { icon: FileText, label: 'शेड्यूल्ड लेख', path: '/admin/articles?status=scheduled' },
    { icon: Layers, label: 'समाचार श्रेणियाँ', path: '/admin/categories' },
    { icon: MapPin, label: 'स्थान एवं शहर', path: '/admin/locations' },
    { icon: Users, label: 'लेखक एवं पत्रकार', path: '/admin/authors' },
    { icon: ImageIcon, label: 'मीडिया लाइब्रेरी', path: '/admin/media' },
  ]},
  { label: 'समाचार पत्र (ई-पेपर)', items: [
    { icon: Zap, label: 'ब्रेकिंग न्यूज़', path: '/admin/breaking-news' },
    { icon: Newspaper, label: 'ई-पेपर प्रबंधन', path: '/admin/epaper' },
    { icon: Newspaper, label: 'ई-पेपर आर्काइव', path: '/admin/epaper?tab=archive' },
  ]},
  { label: 'वेबसाइट प्रबंधन', items: [
    { icon: LayoutTemplate, label: 'होमपेज लेआउट', path: '/admin/homepage' },
    { icon: Menu, label: 'मुख्य नेविगेशन', path: '/admin/navigation' },
    { icon: Megaphone, label: 'विज्ञापन प्रबंधन', path: '/admin/advertisements' },
    { icon: Search, label: 'पेज एवं एसईओ (SEO)', path: '/admin/seo' },
  ]},
  { label: 'पाठक एवं समुदाय', items: [
    { icon: MessageSquare, label: 'पाठक टिप्पणियाँ', path: '/admin/comments' },
    { icon: Users2, label: 'पाठक एवं सदस्य', path: '/admin/subscribers' },
  ]},
  { label: 'सिस्टम सेटिंग्स', items: [
    { icon: BarChart3, label: 'एनालिटिक्स रिपोर्ट', path: '/admin/analytics' },
    { icon: FileText, label: 'गतिविधि लॉग', path: '/admin/activity' },
    { icon: Users2, label: 'यूज़र्स एवं अधिकार', path: '/admin/users' },
    { icon: Settings, label: 'साइट सेटिंग्स', path: '/admin/settings' },
  ]},
];

export const AdminLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, signOut } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const onLogout = async ()=>{ await signOut(); nav('/admin/login'); };

  const activeItem = navGroups.flatMap(g=>g.items).find(i=> loc.pathname===i.path || (i.path!=='/admin' && loc.pathname.startsWith(i.path)));

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#111827] flex font-sans selection:bg-black selection:text-white">
      {/* Sidebar - Solid High Contrast Black */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black text-white flex flex-col border-r border-neutral-800 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950">
          <img src="/assets/logo.jpg" alt="logo" className="h-9 w-auto rounded bg-white p-0.5" />
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-sm leading-tight text-white font-devanagari">चित्रकूट ज्योति</h1>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">न्यूज़रूम CMS</p>
          </div>
          <button onClick={()=>setMobileOpen(false)} className="lg:hidden p-1.5 hover:bg-neutral-800 text-white rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {navGroups.map(g=>(
            <div key={g.label}>
              <p className="text-[10px] font-black tracking-wider text-neutral-400 px-2.5 mb-1.5 uppercase font-devanagari">{g.label}</p>
              <div className="space-y-1">
                {g.items.map(it=>{
                  const active = loc.pathname === it.path || (it.path!=='/admin' && loc.pathname.startsWith(it.path));
                  const Icon = it.icon;
                  return (
                    <Link
                      key={it.path+it.label}
                      to={it.path}
                      onClick={()=>setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-white text-black shadow-lg font-black'
                          : 'text-neutral-200 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-black' : 'text-neutral-400'}`} />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5 bg-neutral-900/90 rounded-xl p-2.5 border border-neutral-800">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.email || 'admin'}</p>
              <p className="text-[10px] text-amber-400 font-semibold">सुपर एडमिन (Admin)</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-neutral-800 text-neutral-300 hover:text-red-400 rounded-lg transition-colors shrink-0"
              title="लॉगआउट"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Clean Crisp White & Black */}
      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 shadow-sm flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={()=>setMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-black hover:bg-neutral-100 rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-black text-base sm:text-lg text-black font-devanagari">
                {activeItem?.label || 'डैशबोर्ड'}
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">
                चित्रकूट ज्योति न्यूज़ पोर्टल • एडमिन नियंत्रण कक्ष
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>वेबसाइट देखें</span>
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 flex-1">{children}</main>
      </div>

      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs" onClick={()=>setMobileOpen(false)} />}
    </div>
  );
};
