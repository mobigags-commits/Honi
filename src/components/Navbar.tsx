import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  ShieldAlert,
  User as UserIcon,
  Globe,
  DollarSign,
  ChevronDown,
  Menu,
  X,
  Bot,
  Zap,
  BarChart2,
  Repeat,
  Gift,
  Users,
  Award,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiAssistant: () => void;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  openAiAssistant,
  onUpdateUser,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrDropdownOpen, setIsCurrDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'Urdu (اردو)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
  ];

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'PKR', symbol: 'Rs' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'AED', symbol: 'AED' },
  ];

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: BarChart2 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'swap', label: 'Swap', icon: Repeat },
    { id: 'avq', label: 'AVQ Token', icon: Zap },
    { id: 'earn', label: 'Earn & Learn', icon: BookOpen },
    { id: 'referral', label: 'Referrals', icon: Users },
    { id: 'cashout', label: 'Cash-out', icon: Gift },
    { id: 'community', label: 'Community', icon: Award },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top System Status Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950/60 px-4 py-1 text-xs border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-0.5">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AVERIQ Mainnet Ready
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" /> AVQ Index: <span className="text-cyan-300">$0.8540 (+12.45%)</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">
            Easypaisa Gateway: <span className="text-amber-300 font-mono">SANDBOX ACTIVE (Zero Fake Transfers)</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-slate-300 font-mono">
          {/* Language Picker */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors py-0.5 px-1.5 rounded hover:bg-slate-800"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{languages.find(l => l.code === user.language)?.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-700 rounded shadow-xl py-1 z-50 text-xs">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onUpdateUser({ language: lang.code });
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                      user.language === lang.code ? 'text-cyan-400 font-bold bg-cyan-950/30' : 'text-slate-300'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Picker */}
          <div className="relative">
            <button
              onClick={() => setIsCurrDropdownOpen(!isCurrDropdownOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors py-0.5 px-1.5 rounded hover:bg-slate-800"
            >
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>{user.currency}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isCurrDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-slate-900 border border-slate-700 rounded shadow-xl py-1 z-50 text-xs">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      onUpdateUser({ currency: curr.code });
                      setIsCurrDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                      user.currency === curr.code ? 'text-emerald-400 font-bold bg-emerald-950/30' : 'text-slate-300'
                    }`}
                  >
                    <span>{curr.code}</span>
                    <span className="text-slate-400">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher Button */}
          {user.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'dashboard' : 'admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-purple-950/50 text-purple-300 border-purple-800/60 hover:bg-purple-900/50'
              }`}
            >
              {activeTab === 'admin' ? '← Exit Admin Mode' : '⚡ Super Admin Panel'}
            </button>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 text-xl tracking-wider">
                  AV
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">AVERIQ</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  GLOBAL
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wide font-medium block -mt-1">
                Averiq Token (AVQ) Ecosystem
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & AI Assistant Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={openAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 shadow-sm transition-all"
            >
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI Assistant</span>
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 pl-3 border-l border-slate-800 cursor-pointer hover:opacity-90"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {user.displayName.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <div className="text-xs font-semibold text-slate-100">{user.displayName}</div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  {user.points} Pts • {user.avqBalance.toFixed(1)} AVQ
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={openAiAssistant}
              className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/60"
            >
              <Bot className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Lang: {user.language.toUpperCase()}</span>
            <span>Curr: {user.currency}</span>
            {user.role === 'super_admin' && (
              <button
                onClick={() => {
                  setActiveTab(activeTab === 'admin' ? 'dashboard' : 'admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-amber-400 font-bold underline"
              >
                {activeTab === 'admin' ? 'Exit Admin' : 'Admin Panel'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
