import React, { useState, useEffect } from 'react';
import { CashoutRequest, EmergencyControls, AuditLog, EasypaisaConfig } from '../types';
import { ShieldAlert, AlertOctagon, Check, X, FileText, Activity, Users, Wallet, DollarSign, Settings, Lock } from 'lucide-react';

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/v1/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleToggleEmergency = async (key: string, currentValue: boolean) => {
    try {
      const res = await fetch('/api/v1/admin/emergency-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminStats();
      }
    } catch (err) {
      alert('Failed to update emergency control');
    }
  };

  const handleCashoutAction = async (cashoutId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/v1/admin/cashout-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cashoutId, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminStats();
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading Super Admin Controls...</div>;
  }

  const emergency: EmergencyControls = stats?.emergencyControls || {};
  const logs: AuditLog[] = stats?.auditLogs || [];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 border border-purple-800/80 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Super Admin Emergency Control Room</span>
        </div>
        <h1 className="text-3xl font-black text-white">AVERIQ Platform Administration</h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Platform health metrics, emergency pause controls, cash-out approval queue, and immutable audit logs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Total Accounts</span>
          <div className="text-2xl font-bold text-white">{stats?.totalUsers?.toLocaleString()}</div>
          <span className="text-xs text-emerald-400">{stats?.activeToday} Active Today</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Points Issued</span>
          <div className="text-2xl font-bold text-cyan-400">{stats?.totalPointsIssued?.toLocaleString()} Pts</div>
          <span className="text-xs text-slate-400">{stats?.avqDistributed?.toLocaleString()} AVQ Converted</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Pending Cash-outs</span>
          <div className="text-2xl font-bold text-amber-400">{stats?.cashoutsPendingCount} Requests</div>
          <span className="text-xs text-slate-400">${stats?.cashoutsCompletedTotalUsd?.toLocaleString()} USD Total Paid</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">AdSense Net Revenue</span>
          <div className="text-2xl font-bold text-purple-400">$2,480.50 USD</div>
          <span className="text-xs text-slate-400">Compliant Ad Slots</span>
        </div>
      </div>

      {/* Owner 20% Commission Vault Panel */}
      {stats?.platformOwnerVault && (
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>20% Platform Owner Royalty & Commission Vault</span>
              </div>
              <h2 className="text-xl font-bold text-white">Owner Revenue Vault (Auto 20% Share)</h2>
              <p className="text-xs text-slate-300">
                You (the Platform Owner) automatically earn a 20% royalty share on all user earnings, conversions, quiz rewards, and cash-outs.
              </p>
            </div>
            
            <div className="bg-amber-950/80 border border-amber-500/50 rounded-xl p-3 text-right font-mono">
              <span className="text-[10px] text-amber-400 uppercase font-bold">Owner Commission Rate</span>
              <div className="text-2xl font-black text-amber-300">20.0% ALWAYS</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Accumulated 20% Points Cut</span>
              <div className="text-xl font-bold text-cyan-400">{stats.platformOwnerVault.totalPointsCommission?.toLocaleString()} Pts</div>
              <span className="text-[11px] text-slate-500">From daily logins & quizzes</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">20% AVQ Token Royalty</span>
              <div className="text-xl font-bold text-amber-400">{stats.platformOwnerVault.totalAvqCommission?.toLocaleString()} AVQ</div>
              <span className="text-[11px] text-slate-500">From point conversions</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold">AdSense Direct 20% Owner Cut</span>
              <div className="text-xl font-bold text-emerald-300">${stats.platformOwnerVault.adSenseOwnerShareUsd?.toLocaleString()} USD</div>
              <span className="text-[11px] text-amber-400/80">≈ {stats.platformOwnerVault.adSenseOwnerSharePkr?.toLocaleString()} PKR directly from AdSense</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Owner USD Vault</span>
              <div className="text-xl font-bold text-emerald-400">${stats.platformOwnerVault.totalUsdCommission?.toLocaleString()} USD</div>
              <span className="text-[11px] text-slate-500">≈ {stats.platformOwnerVault.totalPkrCommission?.toLocaleString()} PKR</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Trading Fees Share (20%)</span>
              <div className="text-xl font-bold text-purple-400">${stats.platformOwnerVault.totalTradingFeesUsd?.toLocaleString()} USD</div>
              <span className="text-[11px] text-slate-500">From orderbook trades</span>
            </div>
          </div>

          {/* Owner Royalty Withdrawal Trigger Form */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>Withdraw Owner Royalty Earnings to Bank / Easypaisa</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Withdrawal Amount ($ USD)</label>
                <input
                  type="number"
                  id="owner-withdraw-amount"
                  placeholder="e.g. 500"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Destination Bank / Easypaisa Account</label>
                <input
                  type="text"
                  id="owner-withdraw-dest"
                  placeholder="e.g. Easypaisa 0300-1234567 or Meezan Bank"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={async () => {
                    const amtInput = document.getElementById('owner-withdraw-amount') as HTMLInputElement;
                    const destInput = document.getElementById('owner-withdraw-dest') as HTMLInputElement;
                    const amt = amtInput?.value;
                    const dest = destInput?.value;

                    if (!amt || !dest) {
                      alert('Please specify amount and destination account');
                      return;
                    }

                    try {
                      const res = await fetch('/api/v1/admin/withdraw-owner-vault', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amountUsd: amt, destination: dest }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert(`Successfully withdrawn $${amt} USD (${(Number(amt) * 280).toLocaleString()} PKR) to ${dest}!`);
                        if (amtInput) amtInput.value = '';
                        if (destInput) destInput.value = '';
                        fetchAdminStats();
                      } else {
                        alert(data.error || 'Withdrawal failed');
                      }
                    } catch (e) {
                      alert('Error processing owner withdrawal');
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg transition-all shadow-lg"
                >
                  Collect Owner 20% Royalty
                </button>
              </div>
            </div>

            {/* Payout Logs */}
            {stats.platformOwnerVault.ownerWithdrawalLogs?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 font-mono font-bold uppercase block">Owner Royalty Withdrawal History</span>
                <div className="space-y-2">
                  {stats.platformOwnerVault.ownerWithdrawalLogs.map((log: any) => (
                    <div key={log.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-amber-300">${log.amountUsd} USD ({log.amountPkr?.toLocaleString()} PKR)</div>
                        <div className="text-[11px] text-slate-400">{log.destination}</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          {log.status}
                        </span>
                        <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emergency Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <AlertOctagon className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Emergency Kill Switches & Circuit Breakers</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
          {[
            { key: 'pauseCashouts', label: 'Pause Cash-outs', active: emergency.pauseCashouts },
            { key: 'pauseRewards', label: 'Pause Reward Conversion', active: emergency.pauseRewards },
            { key: 'pauseSwaps', label: 'Pause Token Swaps', active: emergency.pauseSwaps },
            { key: 'pauseTrading', label: 'Pause Orderbook Trading', active: emergency.pauseTrading },
            { key: 'maintenanceMode', label: 'Global Maintenance', active: emergency.maintenanceMode },
          ].map((item) => (
            <div
              key={item.key}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                item.active
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div>
                <span className="font-bold text-sm block">{item.label}</span>
                <span className="text-[10px] opacity-80">{item.active ? 'PAUSED / BLOCKED' : 'NORMAL OPERATION'}</span>
              </div>

              <button
                onClick={() => handleToggleEmergency(item.key, item.active)}
                className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                  item.active
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {item.active ? 'Resume Operation' : 'TRIGGER EMERGENCY PAUSE'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Super Admin Immutable Audit Log</span>
        </h3>

        <div className="space-y-2 font-mono text-xs max-h-72 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                    {log.action}
                  </span>
                  <span>Target: {log.target}</span>
                </div>
                <div className="text-slate-400 text-[11px]">{log.details}</div>
              </div>
              <div className="text-right text-[10px] text-slate-500">
                <div>By: {log.adminName}</div>
                <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
