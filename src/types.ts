export type AccountRole = 'user' | 'super_admin' | 'moderator';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: AccountRole;
  country: string;
  currency: string;
  language: string;
  level: number;
  points: number;
  avqBalance: number;
  onChainAvqBalance: number;
  cashBalance: number; // in USD equivalent
  referralCode: string;
  referralCount: number;
  isVerified: boolean;
  is2FA: boolean;
  riskLevel: RiskLevel;
  connectedWalletAddress?: string;
  createdAt: string;
}

export type LedgerStatus = 'pending' | 'approved' | 'rejected' | 'reversed' | 'redeemed';

export interface PointsLedgerEntry {
  id: string;
  userId: string;
  activity: string;
  points: number;
  status: LedgerStatus;
  timestamp: string;
  source: string;
  referenceId: string;
}

export interface AVQTransaction {
  id: string;
  userId: string;
  type: 'reward_conversion' | 'swap_in' | 'swap_out' | 'transfer_out' | 'staking_reward';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  timestamp: string;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  category: 'major' | 'avq' | 'defi' | 'stablecoin';
  chartData: CandleData[];
  isWatchlisted?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price: number;
  amount: number;
  filled: number;
  status: 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'failed';
  timestamp: string;
}

export type CashoutStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';

export interface CashoutRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number; // in preferred currency
  currency: string;
  usdEquivalent: number;
  method: 'easypaisa' | 'bank_wire' | 'crypto_usdt';
  destinationAccount: string;
  status: CashoutStatus;
  easypaisaRef?: string;
  createdAt: string;
  updatedAt: string;
  riskNote?: string;
}

export interface EasypaisaConfig {
  merchantId: string;
  storeId: string;
  isLiveConfigured: boolean;
  sandboxMode: boolean;
  dailyLimit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  processingFeePercent: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  rewardPoints: number;
  questions: QuizQuestion[];
  completed?: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  badgeIcon: string;
  rewardPoints: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorCountry: string;
  title: string;
  content: string;
  topic: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments?: { id: string; authorName: string; text: string; createdAt: string }[];
  createdAt: string;
  reported: boolean;
  aiRiskScore: number;
}

export interface EmergencyControls {
  maintenanceMode: boolean;
  pauseRewards: boolean;
  pauseCashouts: boolean;
  pauseSwaps: boolean;
  pauseTrading: boolean;
}

export interface SystemSettings {
  emergency: EmergencyControls;
  avqConversionRate: number; // points required per 1 AVQ
  referralBonusPoints: number;
  dailyLoginPoints: number;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  createdAt: string;
  reply?: string;
}
