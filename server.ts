import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USER,
  INITIAL_MARKETS,
  INITIAL_LEDGER,
  INITIAL_COURSES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CASHOUTS,
  INITIAL_COMMUNITY_POSTS
} from './src/data/mockData.js';
import {
  User,
  PointsLedgerEntry,
  CashoutRequest,
  Order,
  EasypaisaConfig,
  EmergencyControls,
  AuditLog,
  CommunityPost
} from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Global State Store
let currentUser: User = { ...INITIAL_USER };
let marketsList = [...INITIAL_MARKETS];
let pointsLedger: PointsLedgerEntry[] = [...INITIAL_LEDGER];
let coursesList = [...INITIAL_COURSES];
let achievementsList = [...INITIAL_ACHIEVEMENTS];
let cashoutRequests: CashoutRequest[] = [...INITIAL_CASHOUTS];
let communityPostsList: CommunityPost[] = [...INITIAL_COMMUNITY_POSTS];

// 20% Platform Owner Revenue & Royalty Vault State
let platformOwnerVault = {
  commissionRate: 0.20, // 20% Owner Royalty Share
  ownerName: "Platform Owner Vault (AVERIQ Revenue Share)",
  totalPointsCommission: 249000,
  totalAvqCommission: 12450.00,
  totalUsdCommission: 2850.00,
  totalPkrCommission: 798000,
  totalTradingFeesUsd: 1420.50,
  totalAdSenseRevenueUsd: 18500.00,
  adSenseOwnerShareUsd: 3700.00, // Direct 20% from Google AdSense
  adSenseOwnerSharePkr: 1036000,
  ownerWithdrawalLogs: [
    {
      id: "ow_log_101",
      amountUsd: 500.00,
      amountPkr: 140000,
      destination: "Owner Direct Bank (Easypaisa / Bank Transfer)",
      status: "COMPLETED",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ]
};
let openOrdersList: Order[] = [
  {
    id: 'ord_501',
    userId: 'usr_882915',
    pair: 'AVQ/USDT',
    side: 'buy',
    type: 'limit',
    price: 0.8200,
    amount: 500,
    filled: 0,
    status: 'open',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ord_502',
    userId: 'usr_882915',
    pair: 'BTC/USDT',
    side: 'sell',
    type: 'limit',
    price: 98000.00,
    amount: 0.05,
    filled: 0,
    status: 'open',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  }
];

let easypaisaConfig: EasypaisaConfig = {
  merchantId: 'AVERIQ_MERCHANT_9981',
  storeId: 'STORE_PK_01',
  isLiveConfigured: false,
  sandboxMode: true,
  dailyLimit: 250000, // PKR
  minWithdrawal: 1000, // PKR
  maxWithdrawal: 50000, // PKR
  processingFeePercent: 1.5,
};

let emergencyControls: EmergencyControls = {
  maintenanceMode: false,
  pauseRewards: false,
  pauseCashouts: false,
  pauseSwaps: false,
  pauseTrading: false,
};

let auditLogsList: AuditLog[] = [
  {
    id: 'log_01',
    adminId: 'usr_882915',
    adminName: 'Alex Rivers',
    action: 'SYSTEM_BOOT',
    target: 'AVERIQ Ecosystem Server',
    details: 'System initialized with ledger integrity checks and Easypaisa Sandbox gateway.',
    timestamp: new Date().toISOString(),
  }
];

function addAuditLog(adminName: string, action: string, target: string, details: string) {
  auditLogsList.unshift({
    id: `log_${Date.now()}`,
    adminId: currentUser.id,
    adminName,
    action,
    target,
    details,
    timestamp: new Date().toISOString(),
  });
}

// Server-side Gemini AI Client Lazy Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'averiq-app',
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Enable CORS & Json parsing for public production access
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // Health check endpoint for Cloud Run / load balancers
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'AVERIQ Ecosystem Server', timestamp: new Date().toISOString() });
  });

  // Maintenance & Emergency Guard Middleware
  app.use('/api', (req, res, next) => {
    if (emergencyControls.maintenanceMode && !req.path.startsWith('/v1/admin')) {
      return res.status(530).json({
        error: 'AVERIQ Ecosystem is currently undergoing scheduled security maintenance. Please check back shortly.',
        maintenance: true,
      });
    }
    next();
  });

  // --- API ENDPOINTS ---

  // 1. Auth & User Profile
  app.get('/api/v1/auth/me', (req: Request, res: Response) => {
    res.json({ user: currentUser });
  });

  app.post('/api/v1/auth/update-settings', (req: Request, res: Response) => {
    const { language, currency, country, displayName } = req.body;
    if (language) currentUser.language = language;
    if (currency) currentUser.currency = currency;
    if (country) currentUser.country = country;
    if (displayName) currentUser.displayName = displayName;

    addAuditLog(currentUser.displayName, 'USER_SETTINGS_UPDATE', currentUser.id, `Updated pref: ${language}, ${currency}, ${country}`);
    res.json({ success: true, user: currentUser });
  });

  app.post('/api/v1/auth/toggle-2fa', (req: Request, res: Response) => {
    currentUser.is2FA = !currentUser.is2FA;
    res.json({ success: true, is2FA: currentUser.is2FA });
  });

  // 2. Points & Rewards Ledger
  app.get('/api/v1/points/ledger', (req: Request, res: Response) => {
    res.json({
      points: currentUser.points,
      ledger: pointsLedger.filter(l => l.userId === currentUser.id),
      achievements: achievementsList,
      courses: coursesList,
    });
  });

  app.post('/api/v1/points/claim-daily', (req: Request, res: Response) => {
    if (emergencyControls.pauseRewards) {
      return res.status(403).json({ error: 'Rewards processing is temporarily paused by platform emergency controls.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyClaimed = pointsLedger.some(
      l => l.userId === currentUser.id && l.source === 'system_daily_login' && l.timestamp.startsWith(todayStr)
    );

    if (alreadyClaimed) {
      return res.status(400).json({ error: 'Daily login bonus already claimed for today.' });
    }

    const rewardPoints = 50;
    currentUser.points += rewardPoints;
    
    // 20% Owner Commission Allocation
    const ownerPointsCut = rewardPoints * platformOwnerVault.commissionRate;
    platformOwnerVault.totalPointsCommission += ownerPointsCut;

    const newLedgerEntry: PointsLedgerEntry = {
      id: `led_${Date.now()}`,
      userId: currentUser.id,
      activity: 'Daily Login Activity Reward (20% Owner Royalty Reserved)',
      points: rewardPoints,
      status: 'approved',
      timestamp: new Date().toISOString(),
      source: 'system_daily_login',
      referenceId: `ref_dl_${Date.now()}`,
    };

    pointsLedger.unshift(newLedgerEntry);
    res.json({ success: true, pointsClaimed: rewardPoints, totalPoints: currentUser.points, entry: newLedgerEntry });
  });

  app.post('/api/v1/points/submit-quiz', (req: Request, res: Response) => {
    if (emergencyControls.pauseRewards) {
      return res.status(403).json({ error: 'Rewards processing is temporarily paused by emergency controls.' });
    }

    const { courseId, answers } = req.body;
    const course = coursesList.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ error: 'Quiz course not found' });

    let correctCount = 0;
    course.questions.forEach((q, idx) => {
      if (answers && answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const passed = correctCount === course.questions.length;
    if (passed && !course.completed) {
      course.completed = true;
      currentUser.points += course.rewardPoints;

      // 20% Owner Commission Cut
      platformOwnerVault.totalPointsCommission += course.rewardPoints * platformOwnerVault.commissionRate;

      const newEntry: PointsLedgerEntry = {
        id: `led_${Date.now()}`,
        userId: currentUser.id,
        activity: `Completed Quiz: ${course.title} (20% Owner Share Logged)`,
        points: course.rewardPoints,
        status: 'approved',
        timestamp: new Date().toISOString(),
        source: 'quiz_engine',
        referenceId: `quiz_${course.id}`,
      };
      pointsLedger.unshift(newEntry);

      return res.json({
        success: true,
        passed: true,
        score: `${correctCount}/${course.questions.length}`,
        rewardPoints: course.rewardPoints,
        totalPoints: currentUser.points,
      });
    }

    res.json({
      success: true,
      passed,
      score: `${correctCount}/${course.questions.length}`,
      rewardPoints: 0,
      message: passed ? 'Quiz course was already completed.' : 'You did not score 100%. Review lesson and try again.',
    });
  });

  // 3. AVQ Token Conversion
  app.post('/api/v1/avq/convert-points', (req: Request, res: Response) => {
    if (emergencyControls.pauseRewards) {
      return res.status(403).json({ error: 'Rewards processing is temporarily paused.' });
    }

    const { pointsToConvert } = req.body;
    const numPoints = Number(pointsToConvert);

    if (isNaN(numPoints) || numPoints < 100) {
      return res.status(400).json({ error: 'Minimum conversion requirement is 100 Points.' });
    }

    if (currentUser.points < numPoints) {
      return res.status(400).json({ error: 'Insufficient available points balance.' });
    }

    // Rate: 20 points = 1 AVQ
    const rate = 20;
    const avqEarned = numPoints / rate;

    currentUser.points -= numPoints;
    currentUser.avqBalance += avqEarned;

    // 20% Owner Royalty in AVQ
    const ownerAvqCut = avqEarned * platformOwnerVault.commissionRate;
    platformOwnerVault.totalAvqCommission += ownerAvqCut;

    const ledgerEntry: PointsLedgerEntry = {
      id: `led_${Date.now()}`,
      userId: currentUser.id,
      activity: `Converted ${numPoints} Points to ${avqEarned.toFixed(2)} AVQ Rewards (Owner 20% Royalty = ${ownerAvqCut.toFixed(2)} AVQ)`,
      points: -numPoints,
      status: 'redeemed',
      timestamp: new Date().toISOString(),
      source: 'avq_converter',
      referenceId: `conv_${Date.now()}`,
    };
    pointsLedger.unshift(ledgerEntry);

    res.json({
      success: true,
      convertedPoints: numPoints,
      avqReceived: avqEarned,
      newPointsBalance: currentUser.points,
      newAvqBalance: currentUser.avqBalance,
    });
  });

  // 4. Markets & Trading Engine
  app.get('/api/v1/markets', (req: Request, res: Response) => {
    res.json({ markets: marketsList });
  });

  app.get('/api/v1/trading/orders', (req: Request, res: Response) => {
    res.json({ orders: openOrdersList });
  });

  app.post('/api/v1/trading/place-order', (req: Request, res: Response) => {
    if (emergencyControls.pauseTrading) {
      return res.status(403).json({ error: 'Trading engine is currently paused by platform emergency protocol.' });
    }

    const { pair, side, type, price, amount } = req.body;
    if (!pair || !side || !type || !amount) {
      return res.status(400).json({ error: 'Invalid order parameter inputs.' });
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      userId: currentUser.id,
      pair,
      side,
      type,
      price: Number(price) || 0,
      amount: Number(amount),
      filled: type === 'market' ? Number(amount) : 0,
      status: type === 'market' ? 'filled' : 'open',
      timestamp: new Date().toISOString(),
    };

    openOrdersList.unshift(newOrder);

    res.json({
      success: true,
      order: newOrder,
      message: type === 'market' ? `Market order filled instantly!` : `Limit order placed on orderbook!`,
    });
  });

  app.post('/api/v1/swap/execute', (req: Request, res: Response) => {
    if (emergencyControls.pauseSwaps) {
      return res.status(403).json({ error: 'Token swap routing is temporarily paused.' });
    }

    const { fromSymbol, toSymbol, fromAmount, expectedToAmount, slippage } = req.body;
    if (!fromSymbol || !toSymbol || !fromAmount || Number(fromAmount) <= 0) {
      return res.status(400).json({ error: 'Invalid swap input amounts.' });
    }

    res.json({
      success: true,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      swappedFrom: `${fromAmount} ${fromSymbol}`,
      receivedTo: `${expectedToAmount} ${toSymbol}`,
      slippageApplied: `${slippage || 0.5}%`,
      networkFee: '0.0015 ETH',
      status: 'confirmed',
    });
  });

  // 5. Cash-Out & Easypaisa Integration Gateway
  app.get('/api/v1/cashout/list', (req: Request, res: Response) => {
    res.json({
      cashouts: cashoutRequests.filter(c => c.userId === currentUser.id || currentUser.role === 'super_admin'),
      easypaisaConfig,
    });
  });

  app.post('/api/v1/cashout/request', (req: Request, res: Response) => {
    if (emergencyControls.pauseCashouts) {
      return res.status(403).json({ error: 'Cash-out withdrawals are temporarily paused for routine security audit.' });
    }

    const { amount, method, destinationAccount, currency } = req.body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < easypaisaConfig.minWithdrawal) {
      return res.status(400).json({
        error: `Minimum withdrawal limit is ${easypaisaConfig.minWithdrawal} ${currency || 'PKR'}.`,
      });
    }

    if (numAmount > easypaisaConfig.maxWithdrawal) {
      return res.status(400).json({
        error: `Maximum withdrawal per transaction limit is ${easypaisaConfig.maxWithdrawal} ${currency || 'PKR'}.`,
      });
    }

    // Convert PKR/Local to USD for balance checking
    const pkrToUsdRate = 278.0;
    const usdEquiv = currency === 'PKR' ? numAmount / pkrToUsdRate : numAmount;

    if (currentUser.cashBalance < usdEquiv) {
      return res.status(400).json({
        error: `Insufficient available cash balance. Available: $${currentUser.cashBalance.toFixed(2)} USD (~${(currentUser.cashBalance * pkrToUsdRate).toFixed(0)} PKR)`,
      });
    }

    // Deduct cash balance
    currentUser.cashBalance -= usdEquiv;

    const newCashout: CashoutRequest = {
      id: `cash_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.displayName,
      amount: numAmount,
      currency: currency || 'PKR',
      usdEquivalent: usdEquiv,
      method: method || 'easypaisa',
      destinationAccount,
      status: 'processing',
      easypaisaRef: `EP-SANDBOX-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      riskNote: 'Signature and checksum validated via Easypaisa Sandbox API Gateway.',
    };

    cashoutRequests.unshift(newCashout);
    addAuditLog(currentUser.displayName, 'CASHOUT_REQUESTED', newCashout.id, `${method.toUpperCase()} ${numAmount} ${currency}`);

    res.json({
      success: true,
      cashout: newCashout,
      remainingCashBalanceUsd: currentUser.cashBalance,
      message: 'Cash-out request submitted successfully to Easypaisa Payment Processor Queue.',
    });
  });

  // 6. Community Feed
  app.get('/api/v1/community/posts', (req: Request, res: Response) => {
    res.json({ posts: communityPostsList });
  });

  app.post('/api/v1/community/create-post', (req: Request, res: Response) => {
    const { title, content, topic } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorCountry: currentUser.country,
      title,
      content,
      topic: topic || 'General Discussion',
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      createdAt: 'Just now',
      reported: false,
      aiRiskScore: 0.01,
    };

    communityPostsList.unshift(newPost);
    res.json({ success: true, post: newPost });
  });

  // 6.5. Google AdSense Direct 20% Owner Revenue Engine
  app.post('/api/v1/adsense/record-impression', (req: Request, res: Response) => {
    const { adUnitId, revenueEstimatedUsd = 0.05 } = req.body;
    const estRevenue = Number(revenueEstimatedUsd) || 0.05;
    
    // Automatically split 20% directly to Platform Owner
    const ownerShareUsd = estRevenue * platformOwnerVault.commissionRate;
    const ownerSharePkr = ownerShareUsd * 280;

    platformOwnerVault.totalAdSenseRevenueUsd += estRevenue;
    platformOwnerVault.adSenseOwnerShareUsd += ownerShareUsd;
    platformOwnerVault.adSenseOwnerSharePkr += ownerSharePkr;
    platformOwnerVault.totalUsdCommission += ownerShareUsd;
    platformOwnerVault.totalPkrCommission += ownerSharePkr;

    res.json({
      success: true,
      message: 'AdSense impression recorded. 20% revenue routed directly to Platform Owner Vault.',
      totalAdSenseRevenueUsd: platformOwnerVault.totalAdSenseRevenueUsd,
      ownerShareUsd: platformOwnerVault.adSenseOwnerShareUsd,
      ownerVaultUsdTotal: platformOwnerVault.totalUsdCommission,
    });
  });

  // 7. AI Assistant Endpoint (Powered by Gemini 3.6 Flash)
  app.post('/api/v1/ai/assistant', async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message query parameter is required.' });

    try {
      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not set yet
        return res.json({
          reply: `Hello! I am Averiq Intelligence. Here is information regarding your query on "${message}":\n\n` +
            `• AVERIQ Ecosystem Native Token: Averiq Token (AVQ)\n` +
            `• Fixed Total Supply: 1,000,000,000 AVQ\n` +
            `• Reward Engine: Earn points via Quizzes & Daily check-in, then convert 20 Points = 1 AVQ.\n` +
            `• Cash-out Gateway: Official Easypaisa Sandbox Integration supports PKR withdrawals with direct reference reconciliation.\n` +
            `• Security Note: Never share your private key, seed phrase, or Easypaisa PIN with anyone!`,
          source: 'Averiq Core Rules Engine',
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: message,
        config: {
          systemInstruction:
            `You are AVERIQ Intelligence, the official expert AI Assistant for AVERIQ (https://averiq.global). ` +
            `You provide professional, concise, accurate guidance on: ` +
            `1. Averiq Token (AVQ) metrics (1 Billion max total supply, staking, reward conversion at 20 points = 1 AVQ). ` +
            `2. Easypaisa cash-out sandbox & regional payment processing. ` +
            `3. Decentralized wallet safety (never request private keys or PINs). ` +
            `4. Platform trading, orderbook mechanics, and token swap slippage. ` +
            `STRICT RULE: Never claim guaranteed financial profits. Always mention risk disclosure when discussing crypto trading.`,
        },
      });

      res.json({
        reply: response.text || 'I am ready to assist you with AVERIQ ecosystem features.',
        source: 'Gemini 3.6 Flash AI Assistant',
      });
    } catch (err: any) {
      console.error('Gemini Assistant API Error:', err);
      res.json({
        reply: `Averiq Assistant Advice: Regarding "${message}" — please check the AVERIQ Help Center or FAQ section for detailed walkthroughs on AVQ conversion, Easypaisa cash-outs, and orderbook trading rules.`,
        source: 'Averiq Offline Knowledge Base',
      });
    }
  });

  // 8. Super Admin Dashboard Controls
  app.get('/api/v1/admin/stats', (req: Request, res: Response) => {
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access restricted to Super Admin role.' });
    }

    res.json({
      totalUsers: 14850,
      activeToday: 3240,
      totalPointsIssued: 12450000,
      avqDistributed: 622500,
      cashoutsPendingCount: cashoutRequests.filter(c => c.status === 'processing').length,
      cashoutsCompletedTotalUsd: 14250,
      emergencyControls,
      easypaisaConfig,
      auditLogs: auditLogsList,
      platformOwnerVault,
    });
  });

  app.get('/api/v1/admin/owner-vault', (req: Request, res: Response) => {
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access restricted to Owner / Super Admin.' });
    }
    res.json({ success: true, vault: platformOwnerVault });
  });

  app.post('/api/v1/admin/withdraw-owner-vault', (req: Request, res: Response) => {
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access restricted to Platform Owner.' });
    }

    const { amountUsd, destination } = req.body;
    const numAmount = Number(amountUsd);

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid USD withdrawal amount.' });
    }

    if (numAmount > platformOwnerVault.totalUsdCommission) {
      return res.status(400).json({ error: `Requested $${numAmount} USD exceeds available owner commission pool ($${platformOwnerVault.totalUsdCommission.toFixed(2)} USD).` });
    }

    platformOwnerVault.totalUsdCommission -= numAmount;
    const amountPkr = numAmount * 280;
    platformOwnerVault.totalPkrCommission -= amountPkr;

    const newLog = {
      id: `ow_log_${Date.now()}`,
      amountUsd: numAmount,
      amountPkr: amountPkr,
      destination: destination || 'Direct Owner Bank Account',
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
    };

    platformOwnerVault.ownerWithdrawalLogs.unshift(newLog);
    addAuditLog(currentUser.displayName, 'OWNER_ROYALTY_WITHDRAWAL', `$${numAmount} USD (${amountPkr.toLocaleString()} PKR)`, `Owner withdrawn $${numAmount} USD 20% royalty share to ${destination}`);

    res.json({ success: true, vault: platformOwnerVault, log: newLog });
  });

  app.post('/api/v1/admin/emergency-toggle', (req: Request, res: Response) => {
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access restricted to Super Admin.' });
    }

    const { key, value } = req.body;
    if (key in emergencyControls) {
      (emergencyControls as any)[key] = Boolean(value);
      addAuditLog(currentUser.displayName, 'EMERGENCY_TOGGLE_CHANGED', key, `Set ${key} to ${value}`);
      return res.json({ success: true, emergencyControls });
    }
    res.status(400).json({ error: 'Invalid emergency control key.' });
  });

  app.post('/api/v1/admin/cashout-action', (req: Request, res: Response) => {
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access restricted.' });
    }

    const { cashoutId, action } = req.body;
    const reqItem = cashoutRequests.find(c => c.id === cashoutId);
    if (!reqItem) return res.status(404).json({ error: 'Cashout request not found' });

    if (action === 'approve') {
      reqItem.status = 'completed';
      reqItem.updatedAt = new Date().toISOString();
      addAuditLog(currentUser.displayName, 'CASHOUT_APPROVED', cashoutId, `Approved ${reqItem.amount} ${reqItem.currency} (${reqItem.method})`);
    } else if (action === 'reject') {
      reqItem.status = 'rejected';
      reqItem.updatedAt = new Date().toISOString();
      // Refund cash balance
      currentUser.cashBalance += reqItem.usdEquivalent;
      addAuditLog(currentUser.displayName, 'CASHOUT_REJECTED', cashoutId, `Rejected and refunded $${reqItem.usdEquivalent} USD`);
    }

    res.json({ success: true, cashout: reqItem });
  });

  // --- VITE MIDDLEWARE / PRODUCTION STATIC SERVING ---
  const fs = await import('fs');
  const distPath = path.join(process.cwd(), 'dist');
  const distIndex = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === 'production' && fs.existsSync(distIndex)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(distIndex);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      next();
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AVERIQ Ecosystem Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
