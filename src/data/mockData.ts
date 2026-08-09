import { MarketAsset, QuizCourse, Achievement, CommunityPost, User, CashoutRequest, PointsLedgerEntry } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_882915',
  username: 'alex_averiq',
  displayName: 'Alex Rivers',
  email: 'alex@averiq.global',
  role: 'super_admin',
  country: 'Pakistan',
  currency: 'PKR',
  language: 'en',
  level: 4,
  points: 2450,
  avqBalance: 380.50,
  onChainAvqBalance: 120.00,
  cashBalance: 48.50, // USD
  referralCode: 'AVERIQ-8829',
  referralCount: 12,
  isVerified: true,
  is2FA: true,
  riskLevel: 'low',
  connectedWalletAddress: '0x71a2B81F943C3A29B0D9802422e1a3848bA95a7C',
  createdAt: '2026-01-15T08:30:00Z',
};

export const INITIAL_MARKETS: MarketAsset[] = [
  {
    symbol: 'AVQ/USDT',
    name: 'Averiq Token',
    price: 0.8540,
    change24h: 12.45,
    high24h: 0.9200,
    low24h: 0.7420,
    volume24h: 1450200,
    category: 'avq',
    chartData: [
      { time: '04:00', open: 0.75, high: 0.78, low: 0.74, close: 0.77, volume: 120000 },
      { time: '08:00', open: 0.77, high: 0.82, low: 0.76, close: 0.81, volume: 230000 },
      { time: '12:00', open: 0.81, high: 0.86, low: 0.80, close: 0.84, volume: 310000 },
      { time: '16:00', open: 0.84, high: 0.89, low: 0.82, close: 0.88, volume: 450000 },
      { time: '20:00', open: 0.88, high: 0.92, low: 0.85, close: 0.854, volume: 340200 },
    ],
    isWatchlisted: true,
  },
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    price: 94850.00,
    change24h: 3.12,
    high24h: 96200.00,
    low24h: 91400.00,
    volume24h: 425000000,
    category: 'major',
    chartData: [
      { time: '04:00', open: 91800, high: 93100, low: 91400, close: 92800, volume: 85000000 },
      { time: '08:00', open: 92800, high: 94500, low: 92500, close: 94100, volume: 110000000 },
      { time: '12:00', open: 94100, high: 95800, low: 93800, close: 95200, volume: 125000000 },
      { time: '16:00', open: 95200, high: 96200, low: 94200, close: 94850, volume: 105000000 },
    ],
    isWatchlisted: true,
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    price: 3420.50,
    change24h: -1.25,
    high24h: 3510.00,
    low24h: 3380.00,
    volume24h: 185000000,
    category: 'major',
    chartData: [
      { time: '04:00', open: 3480, high: 3510, low: 3450, close: 3490, volume: 40000000 },
      { time: '08:00', open: 3490, high: 3500, low: 3410, close: 3430, volume: 55000000 },
      { time: '12:00', open: 3430, high: 3460, low: 3380, close: 3410, volume: 48000000 },
      { time: '16:00', open: 3410, high: 3440, low: 3400, close: 3420.5, volume: 42000000 },
    ],
    isWatchlisted: false,
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    price: 188.40,
    change24h: 5.80,
    high24h: 192.00,
    low24h: 176.50,
    volume24h: 94000000,
    category: 'major',
    chartData: [
      { time: '04:00', open: 177, high: 181, low: 176.5, close: 180, volume: 20000000 },
      { time: '08:00', open: 180, high: 186, low: 179, close: 185, volume: 28000000 },
      { time: '12:00', open: 185, high: 192, low: 184, close: 188.4, volume: 46000000 },
    ],
    isWatchlisted: true,
  },
  {
    symbol: 'AVQ/PKR',
    name: 'Averiq / PKR',
    price: 238.25,
    change24h: 12.10,
    high24h: 256.00,
    low24h: 207.00,
    volume24h: 8450000,
    category: 'avq',
    chartData: [
      { time: '04:00', open: 210, high: 220, low: 207, close: 218, volume: 1500000 },
      { time: '08:00', open: 218, high: 235, low: 215, close: 230, volume: 3200000 },
      { time: '12:00', open: 230, high: 256, low: 228, close: 238.25, volume: 3750000 },
    ],
    isWatchlisted: false,
  },
];

export const INITIAL_LEDGER: PointsLedgerEntry[] = [
  {
    id: 'led_101',
    userId: 'usr_882915',
    activity: 'Daily Login Reward',
    points: 50,
    status: 'approved',
    timestamp: '2026-08-07T08:00:00Z',
    source: 'system_daily_login',
    referenceId: 'ref_dl_20260807',
  },
  {
    id: 'led_102',
    userId: 'usr_882915',
    activity: 'Completed Quiz: Blockchain Fundamentals',
    points: 200,
    status: 'approved',
    timestamp: '2026-08-06T14:20:00Z',
    source: 'quiz_engine',
    referenceId: 'quiz_block_101',
  },
  {
    id: 'led_103',
    userId: 'usr_882915',
    activity: 'Successful Referral Bonus (User: @hassan_k)',
    points: 500,
    status: 'approved',
    timestamp: '2026-08-05T19:10:00Z',
    source: 'referral_system',
    referenceId: 'ref_usr_hassan',
  },
  {
    id: 'led_104',
    userId: 'usr_882915',
    activity: 'AVQ Token Reward Conversion (-1000 pts -> 50 AVQ)',
    points: -1000,
    status: 'redeemed',
    timestamp: '2026-08-04T11:45:00Z',
    source: 'avq_converter',
    referenceId: 'conv_8829_01',
  },
];

export const INITIAL_COURSES: QuizCourse[] = [
  {
    id: 'course_101',
    title: 'Blockchain & Web3 Essentials',
    category: 'Beginner',
    description: 'Learn how decentralized ledgers, cryptography, and smart contracts shape the future of global finance.',
    rewardPoints: 200,
    completed: true,
    questions: [
      {
        id: 1,
        question: 'What is the primary feature of a decentralized blockchain ledger?',
        options: [
          'Controlled by a single central bank',
          'Distributed across multiple node validators without single failure point',
          'Only accessible via paid proprietary browser plugins',
          'Clears transactions once every 30 days'
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What ticker symbol uniquely identifies the native Averiq ecosystem token?',
        options: ['AVR', 'AVQ', 'ZT', 'AQK'],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: 'Why should users never share their wallet seed phrase or private key?',
        options: [
          'It changes your profile avatar automatically',
          'Private keys grant total irreversible control over on-chain assets',
          'It incurs a transaction processing fee',
          'It temporarily logs you out'
        ],
        correctAnswer: 1,
      }
    ]
  },
  {
    id: 'course_102',
    title: 'AVQ Tokenomics & Staking',
    category: 'Intermediate',
    description: 'Master the AVQ utility framework, ecosystem distribution schedule, and reward conversion rules.',
    rewardPoints: 350,
    completed: false,
    questions: [
      {
        id: 1,
        question: 'What is the maximum total supply cap of Averiq Token (AVQ)?',
        options: ['100,000,000 AVQ', '1,000,000,000 AVQ', 'Unlimited mintable', '500,000 AVQ'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'How are internal points converted into AVQ rewards?',
        options: [
          'By submitting an automated client override request',
          'Through a verified server-side anti-fraud check and ledger rule',
          'By sending funds to an unverified third party',
          'Points cannot be converted'
        ],
        correctAnswer: 1,
      }
    ]
  },
  {
    id: 'course_103',
    title: 'Trading Risk Management & Anti-Fraud Safety',
    category: 'Advanced',
    description: 'Recognize market volatility, order types, slippage, and protection against scam phishing.',
    rewardPoints: 500,
    completed: false,
    questions: [
      {
        id: 1,
        question: 'What is the function of a Limit Order on AVERIQ Trading Platform?',
        options: [
          'Executes immediately at whatever price is available',
          'Executes buy or sell only when market reaches your specified price or better',
          'Cancels your account if market drops',
          'Guarantees instant profit on execution'
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'If a message claims to be support asking for your Easypaisa PIN or OTP, what should you do?',
        options: [
          'Provide it immediately to unlock rewards',
          'Never share PIN or OTP — report the phishing attempt immediately',
          'Post it on the community feed',
          'Pay a small verification fee'
        ],
        correctAnswer: 1,
      }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_01',
    code: 'FIRST_LOGIN',
    name: 'Ecosystem Pioneer',
    description: 'Created an official AVERIQ account and verified email credential.',
    badgeIcon: 'ShieldCheck',
    rewardPoints: 100,
    unlocked: true,
    unlockedAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'ach_02',
    code: 'QUIZ_MASTER',
    name: 'Knowledge Architect',
    description: 'Passed 1 or more Web3 & AVQ certification quizzes with 100% score.',
    badgeIcon: 'GraduationCap',
    rewardPoints: 200,
    unlocked: true,
    unlockedAt: '2026-08-06T14:20:00Z',
  },
  {
    id: 'ach_03',
    code: 'REFERRAL_HERO',
    name: 'Global Ambassador',
    description: 'Successfully invited 10 or more verified active members using your referral link.',
    badgeIcon: 'Users',
    rewardPoints: 500,
    unlocked: true,
    unlockedAt: '2026-08-05T19:10:00Z',
  },
  {
    id: 'ach_04',
    code: 'WALLET_CONNECTED',
    name: 'Web3 Gateway',
    description: 'Connected a non-custodial external Web3 wallet to AVERIQ.',
    badgeIcon: 'Wallet',
    rewardPoints: 150,
    unlocked: true,
    unlockedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'ach_05',
    code: 'FIRST_CASHOUT',
    name: 'Verified Cashout Pioneer',
    description: 'Completed first verified Easypaisa or Crypto reward withdrawal.',
    badgeIcon: 'Banknote',
    rewardPoints: 300,
    unlocked: false,
  }
];

export const INITIAL_CASHOUTS: CashoutRequest[] = [
  {
    id: 'cash_901',
    userId: 'usr_882915',
    userName: 'Alex Rivers',
    amount: 5000,
    currency: 'PKR',
    usdEquivalent: 18.00,
    method: 'easypaisa',
    destinationAccount: '03001234567',
    status: 'completed',
    easypaisaRef: 'EP-20260802-99812',
    createdAt: '2026-08-02T10:15:00Z',
    updatedAt: '2026-08-02T10:22:00Z',
    riskNote: 'Verified merchant batch reconciliation complete.'
  },
  {
    id: 'cash_902',
    userId: 'usr_882915',
    userName: 'Alex Rivers',
    amount: 10000,
    currency: 'PKR',
    usdEquivalent: 36.00,
    method: 'easypaisa',
    destinationAccount: '03001234567',
    status: 'processing',
    easypaisaRef: 'EP-SANDBOX-8891',
    createdAt: '2026-08-07T09:10:00Z',
    updatedAt: '2026-08-07T09:10:00Z',
    riskNote: 'Sandbox API signature validated. Pending admin authorization flag.'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_201',
    authorId: 'usr_7712',
    authorName: 'Hassan K.',
    authorCountry: 'Pakistan',
    title: 'AVQ Token Ecosystem Growth & Staking Pool Mechanics',
    content: 'Just completed the AVQ Tokenomics quiz! Staking rewards and conversion rules look solid. Glad to see server-side validation and anti-fraud protections in place.',
    topic: 'AVQ Ecosystem',
    likes: 24,
    isLiked: false,
    commentsCount: 3,
    comments: [
      { id: 'c1', authorName: 'Elena Rostova', text: 'Great breakdown! The 1B AVQ fixed total supply cap provides strong transparency.', createdAt: '2h ago' },
      { id: 'c2', authorName: 'Alex Rivers', text: 'Server-side ledger rules guarantee zero points manipulation.', createdAt: '1h ago' }
    ],
    createdAt: '3 hours ago',
    reported: false,
    aiRiskScore: 0.02
  },
  {
    id: 'post_202',
    authorId: 'usr_9021',
    authorName: 'Mariam Tariq',
    authorCountry: 'United Arab Emirates',
    title: 'Easypaisa Cash-Out Sandbox & Regional Payment Verification',
    content: 'Tested the Easypaisa Sandbox workflow. Reconciling payment reference IDs directly in the ledger before marking payout status prevents duplicate payouts.',
    topic: 'Cash-out & Local Gateways',
    likes: 41,
    isLiked: true,
    commentsCount: 2,
    comments: [
      { id: 'c3', authorName: 'Tariq Al-Mansoor', text: 'Works smooth in Pakistan region with PKR currency toggle!', createdAt: '30m ago' }
    ],
    createdAt: '5 hours ago',
    reported: false,
    aiRiskScore: 0.01
  }
];
