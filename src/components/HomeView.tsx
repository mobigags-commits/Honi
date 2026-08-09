import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Gift,
  ArrowRight,
  Globe,
  Repeat,
  Wallet,
  Users,
  CheckCircle2,
  Lock,
  BarChart2,
  Cpu
} from 'lucide-react';
import { MarketAsset } from '../types';

interface HomeViewProps {
  markets: MarketAsset[];
  setActiveTab: (tab: string) => void;
  openAiAssistant: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ markets, setActiveTab, openAiAssistant }) => {
  const topGainers = markets.slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>Next-Gen Web3 Financial & Reward Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none font-sans">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-cyan-200">AVERIQ</span> Global
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Empowering worldwide users with transparent points ledgers, native <strong className="text-cyan-300">Averiq Token (AVQ)</strong> rewards, live spot trading, token swaps, and regional cash-out gateways including Easypaisa.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
              >
                <span>Launch User Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('earn')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 flex items-center gap-2 transition-all"
              >
                <Gift className="w-4 h-4 text-cyan-400" />
                <span>Earn AVQ Rewards</span>
              </button>

              <button
                onClick={() => setActiveTab('cashout')}
                className="px-6 py-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold text-sm border border-emerald-700/60 flex items-center gap-2 transition-all"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Easypaisa Cash-out</span>
              </button>
            </div>

            {/* Verification badging */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <div>
                <span className="text-white font-bold block text-sm">1,000,000,000</span>
                <span>AVQ Max Supply</span>
              </div>
              <div>
                <span className="text-white font-bold block text-sm">Server-Side</span>
                <span>Audit Validation</span>
              </div>
              <div>
                <span className="text-white font-bold block text-sm">Easypaisa</span>
                <span>Merchant Sandbox</span>
              </div>
            </div>
          </div>

          {/* Hero Live Token Ticker Widget */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                  <span className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">Live Market Rates</span>
                </div>
                <button onClick={() => setActiveTab('markets')} className="text-xs text-cyan-400 font-semibold hover:underline">
                  View All Markets →
                </button>
              </div>

              <div className="space-y-3">
                {topGainers.map((asset) => (
                  <div
                    key={asset.symbol}
                    onClick={() => setActiveTab('trade')}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-sm font-bold text-white font-mono">{asset.symbol}</div>
                      <div className="text-[11px] text-slate-400">{asset.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-100 font-mono">
                        {asset.symbol.includes('PKR') ? `Rs ${asset.price}` : `$${asset.price.toFixed(asset.price < 1 ? 4 : 2)}`}
                      </div>
                      <div className={`text-xs font-bold font-mono ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>AVQ Staking APY: <strong className="text-cyan-300 font-mono">18.5%</strong></span>
                <button
                  onClick={openAiAssistant}
                  className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Cpu className="w-3.5 h-3.5" /> Ask AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Compliant Banner Slot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-4 text-center">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Sponsored Advertisement Slot</div>
          <div className="h-16 flex items-center justify-center bg-slate-950/60 rounded border border-slate-800/50 text-slate-400 text-xs font-mono">
            [ Compliant AdSense Network Container Slot — Auto-Configured for Approved Publishers ]
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Integrated Global Architecture
          </h2>
          <p className="text-slate-400 text-sm">
            Combining decentralized Web3 assets with reliable Web2 payment gateways and server-side anti-fraud verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AVQ Ecosystem</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1 Billion fixed max supply Averiq Token with transparent vesting schedules and audited ERC20 smart contract logic.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Points & Rewards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn ledger points through daily check-ins, Web3 quizzes, and referral milestones. Convert 20 Points directly to 1 AVQ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Easypaisa Gateway</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official merchant sandbox setup for regional cash-outs in PKR with signature verification and webhook reconciliation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Anti-Fraud Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-assisted risk scoring deters self-referrals, bot abuse, and farming before funds are disbursed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
