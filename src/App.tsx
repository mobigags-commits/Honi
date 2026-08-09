import React, { useState, useEffect } from 'react';
import { User, MarketAsset, PointsLedgerEntry, QuizCourse, Achievement, CashoutRequest, Order, CommunityPost, EasypaisaConfig } from './types';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { MarketsView } from './components/MarketsView';
import { TradeView } from './components/TradeView';
import { SwapView } from './components/SwapView';
import { AvqTokenView } from './components/AvqTokenView';
import { EarnLearnView } from './components/EarnLearnView';
import { ReferralView } from './components/ReferralView';
import { CashoutView } from './components/CashoutView';
import { WalletView } from './components/WalletView';
import { CommunityView } from './components/CommunityView';
import { AdminView } from './components/AdminView';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { PublicModalView } from './components/PublicModalView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [markets, setMarkets] = useState<MarketAsset[]>([]);
  const [ledger, setLedger] = useState<PointsLedgerEntry[]>([]);
  const [courses, setCourses] = useState<QuizCourse[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [cashouts, setCashouts] = useState<CashoutRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [easypaisaConfig, setEasypaisaConfig] = useState<EasypaisaConfig>({
    merchantId: 'AVERIQ_MERCHANT_9981',
    storeId: 'STORE_PK_01',
    isLiveConfigured: false,
    sandboxMode: true,
    dailyLimit: 250000,
    minWithdrawal: 1000,
    maxWithdrawal: 50000,
    processingFeePercent: 1.5,
  });

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [modalData, setModalData] = useState<{ isOpen: boolean; title: string; contentType: string }>({
    isOpen: false,
    title: '',
    contentType: '',
  });

  // Load initial backend state
  const loadInitialData = async () => {
    try {
      const [resUser, resMarkets, resLedger, resCashouts, resPosts, resOrders] = await Promise.all([
        fetch('/api/v1/auth/me').then(r => r.json()),
        fetch('/api/v1/markets').then(r => r.json()),
        fetch('/api/v1/points/ledger').then(r => r.json()),
        fetch('/api/v1/cashout/list').then(r => r.json()),
        fetch('/api/v1/community/posts').then(r => r.json()),
        fetch('/api/v1/trading/orders').then(r => r.json()),
      ]);

      if (resUser.user) setUser(resUser.user);
      if (resMarkets.markets) setMarkets(resMarkets.markets);
      if (resLedger.ledger) {
        setLedger(resLedger.ledger);
        setCourses(resLedger.courses || []);
        setAchievements(resLedger.achievements || []);
      }
      if (resCashouts.cashouts) {
        setCashouts(resCashouts.cashouts);
        if (resCashouts.easypaisaConfig) setEasypaisaConfig(resCashouts.easypaisaConfig);
      }
      if (resPosts.posts) setCommunityPosts(resPosts.posts);
      if (resOrders.orders) setOrders(resOrders.orders);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleUpdateUser = async (updatedFields: Partial<User>) => {
    try {
      const res = await fetch('/api/v1/auth/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaimDaily = async () => {
    try {
      const res = await fetch('/api/v1/points/claim-daily', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      loadInitialData();
    } catch (err) {
      alert('Claim daily failed');
    }
  };

  const handleConvertPoints = async (pointsToConvert: number) => {
    const res = await fetch('/api/v1/avq/convert-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pointsToConvert }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    loadInitialData();
  };

  const handlePlaceOrder = async (orderData: any) => {
    const res = await fetch('/api/v1/trading/place-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    loadInitialData();
  };

  const handleExecuteSwap = async (swapData: any) => {
    const res = await fetch('/api/v1/swap/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swapData),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  };

  const handleRequestCashout = async (cashoutData: any) => {
    const res = await fetch('/api/v1/cashout/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cashoutData),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    loadInitialData();
  };

  const handleSubmitQuiz = async (courseId: string, answers: Record<number, number>) => {
    const res = await fetch('/api/v1/points/submit-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, answers }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    loadInitialData();
    return data;
  };

  const handleCreateCommunityPost = async (postData: any) => {
    const res = await fetch('/api/v1/community/create-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    loadInitialData();
  };

  const openPublicModal = (title: string, contentType: string) => {
    setModalData({ isOpen: true, title, contentType });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping"></div>
          <span>Booting AVERIQ Platform Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiAssistant={() => setIsAiOpen(true)}
        onUpdateUser={handleUpdateUser}
      />

      {/* Main App Content View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            markets={markets}
            setActiveTab={setActiveTab}
            openAiAssistant={() => setIsAiOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            ledger={ledger}
            achievements={achievements}
            setActiveTab={setActiveTab}
            onClaimDaily={handleClaimDaily}
            onConvertPoints={handleConvertPoints}
          />
        )}

        {activeTab === 'markets' && (
          <MarketsView markets={markets} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'trade' && (
          <TradeView markets={markets} orders={orders} onPlaceOrder={handlePlaceOrder} />
        )}

        {activeTab === 'swap' && (
          <SwapView onExecuteSwap={handleExecuteSwap} />
        )}

        {activeTab === 'avq' && <AvqTokenView />}

        {activeTab === 'earn' && (
          <EarnLearnView
            courses={courses}
            achievements={achievements}
            userPoints={user.points}
            onClaimDaily={handleClaimDaily}
            onSubmitQuiz={handleSubmitQuiz}
          />
        )}

        {activeTab === 'referral' && <ReferralView user={user} />}

        {activeTab === 'cashout' && (
          <CashoutView
            cashouts={cashouts}
            easypaisaConfig={easypaisaConfig}
            userCashBalanceUsd={user.cashBalance}
            userCurrency={user.currency}
            onRequestCashout={handleRequestCashout}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletView
            user={user}
            onUpdateUser={(fields) => setUser({ ...user, ...fields })}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView posts={communityPosts} onCreatePost={handleCreateCommunityPost} />
        )}

        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Slide-over AI Assistant */}
      <AiAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Public Policy Modal */}
      <PublicModalView
        isOpen={modalData.isOpen}
        title={modalData.title}
        contentType={modalData.contentType}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
      />

      {/* Footer */}
      <Footer onOpenModal={openPublicModal} setActiveTab={setActiveTab} />
    </div>
  );
}
