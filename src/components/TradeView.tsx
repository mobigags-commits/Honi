import React, { useState } from 'react';
import { MarketAsset, Order } from '../types';
import { TrendingUp, TrendingDown, Clock, BarChart2, CheckCircle2, ArrowUpDown } from 'lucide-react';

interface TradeViewProps {
  markets: MarketAsset[];
  orders: Order[];
  onPlaceOrder: (order: { pair: string; side: 'buy' | 'sell'; type: 'market' | 'limit'; price: number; amount: number }) => Promise<void>;
}

export const TradeView: React.FC<TradeViewProps> = ({ markets, orders, onPlaceOrder }) => {
  const [selectedPair, setSelectedPair] = useState<string>('AVQ/USDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [priceInput, setPriceInput] = useState<string>('0.8540');
  const [amountInput, setAmountInput] = useState<string>('100');
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1D'>('1h');
  const [indicatorRsi, setIndicatorRsi] = useState(true);
  const [indicatorMacd, setIndicatorMacd] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const currentAsset = markets.find((m) => m.symbol === selectedPair) || markets[0];

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await onPlaceOrder({
        pair: selectedPair,
        side,
        type: orderType,
        price: Number(priceInput) || currentAsset.price,
        amount: Number(amountInput) || 10,
      });
      setStatusMsg(`Order executed successfully!`);
    } catch (err: any) {
      setStatusMsg(err.message || 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Pair Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedPair}
            onChange={(e) => {
              setSelectedPair(e.target.value);
              const m = markets.find(x => x.symbol === e.target.value);
              if (m) setPriceInput(m.price.toString());
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-white text-base focus:outline-none focus:border-cyan-500"
          >
            {markets.map((m) => (
              <option key={m.symbol} value={m.symbol}>
                {m.symbol}
              </option>
            ))}
          </select>

          <div>
            <div className="text-xl font-black font-mono text-white">
              {currentAsset.symbol.includes('PKR') ? `Rs ${currentAsset.price}` : `$${currentAsset.price.toFixed(4)}`}
            </div>
            <div className={`text-xs font-bold font-mono ${currentAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentAsset.change24h >= 0 ? '+' : ''}{currentAsset.change24h}% (24h)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase">24h High</span>
            <span className="text-slate-200 font-bold">${currentAsset.high24h}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase">24h Low</span>
            <span className="text-slate-200 font-bold">${currentAsset.low24h}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase">24h Volume</span>
            <span className="text-slate-200 font-bold">${currentAsset.volume24h.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Trading Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Candlestick Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            {/* Timeframes */}
            <div className="flex items-center gap-1">
              {(['1m', '5m', '15m', '1h', '4h', '1D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    timeframe === tf ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Technical Indicators */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <label className="flex items-center gap-1 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={indicatorRsi}
                  onChange={(e) => setIndicatorRsi(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>RSI (14)</span>
              </label>

              <label className="flex items-center gap-1 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={indicatorMacd}
                  onChange={(e) => setIndicatorMacd(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>MACD</span>
              </label>
            </div>
          </div>

          {/* SVG Candlestick Chart Simulation */}
          <div className="h-72 w-full bg-slate-950 rounded-xl border border-slate-800/80 p-4 relative flex flex-col justify-between overflow-hidden">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500">
              AVERIQ Spot Price Feed • {timeframe} Candles
            </div>

            {/* Price Candlesticks SVG */}
            <svg className="w-full h-full pt-6 pb-6 overflow-visible" viewBox="0 0 400 180">
              {/* Grid lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="400" y2="130" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Sample Candle Bars */}
              {/* Candle 1 Green */}
              <line x1="40" y1="120" x2="40" y2="60" stroke="#10b981" strokeWidth="1.5" />
              <rect x="32" y="70" width="16" height="40" fill="#10b981" rx="1" />

              {/* Candle 2 Red */}
              <line x1="100" y1="110" x2="100" y2="40" stroke="#f43f5e" strokeWidth="1.5" />
              <rect x="92" y="50" width="16" height="50" fill="#f43f5e" rx="1" />

              {/* Candle 3 Green */}
              <line x1="160" y1="100" x2="160" y2="30" stroke="#10b981" strokeWidth="1.5" />
              <rect x="152" y="40" width="16" height="50" fill="#10b981" rx="1" />

              {/* Candle 4 Green */}
              <line x1="220" y1="80" x2="220" y2="20" stroke="#10b981" strokeWidth="1.5" />
              <rect x="212" y="30" width="16" height="40" fill="#10b981" rx="1" />

              {/* Candle 5 Red */}
              <line x1="280" y1="90" x2="280" y2="30" stroke="#f43f5e" strokeWidth="1.5" />
              <rect x="272" y="40" width="16" height="35" fill="#f43f5e" rx="1" />

              {/* Candle 6 Green (Current) */}
              <line x1="340" y1="70" x2="340" y2="15" stroke="#10b981" strokeWidth="1.5" />
              <rect x="332" y="25" width="16" height="35" fill="#10b981" rx="1" />

              {/* RSI Overlay line */}
              {indicatorRsi && (
                <path d="M 30 140 Q 120 120, 200 135 T 370 110" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
              )}
            </svg>

            {/* Volume Overlay */}
            <div className="h-10 border-t border-slate-800/80 pt-1 flex items-end justify-between px-6">
              <div className="w-3 bg-emerald-500/40 h-6 rounded-t"></div>
              <div className="w-3 bg-rose-500/40 h-8 rounded-t"></div>
              <div className="w-3 bg-emerald-500/40 h-7 rounded-t"></div>
              <div className="w-3 bg-emerald-500/40 h-9 rounded-t"></div>
              <div className="w-3 bg-rose-500/40 h-5 rounded-t"></div>
              <div className="w-3 bg-emerald-500/40 h-8 rounded-t"></div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Form & Orderbook */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Placement Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            {/* Buy / Sell Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  side === 'buy' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                BUY {selectedPair.split('/')[0]}
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  side === 'sell' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                SELL {selectedPair.split('/')[0]}
              </button>
            </div>

            {/* Limit / Market Toggle */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                onClick={() => setOrderType('limit')}
                className={`pb-1 ${orderType === 'limit' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400' : 'text-slate-400'}`}
              >
                Limit Order
              </button>
              <button
                onClick={() => setOrderType('market')}
                className={`pb-1 ${orderType === 'market' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400' : 'text-slate-400'}`}
              >
                Market Instant
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-3 font-mono text-xs">
              {orderType === 'limit' && (
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Price (USDT)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Amount ({selectedPair.split('/')[0]})</label>
                <input
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Estimated Total:</span>
                  <span className="text-white font-bold">
                    ${((Number(priceInput) || currentAsset.price) * (Number(amountInput) || 0)).toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (0.1%):</span>
                  <span>${(((Number(priceInput) || currentAsset.price) * (Number(amountInput) || 0)) * 0.001).toFixed(4)}</span>
                </div>
              </div>

              {statusMsg && (
                <div className="text-xs p-2 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-xs text-white shadow-lg transition-all ${
                  side === 'buy'
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                    : 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20'
                }`}
              >
                {isSubmitting ? 'Submitting Order...' : `${side.toUpperCase()} ${selectedPair.split('/')[0]}`}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Orders History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Active & Historic Orders</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Pair</th>
                <th className="py-2.5 px-3">Side</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td className="py-3 px-3 text-slate-400">{ord.id}</td>
                  <td className="py-3 px-3 font-bold text-white">{ord.pair}</td>
                  <td className={`py-3 px-3 font-bold uppercase ${ord.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {ord.side}
                  </td>
                  <td className="py-3 px-3 text-slate-300 uppercase">{ord.type}</td>
                  <td className="py-3 px-3 text-slate-200">${ord.price}</td>
                  <td className="py-3 px-3 text-slate-200">{ord.amount}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
