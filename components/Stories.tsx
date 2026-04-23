
import React, { useState } from 'react';
import { Lock, X, Gem } from './Icons';

interface StoriesProps {
  isVip: boolean;
  onOpenSubscription: () => void;
}

interface StoryItem {
  id: number;
  label: string;
  thumb: string;
  mediaUrl: string;
  isVideo: boolean;
  isLocked: boolean;
}

const Stories: React.FC<StoriesProps> = ({ isVip, onOpenSubscription }) => {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [progress, setProgress] = useState(0);

  const stories: StoryItem[] = [
    { id: 1, label: "Novo 🔥", thumb: "https://secreto.meuprivacy.digital/acesso/foto5.jpg", mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto5.jpg", isVideo: false, isLocked: false },
    { id: 2, label: "Segredinho 😈", thumb: "https://secreto.meuprivacy.digital/acesso/foto6.jpg", mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto6.jpg", isVideo: false, isLocked: true },
  ];

  const handleStoryClick = (story: StoryItem) => {
    const locked = story.isLocked && !isVip;
    if (locked) {
      onOpenSubscription();
    } else {
      setActiveStory(story);
      setProgress(0);
    }
  };

  // Auto-advance timer for story viewer
  React.useEffect(() => {
    if (!activeStory) return;
    
    const duration = 5000; // 5 seconds per story
    const interval = 50;
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Go to next story or close
          const currentIndex = stories.findIndex(s => s.id === activeStory.id);
          const nextStory = stories.slice(currentIndex + 1).find(s => !s.isLocked || isVip);
          if (nextStory) {
            setActiveStory(nextStory);
            return 0;
          } else {
            setActiveStory(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [activeStory, isVip]);

  return (
    <>
      {/* Stories bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {stories.map((story) => {
            const locked = story.isLocked && !isVip;
            return (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                onClick={() => handleStoryClick(story)}
              >
                <div className={`relative w-[72px] h-[72px] rounded-full p-[3px] ${
                  locked 
                    ? 'bg-gradient-to-br from-zinc-600 to-zinc-800' 
                    : story.isLocked && isVip
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                      : 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500'
                }`}>
                  <div className="w-full h-full rounded-full p-[2px] bg-zinc-950">
                    <img 
                      src={story.thumb} 
                      alt={story.label}
                      className={`w-full h-full rounded-full object-cover transition-all duration-300 group-hover:scale-105 ${locked ? 'blur-sm opacity-50' : 'opacity-90 group-hover:opacity-100'}`}
                    />
                  </div>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 bg-zinc-900/80 rounded-full flex items-center justify-center border border-zinc-700">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    </div>
                  )}
                  {story.isLocked && isVip && (
                    <div className="absolute -top-0.5 -right-0.5">
                      <Gem className="w-4 h-4 text-amber-400 drop-shadow-lg" />
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-bold truncate max-w-[72px] text-center ${locked ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {story.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full screen story viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fade-in">
          {/* Tap zones for navigation - Left (back) / Right (forward) */}
          <div className="absolute inset-0 z-40 flex">
            <div 
              className="w-[30%] h-full" 
              onClick={(e) => {
                e.stopPropagation();
                // Go to previous available story
                const availableStories = stories.filter(s => !s.isLocked || isVip);
                const currentIdx = availableStories.findIndex(s => s.id === activeStory.id);
                if (currentIdx > 0) {
                  setActiveStory(availableStories[currentIdx - 1]);
                  setProgress(0);
                }
              }}
            />
            <div 
              className="w-[70%] h-full" 
              onClick={(e) => {
                e.stopPropagation();
                // Go to next available story
                const availableStories = stories.filter(s => !s.isLocked || isVip);
                const currentIdx = availableStories.findIndex(s => s.id === activeStory.id);
                if (currentIdx < availableStories.length - 1) {
                  setActiveStory(availableStories[currentIdx + 1]);
                  setProgress(0);
                } else {
                  setActiveStory(null); // Close when reaching the end
                }
              }}
            />
          </div>

          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
            {stories.filter(s => !s.isLocked || isVip).map((story, idx) => {
              const activeIdx = stories.filter(s => !s.isLocked || isVip).findIndex(s => s.id === activeStory.id);
              return (
                <div key={story.id} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ 
                      width: idx < activeIdx ? '100%' : idx === activeIdx ? `${progress}%` : '0%'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-3">
              <img src="https://secreto.meuprivacy.digital/acesso/foto22.jpg" className="w-9 h-9 rounded-full border-2 border-white/20 object-cover" alt="Sofia" />
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
            <video 
              src={activeStory.mediaUrl} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-contain"
              controlsList="nodownload"
            />
          ) : (
            <img 
              src={activeStory.mediaUrl} 
              alt="Story" 
              className="w-full h-full object-contain"
            />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none"></div>

          {/* Segredinho badge if unlocked */}
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
