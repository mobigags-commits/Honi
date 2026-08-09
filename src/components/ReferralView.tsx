import React, { useState } from 'react';
import { User } from '../types';
import { Users, Copy, Check, Award, ShieldAlert, Share2 } from 'lucide-react';

interface ReferralViewProps {
  user: User;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ user }) => {
  const [isCopied, setIsCopied] = useState(false);

  const refUrl = `https://averiq.global/ref/${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(refUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>Global Ambassador Referral Program</span>
        </div>
        <h1 className="text-3xl font-black text-white">Invite & Earn Rewards</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Share your referral link. Earn 500 ledger points per verified member joining the AVERIQ ecosystem.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-mono">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Total Referrals</span>
          <div className="text-2xl font-bold text-white">{user.referralCount}</div>
          <span className="text-xs text-purple-400">Verified Active Accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Points Earned via Referrals</span>
          <div className="text-2xl font-bold text-cyan-400">{user.referralCount * 500} Pts</div>
          <span className="text-xs text-slate-400">~{((user.referralCount * 500) / 20).toFixed(0)} AVQ Equivalent</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Referral Code</span>
          <div className="text-2xl font-bold text-amber-400">{user.referralCode}</div>
          <span className="text-xs text-slate-400">Tier 1 Ambassador</span>
        </div>
      </div>

      {/* Share Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Your Unique Referral Link</span>
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={refUrl}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono text-slate-200"
          />
          <button
            onClick={copyLink}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Link Copied' : 'Copy Link'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Anti-Abuse Protection Rules</span>
          </div>
          <p className="leading-relaxed">
            Self-referrals, bot generation, and automated multi-accounting are monitored by server-side anti-fraud models. Any suspicious activity will lead to reward holds and referral status reversal.
          </p>
        </div>
      </div>
    </div>
  );
};
