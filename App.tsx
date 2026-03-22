
import React, { useState, useEffect } from 'react';
import ProfileHeader from './components/ProfileHeader';
import Navigation from './components/Navigation';
import PhotoGrid from './components/PhotoGrid';
import VideoGallery from './components/VideoGallery';
import Feed from './components/Feed';
import LiveSection from './components/LiveSection';
import ExclusiveLeakPage from './components/ExclusiveLeakPage';
import SubmundoVazado from './components/SubmundoVazado';
import LeakAdCard from './components/LeakAdCard';
import PaymentModal from './components/PaymentModal';
import Stories from './components/Stories';
import { TabType, CreatorProfile } from './types';

const VIP_STORAGE_KEY = 'sofia_vip_access';

/**
 * Verifica se o usuário é VIP usando localStorage.
 * Salva um token com timestamp para validação.
 */
const checkVipStatus = (): boolean => {
  try {
    const stored = localStorage.getItem(VIP_STORAGE_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    // Verifica se tem o token válido
    if (parsed && parsed.active === true && parsed.token) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const activateVip = (): void => {
  const vipData = {
    active: true,
    token: `vip_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
    activatedAt: new Date().toISOString()
  };
  localStorage.setItem(VIP_STORAGE_KEY, JSON.stringify(vipData));
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [isVip, setIsVip] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLeakPortal, setShowLeakPortal] = useState(false);
  const [directAccessId, setDirectAccessId] = useState<string | null>(null);

  // Verifica VIP no localStorage ao carregar
  useEffect(() => {
    const vipStatus = checkVipStatus();
    setIsVip(vipStatus);
  }, []);

  // Verifica acesso direto via URL (?access=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessKey = params.get('access');

    if (accessKey) {
      // Valida o ID de acesso (verifica se já está salvo localmente)
      const storedAccess = localStorage.getItem(`access_${accessKey}`);
      if (storedAccess) {
        setDirectAccessId(accessKey);
      } else {
        // Limpa a URL se o ID for inválido
        window.history.pushState({}, '', window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (showLeakPortal || directAccessId) {
      document.title = "SISTEMA_VAZADOS_ROOT";
    } else {
      document.title = "Sofia Oliveira | Perfil VIP";
    }
  }, [showLeakPortal, directAccessId]);

  const handleVipSuccess = () => {
    activateVip();
    setIsVip(true);
  };

  const profileData: CreatorProfile = {
    name: "Sofia Oliveira",
    handle: "sofia_vip",
    bio: "Seja bem-vindo ao meu lado mais íntimo. Aqui não existem tabus. 🔥 Conteúdo exclusivo, fetiches e bastidores liberados para você, meu assinante VIP.",
    age: 18,
    subscribers: "158.9k",
    location: "Rio de Janeiro, BR",
    tags: ["Amador", "Pés", "POV", "Sereia", "Caseiro"],
    avatarUrl: "https://secreto.meuprivacy.digital/acesso/foto22.jpg",
    bannerUrl: "https://secreto.meuprivacy.digital/acesso/foto5.jpg",
    socials: { instagram: "#", telegram: "#", twitter: "#" }
  };

  if (directAccessId) {
    return <SubmundoVazado accessId={directAccessId} onBack={() => {
      setDirectAccessId(null);
      window.history.pushState({}, '', window.location.pathname);
    }} />;
  }

  if (showLeakPortal) {
    return <ExclusiveLeakPage onBack={() => setShowLeakPortal(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'photos': return <PhotoGrid onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
      case 'videos': return <VideoGallery onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
      case 'live': return <LiveSection />;
      case 'feed':
      default: return <Feed onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-10 relative select-none">
      <ProfileHeader 
        profile={profileData} 
        isVip={isVip}
        onPurchase={() => setShowPaymentModal(true)}
      />

      <Stories isVip={isVip} onOpenSubscription={() => setShowPaymentModal(true)} />

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handleVipSuccess}
      />

      <Navigation 
        activeTab={activeTab} 
        setActiveTab={(tab: TabType | 'vazados') => {
          if (tab === 'vazados') {
            setShowLeakPortal(true);
          } else {
            setActiveTab(tab as TabType);
          }
        }} 
      />

      <main className="container mx-auto px-4 py-8 animate-fade-in-up">
        {renderContent()}
      </main>

      <LeakAdCard onClick={() => setShowLeakPortal(true)} />

      <footer className="py-12 text-center bg-zinc-950 text-zinc-700 text-xs border-t border-zinc-900 mt-10">
        <div className="px-4">
          <p className="font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} {profileData.name}. Conteúdo Privado.</p>
          <p className="mt-2 text-[10px] opacity-40 uppercase tracking-[3px]">Acesso exclusivo para membros autorizados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
