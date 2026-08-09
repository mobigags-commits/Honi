import React from 'react';
import { Home, BarChart2, TrendingUp, Gift, Wallet, User as UserIcon } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'markets', label: 'Markets', icon: BarChart2 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'earn', label: 'Earn', icon: Gift },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'dashboard', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
