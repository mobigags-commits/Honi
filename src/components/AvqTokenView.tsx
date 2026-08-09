import React, { useState } from 'react';
import { Zap, ShieldCheck, Code, PieChart as PieIcon, Download, Copy, Check } from 'lucide-react';

export const AvqTokenView: React.FC = () => {
  const [copiedContract, setCopiedContract] = useState(false);
  const [faucetClaimed, setFaucetClaimed] = useState(false);

  const contractAddress = '0x71a2B81F943C3A29B0D9802422e1a3848bA95a7C';

  const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Averiq Token (AVQ)
 * @notice Native ecosystem token for AVERIQ Global Platform.
 * @dev Fixed total supply cap of 1,000,000,000 AVQ. No hidden minting functions.
 */
contract AveriqToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18;

    constructor(address defaultAdmin) ERC20("Averiq Token", "AVQ") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(AUDITOR_ROLE, defaultAdmin);
        
        // Permanent genesis distribution
        _mint(defaultAdmin, MAX_SUPPLY);
    }
}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span>Ecosystem Token Specification</span>
        </div>
        <h1 className="text-3xl font-black text-white">Averiq Token (AVQ)</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          The permanent native token driving utility, liquidity, quiz rewards, and decentralized governance across the AVERIQ Global Platform.
        </p>
      </div>

      {/* Token Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Token Name</span>
          <div className="text-lg font-bold text-white">Averiq Token</div>
          <span className="text-xs text-cyan-400">Ticker: AVQ</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Fixed Total Supply</span>
          <div className="text-lg font-bold text-white">1,000,000,000</div>
          <span className="text-xs text-emerald-400">Hard Supply Cap</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Standard & Decimals</span>
          <div className="text-lg font-bold text-white">ERC-20 (18 Dec)</div>
          <span className="text-xs text-indigo-400">EVM Compatible</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Staking Pool Yield</span>
          <div className="text-lg font-bold text-emerald-400">18.5% APY</div>
          <span className="text-xs text-slate-400">Non-Custodial</span>
        </div>
      </div>

      {/* Smart Contract Inspector & Tokenomics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Token Allocation Breakdown */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            <span>Tokenomics Allocation</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            {[
              { label: 'Community Rewards & Quizzes', pct: '40%', amount: '400,000,000 AVQ', color: 'bg-cyan-500' },
              { label: 'Liquidity Pools & Treasury', pct: '25%', amount: '250,000,000 AVQ', color: 'bg-indigo-500' },
              { label: 'Development & Infrastructure', pct: '15%', amount: '150,000,000 AVQ', color: 'bg-emerald-500' },
              { label: 'Staking Rewards Reserve', pct: '10%', amount: '100,000,000 AVQ', color: 'bg-purple-500' },
              { label: 'Core Team (24m Vesting)', pct: '10%', amount: '100,000,000 AVQ', color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex justify-between items-center text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                    {item.label}
                  </span>
                  <span className="font-bold text-white">{item.pct}</span>
                </div>
                <div className="text-[10px] text-slate-500 pl-4">{item.amount}</div>
              </div>
            ))}
          </div>

          {/* Testnet Faucet Box */}
          <div className="pt-2 border-t border-slate-800">
            <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-2">
              <div className="text-xs font-bold text-cyan-300">AVQ Testnet Faucet</div>
              <p className="text-[11px] text-slate-300">
                Claim 10 Testnet AVQ tokens for sandbox smart contract testing.
              </p>
              <button
                onClick={() => setFaucetClaimed(true)}
                disabled={faucetClaimed}
                className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
              >
                {faucetClaimed ? '✓ 10 Testnet AVQ Dispatched to Wallet' : 'Request 10 Testnet AVQ'}
              </button>
            </div>
          </div>
        </div>

        {/* Solidity Smart Contract Code Viewer */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Smart Contract Inspector (Solidity 0.8.20)</span>
            </h3>

            <button
              onClick={copyAddress}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 font-mono"
            >
              {copiedContract ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{contractAddress.substring(0, 6)}...{contractAddress.substring(38)}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
            <pre>{solidityCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
