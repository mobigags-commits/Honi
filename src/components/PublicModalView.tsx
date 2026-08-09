import React from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, Lock } from 'lucide-react';

interface PublicModalViewProps {
  isOpen: boolean;
  title: string;
  contentType: string;
  onClose: () => void;
}

export const PublicModalView: React.FC<PublicModalViewProps> = ({ isOpen, title, contentType, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-mono">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-4 font-sans">
          {contentType === 'terms' && (
            <>
              <p>Welcome to AVERIQ (https://averiq.global). By registering an account or participating in the AVQ ecosystem, you agree to these Terms of Service.</p>
              <h4 className="font-bold text-white text-sm">1. Account Eligibility & Verification</h4>
              <p>Users must comply with regional age and compliance requirements. One person is permitted one account. Multi-accounting or automated farming will lead to immediate suspension.</p>
              <h4 className="font-bold text-white text-sm">2. Points & AVQ Token Conversion</h4>
              <p>Ledger points represent platform engagement rewards and carry no guaranteed monetary value until verified and converted via server-side rules. All conversions are final.</p>
            </>
          )}

          {contentType === 'privacy' && (
            <>
              <p>AVERIQ respects your privacy. We collect minimal telemetry data required to authenticate your session, protect your wallet assets, and verify cash-out requests.</p>
              <h4 className="font-bold text-white text-sm">Data Protection & Cryptographic Safety</h4>
              <p>We do not store private keys, seed phrases, or payment PINs. All API requests are protected via 256-bit SSL encryption.</p>
            </>
          )}

          {contentType === 'risk' && (
            <>
              <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Digital tokens and cryptocurrency spot trading carry inherent price volatility. Never trade or invest funds you cannot afford to lose.</p>
              </div>
              <p>AVERIQ does not advertise guaranteed earnings or risk-free profits. Market prices for AVQ and major digital assets fluctuate based on market demand.</p>
            </>
          )}

          {contentType === 'cashout_terms' && (
            <>
              <p>All cash-out requests, including Easypaisa withdrawals in PKR, are processed after server-side signature validation and fraud risk analysis.</p>
              <h4 className="font-bold text-white text-sm">Withdrawal Limits & Processing Rules</h4>
              <p>Minimum withdrawal: 1,000 PKR. Maximum per transaction: 50,000 PKR. Daily limit: 250,000 PKR. Processing fees (1.5%) cover provider merchant gateway costs.</p>
            </>
          )}

          {contentType === 'easypaisa_terms' && (
            <>
              <p>AVERIQ integrates official business/merchant payment structures for PKR cash-outs in Pakistan.</p>
              <h4 className="font-bold text-white text-sm">Reconciliation & Callback Webhooks</h4>
              <p>Transfers are reconciled using HMAC SHA-256 callback signatures. No user Easypaisa PIN or OTP is ever requested or stored by the platform.</p>
            </>
          )}

          {/* Fallback general policy text */}
          {!['terms', 'privacy', 'risk', 'cashout_terms', 'easypaisa_terms'].includes(contentType) && (
            <>
              <p>This official policy document details compliance, security guidelines, and ecosystem rules governing <strong>AVERIQ</strong> and native <strong>Averiq Token (AVQ)</strong>.</p>
              <p>All transactions, quiz rewards, referral conversions, and orderbook trades are governed by server-side verification and security audits.</p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
