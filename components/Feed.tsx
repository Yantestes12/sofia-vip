
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Gem, Lock, ShieldAlert, AlertTriangle, X } from './Icons';

interface FeedProps {
  onOpenSubscription: () => void;
  onOpenVazados: () => void;
  isVip: boolean;
}

const VazadosPopup: React.FC<{ onOpen: () => void; onClose: () => void; variant: number }> = ({ onOpen, onClose, variant }) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(t);
  }, []);

  const variants = [
    {
      title: "CONTEÚDO PESADO VAZOU",
      subtitle: "Os vídeos mais proibidos do submundo acabaram de ser liberados...",
      cta: "VER CONTEÚDOS VAZADOS",
      badge: "⚠️ MATERIAL RESTRITO",
      img: "https://secreto.meuprivacy.digital/acesso/foto6.jpg"
    },
    {
      title: "VAZAMENTOS EXCLUSIVOS",
      subtitle: "Material que deveria ter sido deletado... mas alguém salvou tudo antes.",
      cta: "ACESSAR VAZADOS AGORA",
      badge: "🔞 CONTEÚDO FORTE",
      img: "https://secreto.meuprivacy.digital/acesso/foto20.jpg"
    },
    {
      title: "ALERTA: NOVOS LEAKS",
      subtitle: "Conteúdos fortíssimos recém-vazados. Assista antes que derrubem!",
      cta: "LIBERAR ACESSO AGORA",
      badge: "☠️ SUBMUNDO ATIVADO",
      img: "https://secreto.meuprivacy.digital/acesso/foto24.jpg"
    }
  ];

  const v = variants[variant % variants.length];

  return (
    <div className="relative bg-zinc-950 border-2 border-red-600 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-fade-in-up">
      {/* Close button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-3 right-3 z-30 bg-black/60 p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors border border-zinc-700"
      >
        <X size={14} />
      </button>

      {/* Background image */}
      <div className="relative h-48 md:h-56 w-full overflow-hidden">
        <img 
          src={v.img} 
          alt="Leak" 
          className="w-full h-full object-cover blur-[6px] opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-red-950/30"></div>
        
        {/* Pulsing lock icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`bg-red-600/90 p-5 rounded-full border-2 border-white/20 backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.8)] ${pulse ? 'scale-110' : 'scale-100'} transition-transform duration-700`}>
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Ribbon */}
        <div className="absolute top-4 -right-10 bg-red-600 text-white text-[9px] font-black uppercase py-1.5 w-40 text-center rotate-[45deg] shadow-lg border-y border-white/20 tracking-[2px]">
          VAZOU 2026
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center space-y-4 relative">
        {/* Urgente Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-red-600 text-[10px] font-black uppercase px-5 py-1.5 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> {v.badge}
        </div>

        <div className="pt-2">
          <h3 className="text-white font-black text-2xl md:text-3xl uppercase italic tracking-tighter leading-[0.9]">
            {v.title.split(' ').slice(0, -1).join(' ')} <span className="text-red-500">{v.title.split(' ').slice(-1)}</span>
          </h3>
        </div>

        <p className="text-zinc-400 text-sm font-medium leading-snug max-w-sm mx-auto">
          {v.subtitle}
        </p>

        <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 font-black uppercase">
          <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-red-500" /> +18 APENAS</span>
          <span>•</span>
          <span className="text-red-500">ACESSO LIMITADO</span>
        </div>

        <button 
          onClick={onOpen}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase text-sm py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] active:scale-[0.97] flex items-center justify-center gap-3"
        >
          <ShieldAlert size={18} />
          {v.cta}
        </button>

        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">
          ⚡ {Math.floor(Math.random() * 300 + 500)} pessoas acessando agora
        </p>
      </div>
    </div>
  );
};

const Feed: React.FC<FeedProps> = ({ onOpenSubscription, onOpenVazados, isVip }) => {
  const [dismissedPopups, setDismissedPopups] = useState<Set<number>>(new Set());

  const posts = [
    {
      id: 1,
      text: "POV: Você me flagrou tirando a roupa da máquina e eu decidi te dar um showzinho... o que achou dessa vista? 🍑🧺",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto15.jpg",
      isVideo: false,
      likes: "4.8k",
      comments: "342",
      isLocked: false
    },
    {
      id: 2,
      text: "O clima esquentou aqui com a minha amiga... Olha como a gente se diverte quando vocês não estão vendo. Chupando com vontade! 🎥👯‍♀️💦",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video3.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto3.jpg",
      isVideo: true,
      likes: "10.2k",
      comments: "610",
      isLocked: true
    },
    {
      id: 3,
      text: "Aquele check-in básico no espelho pra garantir que tudo continua no lugar... e bem grande, né? 😉👀🍑",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto8.jpg",
      isVideo: false,
      likes: "5.4k",
      comments: "215",
      isLocked: false
    },
    {
      id: 4,
      text: "Gravei o momento exato em que ele decidiu me pegar por trás sem aviso... a pressão foi absurda e eu amei cada segundo! 🔊🤤🔞",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video12.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto12.jpg",
      isVideo: true,
      likes: "12.7k",
      comments: "840",
      isLocked: true
    },
    {
      id: 5,
      text: "Disseram que essa pose valoriza... Eu acho que valoriza até demais. Dá conta de encarar esse rabão empinado? 🍑🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto27.jpg",
      isVideo: false,
      likes: "7.1k",
      comments: "430",
      isLocked: false
    },
    {
      id: 6,
      text: "A carinha é de anjo, mas a vontade é de ser pega de jeito, sem dó e no capricho. Quem aqui se candidata? 😈🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto40.jpg",
      isVideo: false,
      likes: "9.8k",
      comments: "1.1k",
      isLocked: true
    },
    {
      id: 7,
      text: "Look de hoje: só o básico para não atrapalhar na hora que a gente começar a brincar... Gostaram da transparência? 👗😏",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto19.jpg",
      isVideo: false,
      likes: "4.2k",
      comments: "180",
      isLocked: false
    },
    {
      id: 8,
      text: "Senti a música e deixei o corpo levar... Olha como eu rebolo gostoso imaginando você bem aqui atrás de mim. 💃🍑💦",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video8.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto8.jpg",
      isVideo: true,
      likes: "11.4k",
      comments: "720",
      isLocked: true
    },
    {
      id: 9,
      text: "Se você quer me ver gemendo alto, essa é a posição certa. Minha favorita absoluta para sentir tudo entrar... 🔞🤫",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto33.jpg",
      isVideo: false,
      likes: "8.1k",
      comments: "510",
      isLocked: true
    },
    {
      id: 10,
      text: "Descendo até o chão pra mostrar que a flexibilidade está em dia... e a safadeza também! Rebolando até o final. 🎥🔥📉",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video21.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto21.jpg",
      isVideo: true,
      likes: "13.2k",
      comments: "910",
      isLocked: true
    },
    {
      id: 11,
      text: "Sou insaciável e adoro um desafio. A pergunta é simples: você daria conta de me comer a noite toda sem parar? 🍽️😋🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto10.jpg",
      isVideo: false,
      likes: "6.3k",
      comments: "490",
      isLocked: false
    },
    {
      id: 12,
      text: "Aquele combo que a gente ama: primeiro eu te deixo louco com a boca, depois você me pega com toda a força que eu gosto... 🔞🌊🔊",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video45.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto45.jpg",
      isVideo: true,
      likes: "21k",
      comments: "2.5k",
      isLocked: true
    },
    {
      id: 13,
      text: "Não consigo pensar em outra coisa hoje... sinto meu corpo queimando de tesão. Alguém vem apagar esse meu fogo? 🌡️🔥🥵",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto44.jpg",
      isVideo: false,
      likes: "32k",
      comments: "4.8k",
      isLocked: false
    }
  ];

  // Build items list with Vazados popups inserted every 5 posts
  const buildFeedItems = () => {
    const items: { type: 'post' | 'vazados'; data?: any; popupIndex?: number }[] = [];
    let popupCount = 0;

    posts.forEach((post, idx) => {
      items.push({ type: 'post', data: post });

      // After every 5th post, insert a vazados popup
      if ((idx + 1) % 5 === 0 && idx < posts.length - 1) {
        items.push({ type: 'vazados', popupIndex: popupCount });
        popupCount++;
      }
    });

    return items;
  };

  const feedItems = buildFeedItems();

  const handleDismiss = (popupIndex: number) => {
    setDismissedPopups(prev => new Set(prev).add(popupIndex));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {feedItems.map((item, idx) => {
        if (item.type === 'vazados') {
          if (dismissedPopups.has(item.popupIndex!)) return null;
          return (
            <VazadosPopup 
              key={`vazados-${item.popupIndex}`} 
              onOpen={onOpenVazados} 
              onClose={() => handleDismiss(item.popupIndex!)}
              variant={item.popupIndex!}
            />
          );
        }

        const post = item.data;
        const locked = post.isLocked && !isVip;
        return (
          <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://secreto.meuprivacy.digital/acesso/foto22.jpg" className="w-12 h-12 rounded-full border-2 border-zinc-800" alt="Sofia" />
              </div>
              {post.isLocked && isVip && (
                <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border border-amber-500/20">
                  <Gem size={10} /> VIP DESBLOQUEADO
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-5 mb-4">
              <p className="text-zinc-200 text-base leading-relaxed italic">"{post.text}"</p>
            </div>

            {/* Media */}
            <div className="relative">
              {/* Proteção para vídeos e fotos no feed */}
              <div className="absolute inset-0 z-10 bg-transparent pointer-events-none"></div>
              
              {locked ? (
                <div className="aspect-[3/4] md:aspect-video w-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
                  <img src={post.thumbnail || post.mediaUrl} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110" alt="Locked" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                  
                  <div className="z-10 bg-zinc-900/80 border border-zinc-800/80 p-8 rounded-3xl text-center shadow-2xl backdrop-blur-md max-w-[85%]">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                       <Lock className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-white font-black text-xl uppercase italic mb-2 tracking-tighter">CONTEÚDO EXCLUSIVO</h3>
                    <p className="text-zinc-400 text-xs mb-6 font-medium">Você precisa ser VIP para espiar isso.</p>
                    <button 
                       onClick={onOpenSubscription} 
                       className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black py-3 rounded-xl font-black uppercase text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex justify-center items-center gap-2"
                    >
                       ASSINAR POR R$ 6,90 <Gem size={16} className="fill-black" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full bg-black flex items-center justify-center min-h-[300px]">
                  {post.isVideo ? (
                    <video 
                      src={post.mediaUrl} 
                      controls 
                      className="w-full max-h-[700px] object-contain" 
                      poster={post.thumbnail}
                      playsInline
                      controlsList="nodownload"
                    />
                  ) : (
                    <img src={post.mediaUrl} className="w-full h-auto max-h-[800px] object-contain" alt="Post" />
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center gap-8 border-t border-zinc-800/50 bg-zinc-900/50">
              <button className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors group">
                <Heart className="w-7 h-7 group-active:scale-125 transition-transform" />
                <span className="text-sm font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors">
                <MessageCircle className="w-7 h-7" />
                <span className="text-sm font-bold">{post.comments}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
