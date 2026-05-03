
import React, { useState, useEffect } from 'react';
import ProfileHeader from './components/ProfileHeader';
import Navigation from './components/Navigation';
import Feed from './components/Feed';
import PhotoGrid from './components/PhotoGrid';
import VideoGallery from './components/VideoGallery';
import LiveSection from './components/LiveSection';
import ExclusiveLeakPage from './components/ExclusiveLeakPage';
import SubmundoVazado from './components/SubmundoVazado';
import LeakAdCard from './components/LeakAdCard';
import PaymentModal from './components/PaymentModal';
import Stories from './components/Stories';
import { CreatorProfile, TabType } from './types';

const FIRST_VISIT_KEY = 'sofia_first_visit';
const FREE_PERIOD_MINUTES = 10;

const WELCOME_SEEN_KEY = 'sofia_welcome_seen';

const VIP_STORAGE_KEY = 'sofia_segredinho_access';

// ====== SOCIAL PROOF TOAST (12 variações calibradas) ======
const SP_NAMES = ['Lucas','Pedro','João','Carlos','Bruno','Felipe','Gustavo','Rafael','Mateus','André','Daniel','Gabriel','Diego','Marcos','Thiago','Leonardo','Ricardo','Eduardo','Rodrigo','Victor','Henrique','Caio','Vinícius','Igor','Renato'];
const SP_CITIES_FALLBACK = ['São Paulo','Rio de Janeiro','Belo Horizonte','Curitiba','Salvador','Fortaleza','Brasília','Goiânia','Recife','Porto Alegre'];

type SPNotification = { emoji: string; text: string; sub: string };

const generateNotification = (cityName: string, index: number): SPNotification => {
  const name = SP_NAMES[Math.floor(Math.random() * SP_NAMES.length)];
  const city = cityName || SP_CITIES_FALLBACK[Math.floor(Math.random() * SP_CITIES_FALLBACK.length)];
  const mins = Math.floor(Math.random() * 7) + 1;
  const weekCount = Math.floor(Math.random() * 400) + 600;
  const viewingNow = Math.floor(Math.random() * 30) + 15;

  // Sequência calibrada por gatilho psicológico
  const templates: (() => SPNotification)[] = [
    // 0: Validação local (FOMO geográfico)
    () => ({ emoji: '🔥', text: `${name} de ${city} desbloqueou o Segredinho`, sub: `há ${mins} min` }),
    // 1: Intimidade (relação parassocial)
    () => ({ emoji: '💜', text: `Sofia está online respondendo mensagens`, sub: `agora mesmo` }),
    // 2: FOMO de atividade
    () => ({ emoji: '👀', text: `${viewingNow} pessoas assistindo conteúdos agora`, sub: `atividade em tempo real` }),
    // 3: Prova numérica
    () => ({ emoji: '⚡', text: `${weekCount} pessoas desbloquearam esta semana`, sub: `e contando...` }),
    // 4: Testemunho implícito
    () => ({ emoji: '😈', text: `"Melhor R$ 16,90 que já gastei na vida"`, sub: `via DM anônima` }),
    // 5: Validação de valor
    () => ({ emoji: '💰', text: `Última compra: R$ 16,90`, sub: `há ${Math.floor(Math.random() * 50) + 10} segundos` }),
    // 6: Urgência temporal
    () => ({ emoji: '🔥', text: `${Math.floor(Math.random() * 3) + 2} novos conteúdos adicionados hoje`, sub: `conteúdo fresquinho` }),
    // 7: Competição social
    () => ({ emoji: '🏆', text: `Vídeo mais assistido hoje: 2.4k views`, sub: `conteúdo trending` }),
    // 8: Escassez
    () => ({ emoji: '⏰', text: `Estes conteúdos podem ser removidos a qualquer momento`, sub: `salve enquanto pode` }),
    // 9: Proximidade + local
    () => ({ emoji: '📍', text: `Alguém perto de você acabou de desbloquear`, sub: `${city} • agora` }),
    // 10: FOMO de conteúdo
    () => ({ emoji: '🔥', text: `Novo vídeo postado — ${Math.floor(Math.random() * 40) + 20} já assistiram`, sub: `há ${Math.floor(Math.random() * 20) + 5} min` }),
    // 11: Emocional / conexão
    () => ({ emoji: '💕', text: `Sofia agradeceu ${Math.floor(Math.random() * 15) + 8} novos apoiadores`, sub: `hoje` }),
  ];

  const fn = templates[index % templates.length];
  return fn();
};

// Sequência otimizada: cada índice atinge um gatilho diferente na ordem certa
const SP_SEQUENCE = [0, 1, 2, 3, 4, 5, 0, 6, 2, 7, 9, 11, 8, 10, 0, 5, 3, 1, 4, 6];

const SocialProofToast: React.FC<{ cityName: string }> = ({ cityName }) => {
  const [visible, setVisible] = useState(false);
  const [notif, setNotif] = useState<SPNotification>({ emoji: '', text: '', sub: '' });
  const [seqIndex, setSeqIndex] = useState(0);

  useEffect(() => {
    const showToast = () => {
      const idx = SP_SEQUENCE[seqIndex % SP_SEQUENCE.length];
      setNotif(generateNotification(cityName, idx));
      setSeqIndex(prev => prev + 1);
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    };

    // Primeiro toast após 10s
    const firstTimer = setTimeout(showToast, 10000);
    // Depois com intervalo variável (12-22s) pra parecer orgânico
    const interval = setInterval(showToast, Math.floor(Math.random() * 10000) + 12000);
    
    return () => { clearTimeout(firstTimer); clearInterval(interval); };
  }, [cityName, seqIndex]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-[80] max-w-[300px]" style={{ animation: 'fadeSlideIn 0.4s ease-out, fadeSlideOut 0.4s ease-in 4s forwards' }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateX(-20px) translateY(10px); } to { opacity: 1; transform: translateX(0) translateY(0); } }
        @keyframes fadeSlideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-30px); } }
      `}</style>
      <div className="bg-zinc-900/95 border border-zinc-700/50 rounded-xl px-4 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center gap-3">
        <div className="w-9 h-9 bg-pink-500/15 rounded-full flex items-center justify-center shrink-0 border border-pink-500/20">
          <span className="text-base">{notif.emoji}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-[11px] font-bold leading-tight">{notif.text}</p>
          <p className="text-zinc-500 text-[10px] font-medium mt-0.5">{notif.sub}</p>
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
              <span className="text-emerald-400 font-black text-3xl">R$ 14,71</span>
            </div>
            <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase">Acesso vitalício • Pagamento único</p>
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <button 
              onClick={() => { window.open('https://t.me/+exemplo', '_blank'); onClose(); }}
              className="w-full py-4 bg-[#0088cc] hover:bg-[#0077b5] text-white font-black uppercase rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              ✈️ ENTRAR VIA TELEGRAM — R$ 14,71
            </button>
            <button 
              onClick={() => { window.open('https://wa.me/5500000000000', '_blank'); onClose(); }}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              💬 ENTRAR VIA WHATSAPP — R$ 14,71
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
          <img src="https://secreto.meuprivacy.digital/nataliexking/foto5.webp" className="w-full h-full object-cover blur-[2px] opacity-40 scale-110" alt="" />
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
            Eu gravei um vídeo especial pra você... mas preciso ter certeza que você é <span className="text-white font-bold">maior de idade</span> 🔞
          </p>

          <div className="bg-zinc-950 rounded-xl p-4 border border-blue-500/20">
            <p className="text-blue-400 font-bold text-center">🔐 Verificação de idade necessária</p>
            <p className="text-zinc-500 text-[10px] mt-1 text-center font-bold uppercase">Confirme sua idade e receba uma foto personalizada com seu nome 💋</p>
          </div>

          <button
            onClick={() => { setShow(false); onSubscribe(); }}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black uppercase text-sm rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            🔐 VERIFICAR MINHA IDADE
          </button>

          <button onClick={() => setShow(false)} className="text-zinc-600 text-xs font-bold uppercase hover:text-zinc-400 transition-colors">
            Agora não
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
    { delay: 2500, text: "Tô doida pra te mandar um vídeo que gravei hoje...", typing: 2000 },
    { delay: 5500, text: "Mas preciso ter certeza que você é de maior 🔞", typing: 2500 },
    { delay: 9000, text: "Faz a verificação de idade rapidinho? Depois eu te mando uma foto com seu nome escrito de batom aqui nos meus peitos 😈💋", typing: 3500 },
    { delay: 14000, text: "É rapidinho, prometo que vai valer a pena... 🥺🔥", typing: 1500 },
  ],
  [
    { delay: 0, text: "Oiii 🥰", typing: 1200 },
    { delay: 2000, text: "Que bom que você tá aqui... eu gravei um vídeo especial", typing: 2000 },
    { delay: 5000, text: "Só que eu não posso mostrar pra qualquer um 🙈", typing: 2500 },
    { delay: 8500, text: "Preciso confirmar que você é maior de idade... se confirmar, te mando uma surpresa personalizada com seu nome 💕", typing: 3500 },
    { delay: 13000, text: "Faz a verificação? Prometo que depois a gente se diverte juntos 😈", typing: 2000 },
  ],
  [
    { delay: 0, text: "Ei você 👀", typing: 1000 },
    { delay: 2000, text: "Tô aqui te observando... quer ver o que eu preparei? 😏", typing: 2000 },
    { delay: 5000, text: "Gravei um vídeo SÓ pra quem confirmar a idade comigo 🔞🔥", typing: 2500 },
    { delay: 8500, text: "E pra quem verificar... eu faço uma foto exclusiva com o nome dele de batom aqui 💋", typing: 3000 },
    { delay: 12500, text: "Verifica logo amor, tô esperando... 🥺", typing: 1800 },
  ],
  [
    { delay: 0, text: "Oi gatinho 😘", typing: 1300 },
    { delay: 2300, text: "Sabia que você ia aparecer por aqui...", typing: 2000 },
    { delay: 5300, text: "Tenho um presente pra você, mas primeiro preciso saber se você é de maior 🔞", typing: 3000 },
    { delay: 9300, text: "Se confirmar, te mando um vídeo e uma foto minha com seu nome escrito de batom nos meus peitos 😈💋", typing: 3500 },
    { delay: 13800, text: "Vai demorar? Tô ansiosa pra te mostrar 🥺💦", typing: 1500 },
  ],
  [
    { delay: 0, text: "Amor!! 💕", typing: 1000 },
    { delay: 2000, text: "Obrigada por estar aqui comigo 🥰", typing: 1800 },
    { delay: 4800, text: "Eu quero muito te mandar uns conteúdos bem ousados que eu gravei ontem 🙈", typing: 3000 },
    { delay: 8800, text: "Mas por segurança preciso que você confirme sua idade... depois disso eu te mando tudo, e ainda faço uma foto personalizada com seu nome de batom 💋😈", typing: 4000 },
    { delay: 13800, text: "Faz a verificação? É rapidinho e depois a gente conversa melhor... 🥺🔥", typing: 2000 },
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
          <img src="https://secreto.meuprivacy.digital/nataliexking/foto1.webp" className="w-11 h-11 rounded-full object-cover border-2 border-white/30" alt="Sofia" />
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
                <img src="https://secreto.meuprivacy.digital/nataliexking/foto1.webp" className="w-9 h-9 rounded-full object-cover border-2 border-white/30" alt="Sofia" />
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
              🔐 VERIFICAR MINHA IDADE
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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-center gap-3 shadow-lg">
        <span className="text-white text-xs sm:text-sm font-black uppercase text-center leading-tight">
          🔐 BEM-VINDO DE VOLTA! Verifique sua idade e desbloqueie conteúdos exclusivos
        </span>
        <button
          onClick={() => { handleDismiss(); onSubscribe(); }}
          className="shrink-0 bg-white text-blue-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-zinc-100 transition-colors"
        >
          VERIFICAR
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

// ====== WELCOME POPUP - SIMPLE WHATSAPP CTA ======
const WelcomeFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const handleClose = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem(WELCOME_SEEN_KEY, '1');
    onComplete();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem(WELCOME_SEEN_KEY, '1');
      onComplete();
    }, 15000);
    return () => clearTimeout(timeout);
  }, []);

  const btnStyle: React.CSSProperties = {
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    cursor: 'pointer',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ maxWidth: '24rem', width: '100%', background: '#18181b', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', border: '1px solid #27272a', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>
        <div style={{ width: '8rem', height: '8rem', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(236,72,153,0.5)', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(236,72,153,0.2)' }}>
          <img src="https://secreto.meuprivacy.digital/nataliexking/foto1.webp" alt="Sofia" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem', lineHeight: 1.3, marginBottom: '12px' }}>
          Oi amor! 💕
        </h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
          Por favor, <span style={{ color: '#f472b6', fontWeight: 700 }}>compre meus conteúdos</span> pelo PIX que mandei no <span style={{ color: '#22c55e', fontWeight: 700 }}>WhatsApp</span>, tá? 🥺💋
        </p>

        <button 
          type="button"
          onClick={handleClose}
          onTouchEnd={handleClose}
          style={{
            ...btnStyle,
            width: '100%', padding: '14px 24px', marginBottom: '12px',
            background: 'linear-gradient(to right, #ec4899, #f43f5e)',
            color: 'white', fontWeight: 900, textTransform: 'uppercase' as const, fontSize: '0.875rem',
            borderRadius: '14px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          Ver meus conteúdos 🔥
        </button>

        <p style={{ color: '#52525b', fontSize: '0.7rem', marginTop: '8px' }}>
          Toque para entrar no perfil
        </p>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [isVip, setIsVip] = useState(false);
  const [isFreePeriod, setIsFreePeriod] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLeakPortal, setShowLeakPortal] = useState(false);
  const [directAccessId, setDirectAccessId] = useState<string | null>(null);
  const [leadLocation, setLeadLocation] = useState<string>('');
  const [showGroupOffer, setShowGroupOffer] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem(WELCOME_SEEN_KEY));
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [isLoading, setIsLoading] = useState(true);

  // Splash screen: 4s loading to preload content
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Verifica VIP e free period
  useEffect(() => {
    setIsVip(checkVipStatus());
    // Free period: first 10 min since first visit
    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
    if (!firstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
      setIsFreePeriod(true);
    } else {
      const elapsed = Date.now() - parseInt(firstVisit, 10);
      setIsFreePeriod(elapsed < FREE_PERIOD_MINUTES * 60 * 1000);
    }
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
    handle: "sofiaoliveira",
    bio: "Obrigado por ter comprado meus conteúdos amor 💕 Aqui você vai ver meu lado mais íntimo... e se desbloquear meu Segredinho 😈, te mostro TUDO sem censura.",
    age: 19,
    subscribers: "203.4k",
    location: leadLocation,
    tags: ["Amador", "Provocante", "Caseiro", "Lingerie", "Safadinha"],
    avatarUrl: "https://secreto.meuprivacy.digital/nataliexking/foto1.webp",
    bannerUrl: "https://secreto.meuprivacy.digital/nataliexking/foto5.webp",
    socials: { instagram: "#", telegram: "#", twitter: "#" }
  };

  // Welcome popup: rendered as overlay inside main JSX (not blocking)

  if (directAccessId) {
    return <SubmundoVazado accessId={directAccessId} onBack={() => {
      setDirectAccessId(null);
      window.history.pushState({}, '', window.location.pathname);
    }} />;
  }

  if (showLeakPortal) {
    return <ExclusiveLeakPage onBack={() => setShowLeakPortal(false)} leadLocation={leadLocation} />;
  }

  const vipDisplayPrice = 'R$ 16,90';
  const cityName = leadLocation ? leadLocation.split(',')[0].trim() : '';

  const handleOpenVazados = () => {
    if (isFreePeriod) {
      setActiveTab('vazados');
    } else {
      setShowLeakPortal(true);
    }
  };

  // Splash screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-[9999] flex flex-col items-center justify-center select-none">
        {/* Glow background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        {/* Avatar with ring */}
        <div className="relative mb-8 z-10">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_40px_rgba(236,72,153,0.3)]"
            style={{ animation: 'spin 3s linear infinite' }}>
            <div className="w-full h-full rounded-full bg-zinc-950 p-1">
              <img
                src={profileData.avatarUrl}
                alt="Sofia"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          {/* Online badge */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-[3px] border-zinc-950 shadow-lg" />
        </div>

        {/* Name */}
        <h1 className="text-white font-black text-2xl tracking-tight mb-1 z-10">Sofia Oliveira</h1>
        <p className="text-zinc-500 text-sm font-medium mb-8 z-10">@sofiaoliveira</p>

        {/* Fire + Loading text */}
        <div className="flex items-center gap-2 mb-4 z-10">
          <span className="text-2xl" style={{ animation: 'bounce 1s ease-in-out infinite' }}>🔥</span>
          <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Carregando conteúdos</p>
          <span className="text-2xl" style={{ animation: 'bounce 1s ease-in-out infinite 0.2s' }}>🔥</span>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden z-10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400"
            style={{
              animation: 'loadProgress 3.5s ease-out forwards',
            }}
          />
        </div>

        <p className="text-zinc-600 text-[10px] uppercase tracking-[3px] mt-6 z-10 font-bold">
          conteúdo privado • acesso exclusivo
        </p>

        {/* Keyframe animations */}
        <style>{`
          @keyframes loadProgress {
            0% { width: 0%; }
            30% { width: 40%; }
            60% { width: 70%; }
            85% { width: 90%; }
            100% { width: 100%; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-24 relative select-none animate-fade-in">
      {/* Welcome popup overlay */}
      {showWelcome && <WelcomeFlow onComplete={() => setShowWelcome(false)} />}

      <ProfileHeader 
        profile={profileData} 
        isVip={isVip}
        isFreePeriod={isFreePeriod}
        onPurchase={() => setShowPaymentModal(true)}
      />

      {/* Ao Vivo - Top Banner (VIP overlay only after free period) */}
      <div className="container mx-auto px-4 pt-4">
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
          onClick={() => !isFreePeriod && setShowPaymentModal(true)}>
          <div className="relative h-32 w-full overflow-hidden">
            <video src="https://secreto.meuprivacy.digital/nataliexking/video10.mp4"
              autoPlay muted loop playsInline
              className={`w-full h-full object-cover ${!isVip ? 'blur-[6px]' : ''}`} />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/40 to-transparent"></div>
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-[10px] font-black uppercase tracking-widest">AO VIVO</span>
            </div>
            <div className="absolute top-3 right-3 bg-black/50 px-2.5 py-1 rounded-full text-white text-[9px] font-bold backdrop-blur-sm">
              👁 {Math.floor(Math.random() * 300 + 200)} assistindo
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {isFreePeriod ? (
                  <>
                    <p className="text-white font-black text-sm uppercase tracking-tight mb-2">
                      🔴 Sofia está ao vivo agora
                    </p>
                    <div className="bg-green-500/80 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full inline-block">
                      💬 COMPRE NO WHATSAPP
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-white font-black text-sm uppercase tracking-tight mb-2">
                      😈 Conteúdo VIP — Acesso Vitalício
                    </p>
                    <div className="bg-pink-500/80 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full inline-block">
                      ASSISTIR — {vipDisplayPrice}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Stories 
        isVip={isVip} 
        isAgeVerified={!isFreePeriod}
        onOpenSubscription={() => setShowPaymentModal(true)} 
        onOpenVazados={handleOpenVazados}
        onRequestAgeVerification={() => {}}
      />

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handleVipSuccess}
        onOpenVazados={() => setShowLeakPortal(true)}
        leadLocation={leadLocation}
      />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 py-8 animate-fade-in-up">
        {activeTab === 'feed' && (
          <Feed 
            onOpenSubscription={() => setShowPaymentModal(true)} 
            onOpenVazados={handleOpenVazados} 
            onRequestAgeVerification={() => {}}
            isVip={isVip} 
            isAgeVerified={!isFreePeriod}
          />
        )}
        {activeTab === 'photos' && (
          <PhotoGrid isVip={isVip} onUnlock={() => setShowPaymentModal(true)} />
        )}
        {activeTab === 'videos' && (
          <VideoGallery isVip={isVip} isFreePeriod={isFreePeriod} onUnlock={() => setShowPaymentModal(true)} />
        )}
        {activeTab === 'live' && (
          <LiveSection isVip={isVip} isFreePeriod={isFreePeriod} onUnlock={() => setShowPaymentModal(true)} />
        )}
        {activeTab === 'vazados' && (
          isFreePeriod ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-600/10 flex items-center justify-center border-2 border-red-500/30">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-white font-black text-xl uppercase mb-3">Conteúdos Vazados</h3>
              <p className="text-zinc-400 text-sm mb-6 max-w-xs mx-auto">Esses conteúdos são muito pesados... me chama no WhatsApp que eu libero pra você 🔥</p>
              <a href="https://wa.me/" target="_blank" rel="noopener"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 px-8 rounded-xl font-black uppercase text-sm shadow-lg active:scale-[0.97] transition-transform">
                💬 COMPRAR NO WHATSAPP
              </a>
            </div>
          ) : (
            <ExclusiveLeakPage onBack={() => setActiveTab('feed')} leadLocation={leadLocation} />
          )
        )}
      </main>

      {!isFreePeriod && <LeakAdCard onClick={() => setShowLeakPortal(true)} onVipClick={() => setShowPaymentModal(true)} />}

      {!isVip && !isFreePeriod && <SocialProofToast cityName={cityName} />}

      {!isFreePeriod && <GroupOfferModal isOpen={showGroupOffer} onClose={() => setShowGroupOffer(false)} cityName={cityName} />}

      {/* Sticky CTA Bar - ONLY after free period */}
      {!isVip && !isFreePeriod && !showPaymentModal && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-md px-4 py-3 animate-fade-in">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full max-w-lg mx-auto py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black uppercase text-sm rounded-xl shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-2">
            🔥 DESBLOQUEAR VIP VITALÍCIO — {vipDisplayPrice}
          </button>
        </div>
      )}

      {!isVip && !isFreePeriod && <ExitIntentPopup onSubscribe={() => setShowPaymentModal(true)} />}
      {!isVip && !isFreePeriod && <FakeSofiaChat onSubscribe={() => setShowPaymentModal(true)} />}
      {!isVip && !isFreePeriod && <ReturnVisitorBanner onSubscribe={() => setShowPaymentModal(true)} />}

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
