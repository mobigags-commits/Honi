import React, { useState } from 'react';
import { Repeat, ArrowDown, Settings, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface SwapViewProps {
  onExecuteSwap: (swapData: { fromSymbol: string; toSymbol: string; fromAmount: number; expectedToAmount: number; slippage: number }) => Promise<any>;
}

export const SwapView: React.FC<SwapViewProps> = ({ onExecuteSwap }) => {
  const [fromSymbol, setFromSymbol] = useState('USDT');
  const [toSymbol, setToSymbol] = useState('AVQ');
  const [fromAmount, setFromAmount] = useState<string>('100');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResult, setSwapResult] = useState<any>(null);

  // Exchange rates relative to USD
  const rates: Record<string, number> = {
    USDT: 1.0,
    AVQ: 0.8540,
    BTC: 94850.0,
    ETH: 3420.5,
    SOL: 188.4,
    PKR: 0.0036, // ~278 PKR per USD
  };

  const fromUsd = (Number(fromAmount) || 0) * (rates[fromSymbol] || 1);
  const toRate = rates[toSymbol] || 1;
  const expectedToAmount = fromUsd / toRate;

  const handleSwap = async () => {
    setIsSwapping(true);
    setSwapResult(null);
    try {
      const res = await onExecuteSwap({
        fromSymbol,
        toSymbol,
        fromAmount: Number(fromAmount),
        expectedToAmount,
        slippage,
      });
      setSwapResult(res);
    } catch (err: any) {
      setSwapResult({ error: err.message || 'Swap execution failed' });
    } finally {
      setIsSwapping(false);
    }
  };

  const switchTokens = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  };

  return (
    <div className="space-y-8 pb-12 max-w-lg mx-auto px-4 pt-10">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Repeat className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-black text-white font-mono">AVQ Instant Swap</h1>
          </div>

          {/* Slippage controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            {[0.1, 0.5, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  slippage === s ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>

        {/* From Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>You Pay</span>
            <span>Est. Value: ${fromUsd.toFixed(2)} USD</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-black font-mono text-white focus:outline-none"
            />

            <select
              value={fromSymbol}
              onChange={(e) => setFromSymbol(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold font-mono text-white focus:outline-none"
            >
              {Object.keys(rates).map((sym) => (
                <option key={sym} value={sym}>{sym}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={switchTokens}
            className="p-3 rounded-full bg-slate-800 border-2 border-slate-900 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-all shadow-lg"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* To Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>You Receive (Estimated)</span>
            <span>Est. Value: ${fromUsd.toFixed(2)} USD</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-2xl font-black font-mono text-cyan-300">
              {expectedToAmount.toFixed(expectedToAmount < 1 ? 4 : 2)}
            </div>

            <select
              value={toSymbol}
              onChange={(e) => setToSymbol(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold font-mono text-white focus:outline-none"
            >
              {Object.keys(rates).map((sym) => (
                <option key={sym} value={sym}>{sym}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Breakdown */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono text-slate-400">
          <div className="flex justify-between">
            <span>Exchange Rate:</span>
            <span className="text-slate-200 font-bold">1 {fromSymbol} = {(rates[fromSymbol] / rates[toSymbol]).toFixed(4)} {toSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Slippage Tolerance:</span>
            <span className="text-cyan-400 font-bold">{slippage}%</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Network Fee:</span>
            <span className="text-slate-200">0.0015 ETH</span>
          </div>
        </div>

        {swapResult && (
          <div className={`p-3.5 rounded-xl text-xs font-mono ${swapResult.error ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'}`}>
            {swapResult.error ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{swapResult.error}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Swap Transaction Confirmed!</span>
                </div>
                <div>Received: {swapResult.receivedTo}</div>
                <div className="text-[10px] text-slate-400 break-all">TxHash: {swapResult.txHash}</div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={isSwapping || Number(fromAmount) <= 0}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          {isSwapping ? 'Executing On-Chain Swap...' : `Swap ${fromSymbol} → ${toSymbol}`}
        </button>
      </div>
    </div>
  );
};
