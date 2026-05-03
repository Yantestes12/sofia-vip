
import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, Gem, AlertTriangle, ShieldAlert } from './Icons';

interface StoriesProps {
  isVip: boolean;
  isAgeVerified: boolean;
  onOpenSubscription: () => void;
  onOpenVazados: () => void;
  onRequestAgeVerification: () => void;
}

interface StoryItem {
  id: number;
  label: string;
  thumb: string;
  mediaUrl: string;
  isVideo: boolean;
  isLocked: boolean;
  isVazado?: boolean;
  title?: string;
}

const VAZADO_VIDEOS = [
  { title: 'Deficiente rabuda e gostosa, colocando dentro bem devagar (RESTRITO)', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto22.webp' },
  { title: 'Primas e irmãs⁺¹⁸ se pegando em live (VIRGENS⁺¹⁸)', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_2.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto20.webp' },
  { title: 'FEMBOY (TRANS)☠️ Meu amigo Trans percebeu que eu sempre quis...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_3.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto21.webp' },
  { title: '❌⚠️DEFICIENTE⚠️ Encostei minha mão na coxa dela...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_4.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto24.webp' },
  { title: 'Filho mostrando que sua mãe deixa ele encostar o p4u nela...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_5.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto27.webp' },
  { title: 'Irmãos Baianos expostos na net... tinha medo colocar dentro da própria irmã 🔥', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_6.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto8.webp' },
  { title: 'Verdade e desafio termina com irmã mamando o próprio irmão ‼️', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_7.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto2.webp' },
  { title: 'Estavam bebendo, e a irmã começou a mamar junto com a namorada ☠️', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_8.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp' },
  { title: 'OCULTO - "sempre quis colocar a mão em seu pau..." Diz prima pro primo', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_9.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto4.webp' },
];

const Stories: React.FC<StoriesProps> = ({ isVip, isAgeVerified, onOpenSubscription, onOpenVazados, onRequestAgeVerification }) => {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [progress, setProgress] = useState(0);
  const [showBlurOverlay, setShowBlurOverlay] = useState(false);
  const [showingVazados, setShowingVazados] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const storyStartTime = useRef<number>(0);

  // During free period (isAgeVerified=false): hide Segredinho, show only free stories
  // After free period: show Segredinho locked
  const stories: StoryItem[] = [
    { id: 1, label: "Hoje 💕", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto8.webp", mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto8.webp", isVideo: false, isLocked: false },
    // Segredinho only visible after free period
    ...(isAgeVerified ? [{ id: 2, label: "Segredinho 😈", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto6.webp", mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto6.webp", isVideo: false, isLocked: true }] : []),
    { id: 99, label: "VAZADOS", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto20.webp", mediaUrl: "", isVideo: false, isLocked: false, isVazado: true, title: "⚠️ VAZADOS" },
  ];

  // Build vazados stories from real videos
  const vazadosStories: StoryItem[] = VAZADO_VIDEOS.map((v, i) => ({
    id: 100 + i, label: `Vazado ${i + 1}`, thumb: v.thumb,
    mediaUrl: v.url, isVideo: true, isLocked: false, title: v.title,
  }));

  const handleStoryClick = (story: StoryItem) => {
    if (story.isVazado) {
      setShowingVazados(true);
      setActiveStory(vazadosStories[0]);
      setProgress(0);
      setShowBlurOverlay(false);
      storyStartTime.current = Date.now();
      return;
    }
    if (story.isLocked && !isVip) {
      // After free period: open VIP payment
      onOpenSubscription();
      return;
    }
    setShowingVazados(false);
    setActiveStory(story);
    setProgress(0);
    setShowBlurOverlay(false);
    storyStartTime.current = Date.now();
  };

  // Blur trigger: during free period vazados blur after 10s, normal stories after 30s
  // After free period (isAgeVerified=true): no blur at all
  useEffect(() => {
    if (!activeStory || isAgeVerified) return;
    const delay = showingVazados ? 10000 : 30000;
    const timer = setTimeout(() => {
      setShowBlurOverlay(true);
      if (videoRef.current) videoRef.current.pause();
    }, delay);
    return () => clearTimeout(timer);
  }, [activeStory, isAgeVerified, showingVazados]);

  // Auto-advance timer
  useEffect(() => {
    if (!activeStory || showBlurOverlay) return;
    const duration = showingVazados ? 15000 : 6000;
    const interval = 50;
    const step = (interval / duration) * 100;
    const currentList = showingVazados ? vazadosStories : stories.filter(s => !s.isVazado && (!s.isLocked || isVip));
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          const currentIdx = currentList.findIndex(s => s.id === activeStory.id);
          const next = currentList[currentIdx + 1];
          if (next) {
            setActiveStory(next);
            setShowBlurOverlay(false);
            storyStartTime.current = Date.now();
            return 0;
          } else {
            setActiveStory(null);
            setShowingVazados(false);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [activeStory, isVip, showingVazados, showBlurOverlay]);

  const navigateStory = (direction: 'prev' | 'next') => {
    if (!activeStory) return;
    const currentList = showingVazados ? vazadosStories : stories.filter(s => !s.isVazado && (!s.isLocked || isVip));
    const idx = currentList.findIndex(s => s.id === activeStory.id);
    if (direction === 'next') {
      const next = currentList[idx + 1];
      if (next) { setActiveStory(next); setProgress(0); setShowBlurOverlay(false); storyStartTime.current = Date.now(); }
      else { setActiveStory(null); setShowingVazados(false); }
    } else {
      const prev = currentList[idx - 1];
      if (prev) { setActiveStory(prev); setProgress(0); setShowBlurOverlay(false); storyStartTime.current = Date.now(); }
    }
  };

  const closeStory = () => { setActiveStory(null); setShowingVazados(false); setShowBlurOverlay(false); };

  return (
    <>
      {/* Stories bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {stories.map((story) => {
            const locked = story.isLocked && !isVip;
            const isVazado = story.isVazado;
            return (
              <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group relative"
                onClick={() => handleStoryClick(story)}>
                <div className={`relative w-[72px] h-[72px] rounded-full p-[3px] ${
                  isVazado
                    ? 'bg-gradient-to-br from-red-600 via-red-500 to-orange-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : locked
                      ? 'bg-gradient-to-br from-zinc-600 to-zinc-800'
                      : 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500'
                }`}>
                  <div className="w-full h-full rounded-full p-[2px] bg-zinc-950">
                    <img src={story.thumb} alt={story.label}
                      className={`w-full h-full rounded-full object-cover transition-all duration-300 group-hover:scale-105 ${
                        locked ? 'blur-sm opacity-50' : isVazado ? 'opacity-70' : 'opacity-90 group-hover:opacity-100'
                      }`} />
                  </div>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 bg-zinc-900/80 rounded-full flex items-center justify-center border border-zinc-700">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    </div>
                  )}
                  {isVazado && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 bg-red-600/90 rounded-full flex items-center justify-center border border-red-400/50 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-bold truncate max-w-[72px] text-center ${
                  isVazado ? 'text-red-500' : locked ? 'text-zinc-600' : 'text-zinc-400'
                }`}>{story.label}</span>
                {isVazado && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border-2 border-zinc-950 shadow-lg">
                      <span className="text-white text-[8px] font-black">!</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full screen story viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fade-in">
          {/* Tap zones */}
          <div className="absolute inset-0 z-40 flex">
            <div className="w-[30%] h-full" onClick={(e) => { e.stopPropagation(); navigateStory('prev'); }} />
            <div className="w-[70%] h-full" onClick={(e) => { e.stopPropagation(); navigateStory('next'); }} />
          </div>

          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
            {(showingVazados ? vazadosStories : stories.filter(s => !s.isVazado && (!s.isLocked || isVip))).map((story, idx) => {
              const currentList = showingVazados ? vazadosStories : stories.filter(s => !s.isVazado && (!s.isLocked || isVip));
              const activeIdx = currentList.findIndex(s => s.id === activeStory.id);
              return (
                <div key={story.id} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: idx < activeIdx ? '100%' : idx === activeIdx ? `${progress}%` : '0%' }} />
                </div>
              );
            })}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-3">
              {showingVazados ? (
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center border-2 border-white/20">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
              ) : (
                <img src="https://secreto.meuprivacy.digital/nataliexking/foto1.webp" className="w-9 h-9 rounded-full border-2 border-white/20 object-cover" alt="Sofia" />
              )}
              <div>
                <p className="text-white text-sm font-bold">{showingVazados ? '⚠️ VAZADOS' : 'Sofia Oliveira'}</p>
                <p className="text-white/50 text-[10px] font-medium">{showingVazados ? 'Conteúdo restrito' : 'Agora'}</p>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); closeStory(); }} className="p-2 text-white/70 hover:text-white z-50">
              <X size={24} />
            </button>
          </div>

          {/* Vazados title overlay */}
          {showingVazados && activeStory.title && (
            <div className="absolute top-20 left-4 right-4 z-50">
              <div className="bg-red-600/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-red-400/30">
                <p className="text-white text-xs font-black uppercase leading-snug">{activeStory.title}</p>
              </div>
            </div>
          )}

          {/* Media */}
          {activeStory.isVideo ? (
            <video ref={videoRef} src={activeStory.mediaUrl} autoPlay playsInline muted
              className={`w-full h-full object-contain transition-all duration-700 ${showBlurOverlay ? 'blur-[20px]' : ''}`}
              controlsList="nodownload" />
          ) : (
            <img src={activeStory.mediaUrl} alt="Story"
              className={`w-full h-full object-contain transition-all duration-700 ${showBlurOverlay ? 'blur-[20px]' : ''}`} />
          )}

          {/* Gradients */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none"></div>

          {/* Blur overlay - during free period: 'compre no WhatsApp' */}
          {showBlurOverlay && !isAgeVerified && (
            <div className="absolute inset-0 z-[45] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-zinc-900/95 border border-zinc-700 rounded-2xl p-6 mx-4 max-w-sm text-center shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-600">
                  <Lock className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-white font-black text-lg uppercase mb-2">Conteúdo Bloqueado</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  {showingVazados
                    ? 'Quer ver os vazados completos? Me chama no WhatsApp que eu libero pra você 🔥'
                    : 'Quer ver mais? Me chama no WhatsApp que eu te mostro tudo 💕'}
                </p>
                <a href="https://wa.me/" target="_blank" rel="noopener"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-black uppercase text-sm rounded-xl shadow-lg active:scale-[0.97] transition-transform z-50 relative flex items-center justify-center gap-2">
                  💬 COMPRAR NO WHATSAPP
                </a>
                <button onClick={(e) => { e.stopPropagation(); closeStory(); }}
                  className="w-full py-2.5 text-zinc-500 text-xs font-bold uppercase mt-2 hover:text-zinc-300 transition-colors z-50 relative">
                  FECHAR
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Stories;
