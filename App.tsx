
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

const WELCOME_SEEN_KEY = 'sofia_welcome_seen';

const VIP_STORAGE_KEY = 'sofia_segredinho_access';

// ====== SOCIAL PROOF TOAST ======
const FIRST_NAMES = ['Lucas','Pedro','João','Carlos','Bruno','Felipe','Gustavo','Rafael','Mateus','André','Daniel','Gabriel','Diego','Marcos','Thiago','Leonardo','Ricardo','Eduardo','Rodrigo','Victor'];
const ACTIONS_VIP = ['desbloqueou o Segredinho','liberou os conteúdos','virou membro especial'];
const ACTIONS_SUB = ['acessou o Submundo','liberou os Vazados','desbloqueou tudo'];

const SocialProofToast: React.FC<{ cityName: string }> = ({ cityName }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const showToast = () => {
      const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const isVip = Math.random() > 0.4;
      const action = isVip 
        ? ACTIONS_VIP[Math.floor(Math.random() * ACTIONS_VIP.length)]
        : ACTIONS_SUB[Math.floor(Math.random() * ACTIONS_SUB.length)];
      const location = cityName || 'sua região';
      const mins = Math.floor(Math.random() * 8) + 1;
      
      setMessage(`${name} de ${location} ${action}`);
      setTimeAgo(`há ${mins} min`);
      setVisible(true);
      
      setTimeout(() => setVisible(false), 4000);
    };

    // Primeiro toast após 12s
    const firstTimer = setTimeout(showToast, 12000);
    // Depois a cada 18-30s
    const interval = setInterval(showToast, Math.floor(Math.random() * 12000) + 18000);
    
    return () => { clearTimeout(firstTimer); clearInterval(interval); };
  }, [cityName]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-[80] animate-fade-in-up max-w-[280px]">
      <div className="bg-zinc-900/95 border border-zinc-700/50 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 border border-amber-500/30">
          <span className="text-base">🔥</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-bold truncate">{message}</p>
          <p className="text-zinc-500 text-[10px] font-medium">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
};

// ====== GROUP OFFER MODAL (pós-compra) ======
const GroupOfferModal: React.FC<{ isOpen: boolean; onClose: () => void; cityName: string }> = ({ isOpen, onClose, cityName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-5 text-center">
          <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">BÔNUS EXCLUSIVO</span>
          <h2 className="text-white font-black text-2xl uppercase tracking-tight mt-1">GRUPO VIP SECRETO</h2>
        </div>
        
        <div className="p-6 text-center space-y-5">
          {/* Icons */}
          <div className="flex justify-center gap-4">
            <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center border border-[#25D366]/30">
              <span className="text-2xl">💬</span>
            </div>
            <div className="w-14 h-14 bg-[#0088cc]/10 rounded-2xl flex items-center justify-center border border-[#0088cc]/30">
              <span className="text-2xl">✈️</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-black text-lg uppercase">Grupo de Mulheres Reais</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Entre no grupo com <span className="text-white font-bold">mulheres reais {cityName ? `de ${cityName}` : 'da sua região'}</span> que querem se divertir. Chamadas de vídeo, encontros e muito mais.
            </p>
          </div>

          {/* Benefícios */}
          <div className="space-y-2 text-left">
            {[
              '📱 Chamadas de vídeo com garotas reais',
              '📍 Mulheres perto de você querendo se encontrar',
              '🔥 Conteúdo novo todo dia no grupo',
              '🤫 100% anônimo e privado',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-zinc-950/50 px-4 py-2.5 rounded-xl border border-zinc-800/50">
                <span className="text-sm">{item.split(' ')[0]}</span>
                <span className="text-zinc-300 text-xs font-medium">{item.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>

          {/* Preço */}
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center justify-center gap-3">
              <span className="text-zinc-500 line-through text-sm">R$ 39,90</span>
              <span className="text-emerald-400 font-black text-3xl">R$ 14,90</span>
            </div>
            <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase">Acesso vitalício • Pagamento único</p>
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <button 
              onClick={() => { window.open('https://t.me/+exemplo', '_blank'); onClose(); }}
              className="w-full py-4 bg-[#0088cc] hover:bg-[#0077b5] text-white font-black uppercase rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              ✈️ ENTRAR VIA TELEGRAM — R$ 14,90
            </button>
            <button 
              onClick={() => { window.open('https://wa.me/5500000000000', '_blank'); onClose(); }}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              💬 ENTRAR VIA WHATSAPP — R$ 14,90
            </button>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-2 text-zinc-600 text-xs font-bold uppercase hover:text-zinc-400 transition-colors"
          >
            Não tenho interesse
          </button>
        </div>
      </div>
    </div>
  );
};

// ====== EXIT INTENT POPUP ======
const EXIT_SHOWN_KEY = 'sofia_exit_shown';

const ExitIntentPopup: React.FC<{ onSubscribe: () => void }> = ({ onSubscribe }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Já mostrou nessa sessão?
    if (sessionStorage.getItem(EXIT_SHOWN_KEY)) return;

    let lastY = 0;
    let triggered = false;

    const handleScroll = () => {
      if (triggered) return;
      const currentY = window.scrollY;
      // Detecta scroll rápido pra cima (tentando sair)
      if (lastY - currentY > 150 && currentY < 200) {
        triggered = true;
        sessionStorage.setItem(EXIT_SHOWN_KEY, '1');
        // Delay pra não ser instantâneo
        setTimeout(() => setShow(true), 300);
      }
      lastY = currentY;
    };

    // Também detecta mouse saindo da janela (desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY < 5) {
        triggered = true;
        sessionStorage.setItem(EXIT_SHOWN_KEY, '1');
        setShow(true);
      }
    };

    // Espera 15s antes de ativar detecção
    const timeout = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 15000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-zinc-900 border-2 border-amber-500/50 rounded-2xl shadow-[0_0_60px_rgba(251,191,36,0.2)] overflow-hidden">
        {/* Close */}
        <button onClick={() => setShow(false)} className="absolute top-3 right-3 z-10 text-zinc-500 hover:text-white p-1.5 bg-black/30 rounded-full">
          <span className="text-lg">✕</span>
        </button>

        {/* Imagem de fundo */}
        <div className="relative h-40 overflow-hidden">
          <img src="https://secreto.meuprivacy.digital/acesso/foto5.jpg" className="w-full h-full object-cover blur-[2px] opacity-40 scale-110" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-5xl">😏</span>
            </div>
          </div>
        </div>

        <div className="p-6 text-center space-y-4 -mt-4 relative">
          <div className="inline-flex items-center gap-2 bg-pink-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest animate-pulse">
            ⚡ ÚLTIMA CHANCE
          </div>

          <h3 className="text-white font-black text-xl uppercase tracking-tight leading-tight">
            Já vai embora? 😢<br/>
            <span className="text-pink-400">Desbloqueia meu Segredinho 😈</span>
          </h3>

          <p className="text-zinc-400 text-sm leading-relaxed">
            Meus conteúdos mais íntimos por um preço que <span className="text-white font-bold">eu nunca mais vou oferecer</span>... me ajuda a pagar minha faculdade? 🥺
          </p>

          <div className="bg-zinc-950 rounded-xl p-4 border border-pink-500/20">
            <div className="flex items-center justify-center gap-3">
              <span className="text-zinc-500 line-through text-lg">R$ 9,90</span>
              <span className="text-pink-400 font-black text-4xl">R$ 4,50</span>
            </div>
            <p className="text-pink-400/60 text-[9px] mt-1 font-bold uppercase">Oferta exclusiva de saída • Não vai aparecer de novo</p>
          </div>

          <button
            onClick={() => { setShow(false); onSubscribe(); }}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black uppercase text-sm rounded-xl shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            😈 QUERO O SEGREDINHO POR R$ 4,50
          </button>

          <button onClick={() => setShow(false)} className="text-zinc-600 text-xs font-bold uppercase hover:text-zinc-400 transition-colors">
            Não, prefiro pagar mais depois
          </button>
        </div>
      </div>
    </div>
  );
};

// ====== FAKE SOFIA CHAT ======
const CHAT_VARIATIONS = [
  [
    { delay: 0, text: "Oi amor 😏", typing: 1500 },
    { delay: 2500, text: "Gostou dos meus conteúdos? 💕", typing: 2000 },
    { delay: 5500, text: "Tenho uns vídeos BEM mais ousados guardados... 🔥", typing: 2500 },
    { delay: 9000, text: "Desbloqueia meu Segredinho que eu te mostro TUDO... sem tabu nenhum 😈💦", typing: 3000 },
    { delay: 13500, text: "É só R$ 4,50... me ajuda a pagar a faculdade 🥺", typing: 1500 },
  ],
  [
    { delay: 0, text: "Oiii 🥰", typing: 1200 },
    { delay: 2000, text: "Que bom que você veio ver meus conteúdos...", typing: 2000 },
    { delay: 5000, text: "Mas o melhor mesmo eu escondi no meu Segredinho 😈", typing: 2500 },
    { delay: 8500, text: "São coisas que eu tenho muita vergonha de mostrar pra qualquer um 🙈💦", typing: 3000 },
    { delay: 12500, text: "Desbloqueia vai... é R$ 4,50, menos que um pão com presunto 🥺", typing: 1800 },
  ],
  [
    { delay: 0, text: "Ei você 👀", typing: 1000 },
    { delay: 2000, text: "Tô vendo que tá curtindo né? 😏", typing: 1800 },
    { delay: 4800, text: "Imagina o que eu guardo no meu Segredinho então... 🤫🔥", typing: 2500 },
    { delay: 8300, text: "Vídeos que eu NUNCA postaria em lugar nenhum 😈", typing: 2200 },
    { delay: 11500, text: "Me ajuda com R$ 4,50? Preciso pagar minha faculdade amor 📚🥺", typing: 2000 },
  ],
  [
    { delay: 0, text: "Oi gatinho 😘", typing: 1300 },
    { delay: 2300, text: "Sabia que você ia aparecer por aqui...", typing: 2000 },
    { delay: 5300, text: "Quero te mostrar umas coisas que ninguém viu ainda 🤫", typing: 2500 },
    { delay: 8800, text: "Tá tudo no meu Segredinho 😈 é meu conteúdo mais safado", typing: 2800 },
    { delay: 12600, text: "São só R$ 4,50 pra desbloquear tudo... pra sempre 💕", typing: 1500 },
  ],
  [
    { delay: 0, text: "Amor!! 💕", typing: 1000 },
    { delay: 2000, text: "Obrigada por estar aqui comigo 🥰", typing: 1800 },
    { delay: 4800, text: "Eu gravei uns vídeos muito ousados ontem... tô morrendo de vergonha 🙈", typing: 3000 },
    { delay: 8800, text: "Coloquei tudo no Segredinho... só pra quem realmente me apoia 😈💦", typing: 2800 },
    { delay: 12600, text: "R$ 4,50 e você vê TUDO... me ajuda na faculdade? 🥺📚", typing: 1800 },
  ],
];

const getRandomChat = () => CHAT_VARIATIONS[Math.floor(Math.random() * CHAT_VARIATIONS.length)];

const FakeSofiaChat: React.FC<{ onSubscribe: () => void }> = ({ onSubscribe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; fromSofia: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [unread, setUnread] = useState(0);

  // Mostra bolinha após 20s
  useEffect(() => {
    const t = setTimeout(() => {
      setShowBubble(true);
      setUnread(1);
    }, 20000);
    return () => clearTimeout(t);
  }, []);

  // Quando abre o chat, dispara mensagens
  useEffect(() => {
    if (!isOpen) return;
    setUnread(0);

    const timeouts: NodeJS.Timeout[] = [];

    const chatMessages = getRandomChat();

    chatMessages.forEach((msg, idx) => {
      // Mostra "digitando..." antes de cada mensagem
      timeouts.push(setTimeout(() => {
        setIsTyping(true);
      }, msg.delay));

      // Mostra a mensagem
      timeouts.push(setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { text: msg.text, fromSofia: true }]);
      }, msg.delay + msg.typing));
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isOpen]);

  if (!showBubble) return null;

  return (
    <>
      {/* Chat bubble flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-[70] w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full shadow-[0_0_25px_rgba(236,72,153,0.4)] flex items-center justify-center animate-bounce hover:scale-110 transition-transform"
        >
          <img src="https://secreto.meuprivacy.digital/acesso/foto22.jpg" className="w-11 h-11 rounded-full object-cover border-2 border-white/30" alt="Sofia" />
          {unread > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-zinc-950">
              {unread}
            </div>
          )}
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-[90] w-[320px] max-h-[450px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="https://secreto.meuprivacy.digital/acesso/foto22.jpg" className="w-9 h-9 rounded-full object-cover border-2 border-white/30" alt="Sofia" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-pink-600"></div>
              </div>
              <div>
                <p className="text-white text-sm font-black">Sofia Oliveira</p>
                <p className="text-white/60 text-[10px] font-medium">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white text-lg">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[200px] bg-zinc-950/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.fromSofia ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                  msg.fromSofia 
                    ? 'bg-zinc-800 text-white rounded-bl-md' 
                    : 'bg-pink-600 text-white rounded-br-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900 shrink-0">
            <button
              onClick={() => { setIsOpen(false); onSubscribe(); }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black uppercase text-xs rounded-xl active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
            >
              🤫 DESBLOQUEAR SEGREDINHO — R$ 4,50
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ====== RETURN VISITOR DETECTION ======
const VISIT_KEY = 'sofia_visited';
const RETURN_DISMISSED_KEY = 'sofia_return_dismissed';

const ReturnVisitorBanner: React.FC<{ onSubscribe: () => void }> = ({ onSubscribe }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem(VISIT_KEY);
    const dismissed = sessionStorage.getItem(RETURN_DISMISSED_KEY);
    
    if (visited && !dismissed) {
      // Já visitou antes — mostra banner de retorno após 3s
      setTimeout(() => setShow(true), 3000);
    } else if (!visited) {
      // Primeira visita — salva no localStorage
      localStorage.setItem(VISIT_KEY, Date.now().toString());
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(RETURN_DISMISSED_KEY, '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-fade-in">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 flex items-center justify-center gap-3 shadow-lg">
        <span className="text-black text-xs sm:text-sm font-black uppercase text-center leading-tight">
          🎉 BEM-VINDO DE VOLTA! Segredinho por <span className="line-through opacity-60">R$ 9,90</span> <span className="text-lg">R$ 4,50</span>
        </span>
        <button
          onClick={() => { handleDismiss(); onSubscribe(); }}
          className="shrink-0 bg-black text-amber-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-zinc-900 transition-colors"
        >
          PEGAR
        </button>
        <button onClick={handleDismiss} className="shrink-0 text-black/40 hover:text-black text-lg">✕</button>
      </div>
    </div>
  );
};

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

// ====== WELCOME ONBOARDING FLOW ======
const WelcomeFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'obrigado' | 'video' | 'done'>('obrigado');

  const handleNext = () => {
    if (step === 'obrigado') {
      setStep('video');
    } else {
      sessionStorage.setItem(WELCOME_SEEN_KEY, '1');
      onComplete();
    }
  };

  if (step === 'obrigado') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Coração animado */}
          <div className="text-6xl animate-bounce">💕</div>
          
          {/* Foto da Sofia */}
          <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-pink-500/50 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
            <img 
              src="https://secreto.meuprivacy.digital/acesso/foto22.jpg" 
              alt="Sofia" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mensagem de agradecimento */}
          <div className="space-y-3">
            <h1 className="text-white font-black text-2xl md:text-3xl leading-tight">
              Muito obrigado por ter comprado meus conteúdos, amor! 💕
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Fico tão feliz que você decidiu me conhecer melhor...<br/>
              Preparei tudo com muito carinho pra você 🥰
            </p>
          </div>

          {/* Botão próximo */}
          <button 
            onClick={handleNext}
            className="w-full max-w-xs mx-auto py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black uppercase text-sm rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-3"
          >
            Próximo →
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Video + texto sobre o Segredinho
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Vídeo preview */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl aspect-[9/16] max-h-[50vh] mx-auto">
          <video 
            src="https://secreto.meuprivacy.digital/acesso/video3.mp4"
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        {/* Texto explicativo */}
        <div className="space-y-3 px-2">
          <p className="text-white text-base leading-relaxed font-medium">
            Amor, vou te deixar ver <span className="text-pink-400 font-bold">várias coisas liberadas</span> aqui no meu perfil... 🔥
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Mas os meus <span className="text-white font-bold">melhores conteúdos</span>, aqueles que eu tenho vergonha de postar... estão no meu <span className="text-pink-400 font-black">Segredinho 😈</span>
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            É um valor único que você paga só uma vez e me ajuda a pagar minha faculdade 🥺📚
          </p>
        </div>

        {/* Botão próximo */}
        <button 
          onClick={handleNext}
          className="w-full max-w-xs mx-auto py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black uppercase text-sm rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-3"
        >
          Ver meus conteúdos 🔥
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [isVip, setIsVip] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLeakPortal, setShowLeakPortal] = useState(false);
  const [directAccessId, setDirectAccessId] = useState<string | null>(null);
  const [leadLocation, setLeadLocation] = useState<string>('');
  const [showGroupOffer, setShowGroupOffer] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem(WELCOME_SEEN_KEY));

  // Verifica VIP no localStorage ao carregar
  useEffect(() => {
    const vipStatus = checkVipStatus();
    setIsVip(vipStatus);
  }, []);

  // Detecta localização do lead via IP
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,regionName,city');
        const data = await res.json();
        if (data.status === 'success' && data.countryCode === 'BR') {
          if (data.city && data.regionName) {
            setLeadLocation(`${data.city}, ${data.regionName}`);
          } else if (data.regionName) {
            setLeadLocation(data.regionName);
          }
          // Se não achar nem estado, fica vazio
        }
        // Se for de fora do BR, não mostra nada
      } catch {
        // Em caso de erro, não mostra localização
      }
    };
    fetchLocation();
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
      document.title = "Sofia Oliveira | Conteúdos Exclusivos";
    }
  }, [showLeakPortal, directAccessId]);

  const handleVipSuccess = () => {
    activateVip();
    setIsVip(true);
    // Mostra oferta de grupo 1s depois que o modal de pagamento fechar
    setTimeout(() => {
      if (!showLeakPortal) setShowGroupOffer(true);
    }, 8000);
  };

  const profileData: CreatorProfile = {
    name: "Sofia Oliveira",
    handle: "sofia_vip",
    bio: "Obrigado por ter comprado meus conteúdos amor 💕 Aqui você vai ver meu lado mais íntimo... e se desbloquear meu Segredinho 😈, te mostro TUDO sem censura.",
    age: 19,
    subscribers: "158.9k",
    location: leadLocation,
    tags: ["Amador", "Pés", "POV", "Sereia", "Caseiro"],
    avatarUrl: "https://secreto.meuprivacy.digital/acesso/foto22.jpg",
    bannerUrl: "https://secreto.meuprivacy.digital/acesso/foto5.jpg",
    socials: { instagram: "#", telegram: "#", twitter: "#" }
  };

  // Welcome flow: mostra antes de tudo
  if (showWelcome && !directAccessId && !showLeakPortal) {
    return <WelcomeFlow onComplete={() => setShowWelcome(false)} />;
  }

  if (directAccessId) {
    return <SubmundoVazado accessId={directAccessId} onBack={() => {
      setDirectAccessId(null);
      window.history.pushState({}, '', window.location.pathname);
    }} />;
  }

  if (showLeakPortal) {
    return <ExclusiveLeakPage onBack={() => setShowLeakPortal(false)} leadLocation={leadLocation} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'photos': return <PhotoGrid onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
      case 'videos': return <VideoGallery onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
      case 'live': return <LiveSection isVip={isVip} onOpenSubscription={() => setShowPaymentModal(true)} />;
      case 'feed':
      default: return <Feed onOpenSubscription={() => setShowPaymentModal(true)} onOpenVazados={() => setShowLeakPortal(true)} isVip={isVip} />;
    }
  };

  // Extrai cidade da localização
  const cityName = leadLocation ? leadLocation.split(',')[0].trim() : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-24 relative select-none">
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
        onOpenVazados={() => setShowLeakPortal(true)}
        leadLocation={leadLocation}
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

      <LeakAdCard onClick={() => setShowLeakPortal(true)} onVipClick={() => setShowPaymentModal(true)} />

      {/* Social Proof Toast */}
      {!isVip && <SocialProofToast cityName={cityName} />}

      {/* Group Offer Modal */}
      <GroupOfferModal isOpen={showGroupOffer} onClose={() => setShowGroupOffer(false)} cityName={cityName} />

      {/* Sticky CTA Bar (só pra quem não desbloqueou o Segredinho) */}
      {!isVip && !showPaymentModal && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-md px-4 py-3 animate-fade-in">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full max-w-lg mx-auto py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black uppercase text-sm rounded-xl shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            😈 DESBLOQUEAR SEGREDINHO — R$ 4,50
          </button>
        </div>
      )}

      {/* Exit Intent Popup */}
      {!isVip && <ExitIntentPopup onSubscribe={() => setShowPaymentModal(true)} />}

      {/* Fake Sofia Chat */}
      {!isVip && <FakeSofiaChat onSubscribe={() => setShowPaymentModal(true)} />}

      {/* Return Visitor Banner */}
      {!isVip && <ReturnVisitorBanner onSubscribe={() => setShowPaymentModal(true)} />}

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
