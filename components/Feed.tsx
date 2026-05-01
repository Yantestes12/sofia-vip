
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Gem, Lock, ShieldAlert, AlertTriangle, X } from './Icons';

interface FeedProps {
  onOpenSubscription: () => void;
  onOpenVazados: () => void;
  onRequestAgeVerification: () => void;
  isVip: boolean;
  isAgeVerified: boolean;
}

// ====== VIDEO PREVIEW ======
const VideoPreview: React.FC<{
  src: string; blurLevel: number; onUnlock: () => void; likes: string; vipPrice: string;
}> = ({ src, blurLevel, onUnlock, likes, vipPrice }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [froze, setFroze] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const handleCanPlay = () => { vid.play().catch(() => {}); };
    const handleTimeUpdate = () => { if (vid.currentTime >= 3 && !froze) { vid.pause(); setFroze(true); } };
    vid.addEventListener('canplay', handleCanPlay);
    vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => { vid.removeEventListener('canplay', handleCanPlay); vid.removeEventListener('timeupdate', handleTimeUpdate); };
  }, [froze]);

  return (
    <>
      <video ref={videoRef} src={`${src}#t=0.5`} muted playsInline preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        style={{ filter: froze ? `blur(${blurLevel}px)` : `blur(${Math.max(blurLevel - 6, 0)}px)` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent"></div>
      <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm z-20 flex items-center gap-1">▶ VÍDEO</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center">
          <Lock className="w-7 h-7 text-pink-400 mb-2 drop-shadow-lg" />
          <p className="text-white text-[10px] font-bold mb-2">Prévia de 3s • Vídeo completo bloqueado</p>
          <button onClick={onUnlock}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 px-6 rounded-xl font-black uppercase text-xs shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-[0.97] transition-transform">
            DESBLOQUEAR — {vipPrice}
          </button>
          <p className="text-zinc-400 text-[10px] mt-2 font-bold">❤️ {likes} curtidas</p>
        </div>
      </div>
    </>
  );
};

// ====== VAZADOS INLINE CARD ======
const VazadosCard: React.FC<{ onOpen: () => void; onOpenVip: () => void; vipPrice: string }> = ({ onOpen, onOpenVip, vipPrice }) => {
  const [viewerCount] = useState(() => Math.floor(Math.random() * 300 + 500));
  return (
    <div className="relative bg-zinc-950 border-2 border-red-600 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-fade-in-up">
      <div className="relative h-48 md:h-56 w-full overflow-hidden">
        <img src="https://secreto.meuprivacy.digital/nataliexking/foto20.webp" alt="" className="w-full h-full object-cover blur-[6px] opacity-40 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-red-950/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-600/90 p-5 rounded-full border-2 border-white/20 backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-pulse">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="absolute top-4 -right-10 bg-red-600 text-white text-[9px] font-black uppercase py-1.5 w-40 text-center rotate-[45deg] shadow-lg border-y border-white/20 tracking-[2px]">VAZOU 2026</div>
      </div>
      <div className="p-6 text-center space-y-4 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-red-600 text-[10px] font-black uppercase px-5 py-1.5 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> ⚠️ MATERIAL RESTRITO
        </div>
        <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-[0.9] pt-2">CONTEÚDO <span className="text-red-500">VAZADO</span></h3>
        <p className="text-zinc-400 text-sm font-medium leading-snug">Os vídeos mais proibidos do submundo acabaram de ser liberados...</p>
        <button onClick={onOpen}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase text-sm py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-[0.97] flex items-center justify-center gap-3">
          <ShieldAlert size={18} /> VER CONTEÚDOS VAZADOS
        </button>
        <button onClick={onOpenVip}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black uppercase text-sm py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-[0.97] flex items-center justify-center gap-2">
          <Gem size={16} className="fill-white" /> DESBLOQUEAR SEGREDINHO — {vipPrice}
        </button>
        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">⚡ {viewerCount} pessoas acessando agora</p>
      </div>
    </div>
  );
};

// ====== MAIN FEED ======
const Feed: React.FC<FeedProps> = ({ onOpenSubscription, onOpenVazados, onRequestAgeVerification, isVip, isAgeVerified }) => {
  const [showCommentPrompt, setShowCommentPrompt] = useState<number | null>(null);

  const discount = isAgeVerified ? 4.90 : 0;
  const vipPrice = isAgeVerified ? `R$ ${(9.90 - discount).toFixed(2).replace('.',',')}` : 'R$ 9,90';

  const getBlurLevel = (lockedIdx: number): number => {
    const map: Record<number, number> = { 0: 4, 1: 6, 2: 10, 3: 14, 4: 18, 5: 22 };
    return map[Math.min(lockedIdx, 5)] || 22;
  };

  // Posts from Sofia Oliveira (new model) and Sofia Elle (old model/friend)
  const posts = [
    // Sofia Oliveira - new model
    { id: 1, creator: 'sofia', name: 'Sofia Oliveira', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp',
      text: "Bom dia amores! Tirei essa foto agora de manhã pra vocês... gostaram? 💕☀️",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto3.webp", isVideo: false, likes: "4.8k", comments: "342", isLocked: false },
    { id: 2, creator: 'sofia', name: 'Sofia Oliveira', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp',
      text: "Gravei esse vídeo pra quem me apoia... quem desbloqueou vai entender 😈🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/video3.mp4", isVideo: true, likes: "10.2k", comments: "610", isLocked: true },
    // Sofia Elle - friend (old model)
    { id: 3, creator: 'elle', name: 'Sofia Elle', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto15.webp',
      text: "Olha a foto que minha amiga Sofia tirou de mim 📸 ficou boa né? 😏",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto8.webp", isVideo: false, likes: "3.1k", comments: "180", isLocked: false },
    { id: 4, creator: 'sofia', name: 'Sofia Oliveira', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp',
      text: "Check-in no espelho... tá tudo no lugar né? 😉👀🍑",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto10.webp", isVideo: false, likes: "5.4k", comments: "215", isLocked: false },
    { id: 5, creator: 'elle', name: 'Sofia Elle', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto15.webp',
      text: "A Sofia me convenceu a gravar esse vídeo... tô morrendo de vergonha 🙈💦",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/video5.mp4", isVideo: true, likes: "8.7k", comments: "520", isLocked: true },
    // Vazados card insertion point (after 5 posts)
    { id: 6, creator: 'sofia', name: 'Sofia Oliveira', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp',
      text: "Essa lingerie nova que comprei... vocês aprovam? 👗😏🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto19.webp", isVideo: false, likes: "7.1k", comments: "430", isLocked: false },
    { id: 7, creator: 'elle', name: 'Sofia Elle', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto15.webp',
      text: "Conteúdo que eu gravei escondido... a Sofia nem sabe que eu postei 🤫",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto22.webp", isVideo: false, likes: "9.8k", comments: "1.1k", isLocked: true },
    { id: 8, creator: 'sofia', name: 'Sofia Oliveira', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp',
      text: "Senti a música e deixei o corpo levar... olha como eu danço 💃🍑",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/video8.mp4", isVideo: true, likes: "11.4k", comments: "720", isLocked: true },
    { id: 9, creator: 'sofia', name: 'Sofia Oliveira', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp',
      text: "Foto que eu tenho vergonha de mostrar pra qualquer um... só pra vocês 🙈",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto27.webp", isVideo: false, likes: "6.3k", comments: "490", isLocked: false },
    { id: 10, creator: 'elle', name: 'Sofia Elle', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto15.webp',
      text: "Eu e a Sofia fizemos um combinado... se vocês desbloquearem a gente mostra TUDO juntas 😈👯‍♀️",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/video12.mp4", isVideo: true, likes: "21k", comments: "2.5k", isLocked: true },
    { id: 11, creator: 'sofia', name: 'Sofia Oliveira', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp',
      text: "Não consigo pensar em outra coisa hoje... alguém vem apagar meu fogo? 🌡️🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/foto28.webp", isVideo: false, likes: "32k", comments: "4.8k", isLocked: false },
    { id: 12, creator: 'elle', name: 'Sofia Elle', avatar: 'https://secreto.meuprivacy.digital/nataliexking/foto15.webp',
      text: "Meu vídeo mais ousado até agora... tô nervosa de postar isso 😳🔞",
      mediaUrl: "https://secreto.meuprivacy.digital/nataliexking/video10.mp4", isVideo: true, likes: "15.6k", comments: "1.8k", isLocked: true },
  ];

  const handleCommentClick = (postId: number) => {
    if (!isAgeVerified) {
      onRequestAgeVerification();
    } else {
      setShowCommentPrompt(postId);
      setTimeout(() => setShowCommentPrompt(null), 2000);
    }
  };

  // Build feed items with Vazados card after 5th post
  const feedItems: { type: 'post' | 'vazados'; data?: any }[] = [];
  posts.forEach((post, idx) => {
    feedItems.push({ type: 'post', data: post });
    if (idx === 4) feedItems.push({ type: 'vazados' });
  });

  let sofiaLockedCount = 0;
  let elleLockedCount = 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {feedItems.map((item, idx) => {
        if (item.type === 'vazados') {
          return <VazadosCard key="vazados" onOpen={onOpenVazados} onOpenVip={onOpenSubscription} vipPrice={vipPrice} />;
        }

        const post = item.data;
        const locked = post.isLocked && !isVip;
        let currentLockedIdx = 0;
        if (locked) {
          if (post.creator === 'elle') { currentLockedIdx = elleLockedCount++; }
          else { currentLockedIdx = sofiaLockedCount++; }
        }

        return (
          <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatar} className="w-12 h-12 rounded-full border-2 border-zinc-800 object-cover" alt={post.name} />
                <div>
                  <p className="text-white text-sm font-bold flex items-center gap-1.5">
                    {post.name}
                    {post.creator === 'elle' && <span className="text-[9px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-black">AMIGA</span>}
                  </p>
                  <p className="text-zinc-500 text-[10px]">há {Math.floor(Math.random() * 12) + 1}h</p>
                </div>
              </div>
              {post.isLocked && isVip && (
                <div className="bg-pink-500/10 text-pink-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border border-pink-500/20">
                  <Gem size={10} /> DESBLOQUEADO 😈
                </div>
              )}
            </div>

            {/* Text */}
            <div className="px-5 mb-4">
              <p className="text-zinc-200 text-base leading-relaxed italic">"{post.text}"</p>
            </div>

            {/* Media */}
            <div className="relative">
              <div className="absolute inset-0 z-10 bg-transparent pointer-events-none"></div>
              {locked ? (
                <div className="aspect-[3/4] md:aspect-video w-full bg-zinc-950 relative overflow-hidden">
                  {post.isVideo ? (
                    <VideoPreview src={post.mediaUrl} blurLevel={getBlurLevel(currentLockedIdx)} onUnlock={onOpenSubscription} likes={post.likes} vipPrice={vipPrice} />
                  ) : (
                    <>
                      <img src={post.mediaUrl} className="absolute inset-0 w-full h-full object-cover" style={{ filter: `blur(${getBlurLevel(currentLockedIdx)}px)` }} alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent"></div>
                      {getBlurLevel(currentLockedIdx) >= 8 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                          <Lock className="w-8 h-8 text-pink-400 mb-3 drop-shadow-lg" />
                          <button onClick={onOpenSubscription}
                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 px-6 rounded-xl font-black uppercase text-xs shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-[0.97] transition-transform">
                            DESBLOQUEAR — {vipPrice}
                          </button>
                          <p className="text-zinc-400 text-[10px] mt-2 font-bold">❤️ {post.likes} curtidas</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="relative w-full bg-black flex items-center justify-center min-h-[300px]">
                  {post.isVideo ? (
                    <video src={post.mediaUrl} controls className="w-full max-h-[700px] object-contain" playsInline controlsList="nodownload" />
                  ) : (
                    <img src={post.mediaUrl} className="w-full h-auto max-h-[800px] object-contain" alt="" />
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
              <button onClick={() => handleCommentClick(post.id)} className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors relative">
                <MessageCircle className="w-7 h-7" />
                <span className="text-sm font-bold">{post.comments}</span>
                {!isAgeVerified && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <Lock className="w-2 h-2 text-white" />
                  </div>
                )}
              </button>
              {showCommentPrompt === post.id && (
                <span className="text-emerald-400 text-xs font-bold animate-fade-in">Em breve! 💬</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
