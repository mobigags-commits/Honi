import React, { useState } from 'react';
import {
  User,
  PointsLedgerEntry,
  Achievement
} from '../types';
import {
  Wallet,
  Zap,
  Gift,
  Award,
  TrendingUp,
  Copy,
  Check,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  ledger: PointsLedgerEntry[];
  achievements: Achievement[];
  setActiveTab: (tab: string) => void;
  onClaimDaily: () => void;
  onConvertPoints: (points: number) => Promise<void>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  ledger,
  achievements,
  setActiveTab,
  onClaimDaily,
  onConvertPoints,
}) => {
  const [pointsToConvert, setPointsToConvert] = useState<number>(500);
  const [isConverting, setIsConverting] = useState(false);
  const [convertMessage, setConvertMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleConvert = async () => {
    if (pointsToConvert < 100) {
      setConvertMessage('Minimum conversion is 100 Points.');
      return;
    }
    setIsConverting(true);
    setConvertMessage(null);
    try {
      await onConvertPoints(pointsToConvert);
      setConvertMessage(`Successfully converted ${pointsToConvert} Points to ${(pointsToConvert / 20).toFixed(2)} AVQ!`);
    } catch (err: any) {
      setConvertMessage(err.message || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://averiq.global/ref/${user.referralCode}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
              Level {user.level} Citizen
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {user.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Hello, {user.displayName}
          </h1>
          <p className="text-slate-400 text-xs">
            Country: <span className="text-slate-200 font-medium">{user.country}</span> • Currency: <span className="text-emerald-400 font-bold">{user.currency}</span> • Risk Level: <span className="text-emerald-400 font-bold uppercase">{user.riskLevel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onClaimDaily}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>Claim Daily Bonus (+50 Pts)</span>
          </button>

          <button
            onClick={() => setActiveTab('cashout')}
            className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 font-bold text-xs border border-emerald-700/60 flex items-center gap-2 transition-all"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Withdraw Cash</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Available Points */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Ledger Points</span>
            <Gift className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{user.points} <span className="text-xs font-normal text-slate-400">Pts</span></div>
          <p className="text-[11px] text-cyan-400 font-medium">Rate: 20 Points = 1 AVQ</p>
        </div>

        {/* AVQ Balance */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>AVQ Rewards Balance</span>
            <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{user.avqBalance.toFixed(2)} <span className="text-xs font-normal text-slate-400">AVQ</span></div>
          <p className="text-[11px] text-slate-400">Est. Value: <strong className="text-slate-200">${(user.avqBalance * 0.854).toFixed(2)} USD</strong></p>
        </div>

        {/* Cash Rewards */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cash Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">${user.cashBalance.toFixed(2)} <span className="text-xs font-normal text-slate-400">USD</span></div>
          <p className="text-[11px] text-slate-400">~{(user.cashBalance * 278).toFixed(0)} PKR (Easypaisa Ready)</p>
        </div>

        {/* Referrals */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Referrals</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{user.referralCount} <span className="text-xs font-normal text-slate-400">Users</span></div>
          <p className="text-[11px] text-purple-300 font-medium">+500 Points Per Active Referral</p>
        </div>
      </div>

      {/* Main Content Grid: Converter & Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Point Conversion & Referral Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* AVQ Point Converter Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Convert Points to AVQ</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">1 AVQ = 20 Pts</span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs text-slate-400">Enter Points Amount to Redeem</label>
              <div className="relative">
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={pointsToConvert}
                  onChange={(e) => setPointsToConvert(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => setPointsToConvert(user.points)}
                  className="absolute right-2 top-2 px-2 py-1 rounded bg-slate-800 text-[10px] text-cyan-400 font-bold hover:bg-slate-700"
                >
                  MAX
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">You Will Receive:</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  {(pointsToConvert / 20).toFixed(2)} AVQ
                </span>
              </div>

              {convertMessage && (
                <div className={`text-xs p-2.5 rounded-lg font-medium ${convertMessage.includes('Successfully') ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-rose-950/60 text-rose-300 border border-rose-800'}`}>
                  {convertMessage}
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={isConverting || user.points < pointsToConvert}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isConverting ? 'Processing Ledger...' : 'Execute AVQ Conversion'}
              </button>
            </div>
          </div>

          {/* Referral Share Box */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Your Referral Link</span>
            </h3>
            <p className="text-xs text-slate-400">
              Invite friends to AVERIQ Global. Receive 500 ledger points when they complete their email verification.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://averiq.global/ref/${user.referralCode}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 font-mono"
              />
              <button
                onClick={copyReferralLink}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Points Ledger Activity History */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Audited Points & Rewards Ledger</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{ledger.length} Entries</span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {ledger.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-100">{entry.activity}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Ref: {entry.referenceId} • {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-bold text-sm ${entry.points > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {entry.points > 0 ? `+${entry.points}` : entry.points} Pts
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      entry.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      entry.status === 'redeemed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
