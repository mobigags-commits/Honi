import React, { useState } from 'react';
import { User } from '../types';
import { Wallet, ShieldCheck, ArrowUpRight, ArrowDownLeft, Lock, Zap, Check, Copy } from 'lucide-react';

interface WalletViewProps {
  user: User;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ user, onUpdateUser }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const walletAddr = user.connectedWalletAddress || '0x71a2B81F943C3A29B0D9802422e1a3848bA95a7C';

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      onUpdateUser({
        connectedWalletAddress: '0x71a2B81F943C3A29B0D9802422e1a3848bA95a7C',
      });
      setIsConnecting(false);
    }, 1000);
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(walletAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Web3 Wallet Connector</span>
          </div>
          <h1 className="text-3xl font-black text-white">Non-Custodial Wallet Hub</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Connect EVM compatible external wallets (MetaMask, WalletConnect) to view on-chain AVQ balances.
          </p>
        </div>

        <button
          onClick={handleConnectWallet}
          disabled={isConnecting}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all font-mono"
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnecting ? 'Connecting Provider...' : user.connectedWalletAddress ? 'Wallet Connected ✓' : 'Connect Web3 Wallet'}</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
        <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Strict Security Protocol:</strong> AVERIQ platform will NEVER request your wallet seed phrase, private key, or payment PIN. Never share confidential security credentials with anyone claiming to be platform support.
        </p>
      </div>

      {/* Wallet Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Connected Wallet Address</h3>
            <button onClick={copyAddr} className="text-xs text-cyan-400 font-mono hover:underline flex items-center gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{walletAddr.substring(0, 6)}...{walletAddr.substring(38)}</span>
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  AVQ
                </div>
                <div>
                  <div className="font-bold text-white">Averiq Token</div>
                  <div className="text-[10px] text-slate-400">On-Chain EVM Balance</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-cyan-300 text-sm">{user.onChainAvqBalance.toFixed(2)} AVQ</div>
                <div className="text-[10px] text-slate-400">${(user.onChainAvqBalance * 0.854).toFixed(2)} USD</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  ETH
                </div>
                <div>
                  <div className="font-bold text-white">Ethereum</div>
                  <div className="text-[10px] text-slate-400">Gas & Network Asset</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-200 text-sm">0.425 ETH</div>
                <div className="text-[10px] text-slate-400">$1,453.71 USD</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  USDT
                </div>
                <div>
                  <div className="font-bold text-white">Tether USD</div>
                  <div className="text-[10px] text-slate-400">ERC-20 Stablecoin</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400 text-sm">250.00 USDT</div>
                <div className="text-[10px] text-slate-400">$250.00 USD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Receive QR Box */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-white rounded-2xl shadow-xl">
            <div className="w-40 h-40 bg-slate-900 rounded-xl flex items-center justify-center text-cyan-400 font-mono text-xs p-2">
              [ Deposit QR Code Matrix ]
            </div>
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div className="text-slate-200 font-bold">Receive AVQ & ERC20 Assets</div>
            <div className="text-[11px] text-slate-400 max-w-sm">{walletAddr}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
