import React, { useState } from 'react';
import { MarketAsset } from '../types';
import { Search, Star, TrendingUp, TrendingDown, Zap, BarChart2 } from 'lucide-react';

interface MarketsViewProps {
  markets: MarketAsset[];
  setActiveTab: (tab: string) => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({ markets, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [watchlist, setWatchlist] = useState<string[]>(['AVQ/USDT', 'BTC/USDT']);

  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter(s => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const filteredMarkets = markets.filter((m) => {
    const matchesSearch = m.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' ||
                       (selectedCategory === 'watchlist' && watchlist.includes(m.symbol)) ||
                       m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-cyan-400" />
            <span>Global Token Markets</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time verified market prices, 24h volume stats, and orderbook execution routes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search pair (e.g. AVQ, BTC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Pairs' },
          { id: 'watchlist', label: `Watchlist (${watchlist.length})` },
          { id: 'avq', label: 'AVQ Ecosystem' },
          { id: 'major', label: 'Major Crypto' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Market Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3.5 px-4 w-10"></th>
                <th className="py-3.5 px-4">Market Pair</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">24h Change</th>
                <th className="py-3.5 px-4 hidden md:table-cell">24h High</th>
                <th className="py-3.5 px-4 hidden md:table-cell">24h Low</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">24h Volume</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredMarkets.map((asset) => {
                const isSaved = watchlist.includes(asset.symbol);
                const isPositive = asset.change24h >= 0;

                return (
                  <tr key={asset.symbol} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 text-center">
                      <button onClick={() => toggleWatchlist(asset.symbol)} className="text-slate-500 hover:text-amber-400">
                        <Star className={`w-4 h-4 ${isSaved ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-white text-xs">
                          {asset.symbol.substring(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{asset.symbol}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{asset.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-white text-sm">
                      {asset.symbol.includes('PKR') ? `Rs ${asset.price}` : `$${asset.price.toFixed(asset.price < 1 ? 4 : 2)}`}
                    </td>

                    <td className="py-4 px-4 font-bold">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-300 hidden md:table-cell">
                      {asset.symbol.includes('PKR') ? `Rs ${asset.high24h}` : `$${asset.high24h}`}
                    </td>

                    <td className="py-4 px-4 text-slate-300 hidden md:table-cell">
                      {asset.symbol.includes('PKR') ? `Rs ${asset.low24h}` : `$${asset.low24h}`}
                    </td>

                    <td className="py-4 px-4 text-slate-400 hidden lg:table-cell">
                      ${asset.volume24h.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setActiveTab('trade')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
