import React from 'react';
import { ShieldCheck, Lock, Globe, FileText, AlertTriangle, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenModal: (title: string, contentType: string) => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal, setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-12 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center">
              <span className="font-extrabold text-white font-mono text-sm">AV</span>
            </div>
            <span className="text-lg font-black tracking-tight text-white font-mono">AVERIQ</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            AVERIQ is an independent global technology and Web3 financial ecosystem. Powered by Averiq Token (AVQ),
            incorporating server-side points ledgers, decentralized trading, token swaps, and regional cash-out gateways.
          </p>
          <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px]">
            <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Audited Contract
            </span>
            <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              256-bit SSL
            </span>
          </div>
        </div>

        {/* Ecosystem Links */}
        <div>
          <h4 className="text-slate-200 font-bold tracking-wide uppercase text-[11px] mb-3">Ecosystem</h4>
          <ul className="space-y-2 font-medium">
            <li><button onClick={() => setActiveTab('markets')} className="hover:text-cyan-400 transition-colors">Markets Index</button></li>
            <li><button onClick={() => setActiveTab('trade')} className="hover:text-cyan-400 transition-colors">Spot Trading</button></li>
            <li><button onClick={() => setActiveTab('swap')} className="hover:text-cyan-400 transition-colors">AVQ Swap Router</button></li>
            <li><button onClick={() => setActiveTab('avq')} className="hover:text-cyan-400 transition-colors">AVQ Tokenomics</button></li>
            <li><button onClick={() => setActiveTab('earn')} className="hover:text-cyan-400 transition-colors">Learn & Earn Quizzes</button></li>
            <li><button onClick={() => setActiveTab('referral')} className="hover:text-cyan-400 transition-colors">Ambassador Referrals</button></li>
          </ul>
        </div>

        {/* Cash-out & Local Gateways */}
        <div>
          <h4 className="text-slate-200 font-bold tracking-wide uppercase text-[11px] mb-3">Local & Global Cash-out</h4>
          <ul className="space-y-2 font-medium">
            <li><button onClick={() => setActiveTab('cashout')} className="hover:text-cyan-400 transition-colors">Easypaisa Merchant Gateway</button></li>
            <li><button onClick={() => onOpenModal('Easypaisa Integration Architecture', 'easypaisa_terms')} className="hover:text-cyan-400 transition-colors">Sandbox Reconciliation Rules</button></li>
            <li><button onClick={() => onOpenModal('Cash-out Terms & Conditions', 'cashout_terms')} className="hover:text-cyan-400 transition-colors">Cash-out Limits & Fees</button></li>
            <li><button onClick={() => onOpenModal('Anti-Fraud Protections', 'antifraud')} className="hover:text-cyan-400 transition-colors">Anti-Abuse Verification</button></li>
            <li><button onClick={() => setActiveTab('wallet')} className="hover:text-cyan-400 transition-colors">Crypto Wallet Connect</button></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h4 className="text-slate-200 font-bold tracking-wide uppercase text-[11px] mb-3">Legal & Security</h4>
          <ul className="space-y-2 font-medium">
            <li><button onClick={() => onOpenModal('Terms of Service', 'terms')} className="hover:text-cyan-400 transition-colors">Terms of Service</button></li>
            <li><button onClick={() => onOpenModal('Privacy Policy', 'privacy')} className="hover:text-cyan-400 transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => onOpenModal('Cookie Policy', 'cookie')} className="hover:text-cyan-400 transition-colors">Cookie Policy</button></li>
            <li><button onClick={() => onOpenModal('Risk Disclosure Statement', 'risk')} className="hover:text-cyan-400 transition-colors">Risk Disclosure</button></li>
            <li><button onClick={() => onOpenModal('Trading Risk Warning', 'trading_risk')} className="hover:text-cyan-400 transition-colors">Trading Risk Notice</button></li>
            <li><button onClick={() => onOpenModal('Community Safety Rules', 'community_rules')} className="hover:text-cyan-400 transition-colors">Community Guidelines</button></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer Box */}
      <div className="max-w-7xl mx-auto border-t border-slate-800/80 pt-6 space-y-3">
        <div className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Risk Warning:</strong> Trading digital assets and participation in cryptocurrency token markets involves substantial market risk and volatility.
            AVERIQ does not advertise or guarantee profits, guaranteed monetary value, or risk-free returns. All reward points and AVQ token conversions are subject to server-side eligibility checks and platform security rules.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-mono pt-2">
          <span>© 2026 AVERIQ Platform. All rights reserved. Native Token: Averiq Token (AVQ).</span>
          <span className="mt-2 sm:mt-0 flex items-center gap-1 text-slate-400">
            <Cpu className="w-3 h-3 text-cyan-400" /> System Engine v3.8.2 Global Release
          </span>
        </div>
      </div>
    </footer>
  );
};
