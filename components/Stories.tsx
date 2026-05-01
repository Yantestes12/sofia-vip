
import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, Gem, AlertTriangle } from './Icons';

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

const Stories: React.FC<StoriesProps> = ({ isVip, isAgeVerified, onOpenSubscription, onOpenVazados, onRequestAgeVerification }) => {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [progress, setProgress] = useState(0);
  const [ageTimerFired, setAgeTimerFired] = useState(false);
  const storyOpenTime = useRef<number>(0);

  const stories: StoryItem[] = [
    { id: 1, label: "Hoje 💕", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto8.webp", mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto8.webp", isVideo: false, isLocked: false },
    { id: 2, label: "Segredinho 😈", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto6.webp", mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto6.webp", isVideo: false, isLocked: true },
    // Vazados highlight - opens vazados stories inline
    { id: 99, label: "VAZADOS", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto20.webp", mediaUrl: "", isVideo: false, isLocked: false, isVazado: true, title: "⚠️ VAZADOS" },
  ];

  // Vazados stories (shown when clicking the Vazados highlight)
  const vazadosStories: StoryItem[] = [
    { id: 100, label: "Vazado 1", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto18.webp", mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto18.webp", isVideo: false, isLocked: false },
    { id: 101, label: "Vazado 2", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto22.webp", mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto22.webp", isVideo: false, isLocked: false },
    { id: 102, label: "Vazado 3", thumb: "https://secreto.meuprivacy.digital/nataliexking/foto25.webp", mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto25.webp", isVideo: false, isLocked: false },
  ];

  const [showingVazados, setShowingVazados] = useState(false);

  const handleStoryClick = (story: StoryItem) => {
    if (story.isVazado) {
      // Open vazados as inline stories
      setShowingVazados(true);
      setActiveStory(vazadosStories[0]);
      setProgress(0);
      setAgeTimerFired(false);
      storyOpenTime.current = Date.now();
      return;
    }
    const locked = story.isLocked && !isVip;
    if (locked) {
      onOpenSubscription();
    } else {
      setActiveStory(story);
      setProgress(0);
      setAgeTimerFired(false);
      storyOpenTime.current = Date.now();
    }
  };

  // 30s age verification trigger
  useEffect(() => {
    if (!activeStory || isAgeVerified || ageTimerFired) return;
    const timer = setTimeout(() => {
      setAgeTimerFired(true);
      setActiveStory(null);
      onRequestAgeVerification();
    }, 30000);
    return () => clearTimeout(timer);
  }, [activeStory, isAgeVerified, ageTimerFired]);

  // Auto-advance timer
  useEffect(() => {
    if (!activeStory) return;
    const duration = 6000;
    const interval = 50;
    const step = (interval / duration) * 100;
    const currentList = showingVazados ? vazadosStories : stories.filter(s => !s.isVazado && (!s.isLocked || isVip));
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          const currentIdx = currentList.findIndex(s => s.id === activeStory.id);
          const next = currentList[currentIdx + 1];
          if (next) { setActiveStory(next); return 0; }
          else { setActiveStory(null); setShowingVazados(false); return 0; }
        }
        return prev + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [activeStory, isVip, showingVazados]);

  return (
    <>
      {/* Stories bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {stories.map((story) => {
            const locked = story.isLocked && !isVip;
            const isVazado = story.isVazado;
            return (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group relative"
                onClick={() => handleStoryClick(story)}
              >
                <div className={`relative w-[72px] h-[72px] rounded-full p-[3px] ${
                  isVazado
                    ? 'bg-gradient-to-br from-red-600 via-red-500 to-orange-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : locked 
                      ? 'bg-gradient-to-br from-zinc-600 to-zinc-800' 
                      : story.isLocked && isVip
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                        : 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500'
                }`}>
                  <div className="w-full h-full rounded-full p-[2px] bg-zinc-950">
                    <img 
                      src={story.thumb} 
                      alt={story.label}
                      className={`w-full h-full rounded-full object-cover transition-all duration-300 group-hover:scale-105 ${
                        locked ? 'blur-sm opacity-50' : isVazado ? 'opacity-70' : 'opacity-90 group-hover:opacity-100'
                      }`}
                    />
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
                  {story.isLocked && isVip && (
                    <div className="absolute -top-0.5 -right-0.5">
                      <Gem className="w-4 h-4 text-amber-400 drop-shadow-lg" />
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-bold truncate max-w-[72px] text-center ${
                  isVazado ? 'text-red-500' : locked ? 'text-zinc-600' : 'text-zinc-400'
                }`}>
                  {story.label}
                </span>
                {/* Exclamation badge for Vazados */}
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
            <div className="w-[30%] h-full" onClick={(e) => {
              e.stopPropagation();
              const avail = stories.filter(s => !s.isVazado && (!s.isLocked || isVip));
              const idx = avail.findIndex(s => s.id === activeStory.id);
              if (idx > 0) { setActiveStory(avail[idx - 1]); setProgress(0); }
            }} />
            <div className="w-[70%] h-full" onClick={(e) => {
              e.stopPropagation();
              const avail = stories.filter(s => !s.isVazado && (!s.isLocked || isVip));
              const idx = avail.findIndex(s => s.id === activeStory.id);
              if (idx < avail.length - 1) { setActiveStory(avail[idx + 1]); setProgress(0); }
              else { setActiveStory(null); }
            }} />
          </div>

          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
            {stories.filter(s => !s.isVazado && (!s.isLocked || isVip)).map((story, idx) => {
              const activeIdx = stories.filter(s => !s.isVazado && (!s.isLocked || isVip)).findIndex(s => s.id === activeStory.id);
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
              <img src="https://secreto.meuprivacy.digital/nataliexking/foto1.webp" className="w-9 h-9 rounded-full border-2 border-white/20 object-cover" alt="Sofia" />
              <div>
                <p className="text-white text-sm font-bold">Sofia Oliveira</p>
                <p className="text-white/50 text-[10px] font-medium">Agora</p>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setActiveStory(null); }} className="p-2 text-white/70 hover:text-white z-50">
              <X size={24} />
            </button>
          </div>

          {/* Media */}
          {activeStory.isVideo ? (
            <video src={activeStory.mediaUrl} autoPlay playsInline muted className="w-full h-full object-contain" controlsList="nodownload" />
          ) : (
            <img src={activeStory.mediaUrl} alt="Story" className="w-full h-full object-contain" />
          )}

          {/* Gradients */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none"></div>

          {/* Age verification countdown hint */}
          {!isAgeVerified && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-blue-500/20 border border-blue-500/40 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
              <span className="text-blue-400 text-xs font-black uppercase">🔐 Verificação de idade necessária</span>
            </div>
          )}

          {activeStory.isLocked && isVip && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-pink-500/20 border border-pink-500/40 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
              <Gem className="w-4 h-4 text-pink-400" />
              <span className="text-pink-400 text-xs font-black uppercase">Segredinho 😈</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Stories;
