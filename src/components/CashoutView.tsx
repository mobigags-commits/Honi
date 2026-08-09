import React, { useState } from 'react';
import { CashoutRequest, EasypaisaConfig } from '../types';
import { Wallet, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Cpu, CreditCard, Building2, Terminal } from 'lucide-react';

interface CashoutViewProps {
  cashouts: CashoutRequest[];
  easypaisaConfig: EasypaisaConfig;
  userCashBalanceUsd: number;
  userCurrency: string;
  onRequestCashout: (cashoutData: { amount: number; method: 'easypaisa' | 'bank_wire' | 'crypto_usdt'; destinationAccount: string; currency: string }) => Promise<void>;
}

export const CashoutView: React.FC<CashoutViewProps> = ({
  cashouts,
  easypaisaConfig,
  userCashBalanceUsd,
  userCurrency,
  onRequestCashout,
}) => {
  const [method, setMethod] = useState<'easypaisa' | 'bank_wire' | 'crypto_usdt'>('easypaisa');
  const [amountInput, setAmountInput] = useState<string>('5000');
  const [accountInput, setAccountInput] = useState<string>('03001234567');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // PKR Rate
  const pkrRate = 278.0;
  const availablePkr = userCashBalanceUsd * pkrRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await onRequestCashout({
        amount: Number(amountInput),
        method,
        destinationAccount: accountInput,
        currency: userCurrency || 'PKR',
      });
      setStatusMsg({ text: 'Cash-out request submitted to Easypaisa Sandbox Processor.' });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Submission failed', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Regional & International Cash-out Gateways</span>
        </div>
        <h1 className="text-3xl font-black text-white">Reward Cash-out Portal</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Withdraw verified reward earnings directly via official merchant integration including <strong className="text-emerald-300">Easypaisa (Pakistan)</strong>, Bank Wire, or USDT.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cash-out Submission Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Withdrawal Request</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Balance: ${userCashBalanceUsd.toFixed(2)} USD (~Rs {availablePkr.toFixed(0)})
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setMethod('easypaisa');
                  setAmountInput('5000');
                  setAccountInput('03001234567');
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  method === 'easypaisa' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Easypaisa
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod('bank_wire');
                  setAmountInput('25000');
                  setAccountInput('PK36MEZN00010001020304');
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  method === 'bank_wire' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bank Wire
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod('crypto_usdt');
                  setAmountInput('50');
                  setAccountInput('0x71a2B81F943C3A29B0D9802422e1a3848bA95a7C');
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  method === 'crypto_usdt' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                USDT
              </button>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">
                Amount ({method === 'crypto_usdt' ? 'USD' : userCurrency || 'PKR'})
              </label>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">
                {method === 'easypaisa' ? 'Easypaisa Mobile Number' : method === 'bank_wire' ? 'IBAN / Bank Account' : 'USDT TRC20/ERC20 Wallet Address'}
              </label>
              <input
                type="text"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Withdrawal Limits:</span>
                <span className="text-slate-200">{easypaisaConfig.minWithdrawal} - {easypaisaConfig.maxWithdrawal} PKR</span>
              </div>
              <div className="flex justify-between">
                <span>Merchant Fee ({easypaisaConfig.processingFeePercent}%):</span>
                <span>{(Number(amountInput) * (easypaisaConfig.processingFeePercent / 100)).toFixed(1)} PKR</span>
              </div>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-xl text-xs ${statusMsg.isError ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'}`}>
                {statusMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Verifying Gateway Signature...' : `Submit Cash-out via ${method.toUpperCase()}`}
            </button>
          </form>
        </div>

        {/* Easypaisa Merchant Integration Architecture Inspector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Easypaisa Merchant Gateway Inspector</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SANDBOX ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Merchant ID</span>
                <span className="text-slate-200 font-bold">{easypaisaConfig.merchantId}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Store ID</span>
                <span className="text-slate-200 font-bold">{easypaisaConfig.storeId}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Webhook Signature Verification Protocol</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Payments are processed using HMAC SHA-256 signature verification. Payout statuses are updated to "Completed" strictly upon receipt of signed callback tokens from Easypaisa API endpoints.
              </p>
            </div>
          </div>

          {/* Cash-out History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Cash-out Reconciliation Ledger</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Req ID</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {cashouts.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 px-3 text-slate-400">{c.id}</td>
                      <td className="py-3 px-3 uppercase font-bold text-white">{c.method}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">{c.amount} {c.currency}</td>
                      <td className="py-3 px-3 text-slate-300">{c.destinationAccount}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          c.status === 'processing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
