
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
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 px-6 rounded-xl font-black uppercase text-xs shadow-lg active:scale-[0.97] transition-transform">
            {vipPrice}
          </button>
          <p className="text-zinc-400 text-[10px] mt-2 font-bold">❤️ {likes} curtidas</p>
        </div>
      </div>
    </>
  );
};

// ====== VAZADOS INLINE CARD ======
const VazadosCard: React.FC<{ onOpen: () => void; onOpenVip: () => void; vipPrice: string; isFreePeriod?: boolean }> = ({ onOpen, onOpenVip, vipPrice, isFreePeriod }) => {
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
        {isFreePeriod ? (
          <a href="https://wa.me/" target="_blank" rel="noopener"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-black uppercase text-sm py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] active:scale-[0.97] flex items-center justify-center gap-3">
            💬 COMPRAR CONTEÚDOS NO WHATSAPP
          </a>
        ) : (
          <>
            <button onClick={onOpen}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase text-sm py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-[0.97] flex items-center justify-center gap-3">
              <ShieldAlert size={18} /> VER CONTEÚDOS VAZADOS
            </button>
            <button onClick={onOpenVip}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black uppercase text-sm py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-[0.97] flex items-center justify-center gap-2">
              <Gem size={16} className="fill-white" /> DESBLOQUEAR SEGREDINHO — {vipPrice}
            </button>
          </>
        )}
        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">⚡ {viewerCount} pessoas acessando agora</p>
      </div>
    </div>
  );
};

// ====== LAZY IMAGE ======
const LazyMedia: React.FC<{ src: string; isVideo: boolean; className?: string; style?: React.CSSProperties; alt?: string; videoProps?: any }> = ({ src, isVideo, className, style, alt, videoProps }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" style={{ animation: 'shimmer 1.5s infinite' }} />
        </div>
      )}
      {isVideo ? (
        <video src={src} className={className} style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }} onLoadedData={() => setLoaded(true)} {...videoProps} />
      ) : (
        <img src={src} className={className} style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }} alt={alt || ''} onLoad={() => setLoaded(true)} />
      )}
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </>
  );
};

// ====== MAIN FEED ======
const Feed: React.FC<FeedProps> = ({ onOpenSubscription, onOpenVazados, onRequestAgeVerification, isVip, isAgeVerified }) => {
  const [showCommentPrompt, setShowCommentPrompt] = useState<number | null>(null);
  const [feedReady, setFeedReady] = useState(false);

  // Preload first 6 images before showing feed
  useEffect(() => {
    const BASE = 'https://secreto.meuprivacy.digital/nataliexking';
    const preloadUrls = Array.from({ length: 6 }, (_, i) => `${BASE}/foto${i + 1}.webp`);
    let loaded = 0;
    const check = () => { loaded++; if (loaded >= preloadUrls.length) setFeedReady(true); };
    const timeout = setTimeout(() => setFeedReady(true), 5000); // fallback 5s
    preloadUrls.forEach(url => { const img = new Image(); img.onload = check; img.onerror = check; img.src = url; });
    return () => clearTimeout(timeout);
  }, []);

  // During free period: most content unlocked, show WhatsApp CTA
  // After free period: show VIP price R$16.90
  const vipPrice = 'R$ 16,90';
  const lockMessage = !isAgeVerified ? '💬 Compre no WhatsApp' : undefined;
  const onLockClick = !isAgeVerified ? () => { window.open('https://wa.me/', '_blank'); } : onOpenSubscription;

  const getBlurLevel = (lockedIdx: number): number => {
    const map: Record<number, number> = { 0: 4, 1: 6, 2: 10, 3: 14, 4: 18, 5: 22 };
    return map[Math.min(lockedIdx, 5)] || 22;
  };

  // Captions for Sofia Oliveira (new model)
  const sofiaCaptions = [
    "Bom dia amores! Tirei essa foto agora de manhã pra vocês 💕☀️",
    "Gravei esse vídeo pra quem me apoia... quem desbloquear vai entender 😈🔥",
    "Check-in no espelho... tá tudo no lugar né? 😉👀🍑",
    "Essa lingerie nova que comprei... vocês aprovam? 👗😏🔥",
    "Senti a música e deixei o corpo levar... 💃🍑",
    "Foto que eu tenho vergonha de mostrar pra qualquer um 🙈",
    "Não consigo pensar em outra coisa hoje... 🌡️🔥",
    "Acordei assim e resolvi tirar foto... gostaram? 📸💋",
    "Tô me sentindo poderosa hoje... quem aguenta? 😈",
    "Olha o que preparei pra vocês... 🤫🔥",
    "Vocês pediram mais e aqui estou eu... sem filtro 😏💦",
    "Esse vídeo foi o mais ousado que já gravei... 🙈🔞",
    "Dia preguiçoso de ficar na cama... vem comigo? 🛏️💕",
    "Acabei de sair do banho... tô quentinha ainda 🚿🔥",
    "Preparei uma surpresa... só pra quem verificar a idade 😈💋",
  ];

  // Captions for Sofia Elle (friend/old model)
  const elleCaptions = [
    "Olha a foto que minha amiga Sofia tirou de mim 📸 ficou boa né? 😏",
    "A Sofia me convenceu a postar isso... tô morrendo de vergonha 🙈💦",
    "Conteúdo que eu gravei escondido... a Sofia nem sabe 🤫",
    "Meu vídeo mais ousado até agora... tô nervosa 😳🔞",
    "Eu e a Sofia fizemos um combinado... desbloqueia pra ver 😈👯‍♀️",
    "A Sofia disse que vocês iam gostar dessa foto... 📸💕",
    "Gravei esse vídeo especial pra vocês... me contem o que acharam 🙈",
    "Minha amiga me convenceu a mostrar meu lado mais safado 😈",
    "Postando aqui no perfil da Sofia... espero que gostem 💋",
    "Essa foto eu tinha medo de postar... mas vou confiar em vocês 🔥",
  ];

  const BASE_NEW = 'https://secreto.meuprivacy.digital/nataliexking';
  const BASE_OLD = 'https://secreto.meuprivacy.digital/acesso';
  const AVATAR_SOFIA = `${BASE_NEW}/foto1.webp`;
  const AVATAR_ELLE = `${BASE_OLD}/foto22.jpg`;

  // Generate all posts dynamically
  const allPosts: any[] = [];
  let postId = 1;

  // Sofia Oliveira photos (30 photos, ~60% locked)
  for (let i = 1; i <= 30; i++) {
    allPosts.push({
      id: postId++, creator: 'sofia', name: 'Sofia Oliveira', avatar: AVATAR_SOFIA,
      text: sofiaCaptions[(i - 1) % sofiaCaptions.length],
      mediaUrl: `${BASE_NEW}/foto${i}.webp`, isVideo: false,
      likes: `${(Math.random() * 30 + 2).toFixed(1)}k`, comments: `${Math.floor(Math.random() * 800 + 100)}`,
      isLocked: !isAgeVerified ? (i % 10 === 0) : (i % 5 !== 0 && i % 3 !== 0), // Free: ~10% locked, Paid: ~60% locked
    });
  }

  // Sofia Oliveira videos (16 videos — ALL locked in feed, they're heavy to load)
  for (let i = 0; i <= 15; i++) {
    const videoUrl = i === 0 ? `${BASE_NEW}/video.mp4` : `${BASE_NEW}/video${i}.mp4`;
    allPosts.push({
      id: postId++, creator: 'sofia', name: 'Sofia Oliveira', avatar: AVATAR_SOFIA,
      text: sofiaCaptions[(i + 5) % sofiaCaptions.length],
      mediaUrl: videoUrl, isVideo: true,
      likes: `${(Math.random() * 40 + 5).toFixed(1)}k`, comments: `${Math.floor(Math.random() * 1500 + 200)}`,
      isLocked: true, // Always locked in feed — videos are heavy, send to VIP or WhatsApp
    });
  }

  // Sofia Elle photos (old model, 30 photos, ~70% locked)
  for (let i = 1; i <= 30; i++) {
    allPosts.push({
      id: postId++, creator: 'elle', name: 'Camila Elle', avatar: AVATAR_ELLE,
      text: elleCaptions[(i - 1) % elleCaptions.length],
      mediaUrl: `${BASE_OLD}/foto${i}.jpg`, isVideo: false,
      likes: `${(Math.random() * 20 + 1).toFixed(1)}k`, comments: `${Math.floor(Math.random() * 600 + 80)}`,
      isLocked: !isAgeVerified ? (i % 3 !== 0 && i % 5 !== 0) : (i % 10 !== 0 && i % 7 !== 0), // Free: ~50% locked, Paid: ~70% locked
    });
  }

  // Sofia Elle videos (old model, 15 videos — ALL locked in feed)
  for (let i = 1; i <= 15; i++) {
    allPosts.push({
      id: postId++, creator: 'elle', name: 'Camila Elle', avatar: AVATAR_ELLE,
      text: elleCaptions[(i + 3) % elleCaptions.length],
      mediaUrl: `${BASE_OLD}/video${i}.mp4`, isVideo: true,
      likes: `${(Math.random() * 25 + 3).toFixed(1)}k`, comments: `${Math.floor(Math.random() * 1000 + 150)}`,
      isLocked: true, // Always locked in feed
    });
  }

  // Separate by type: photos first, then videos
  const sofiaPhotos = allPosts.filter(p => p.creator === 'sofia' && !p.isVideo);
  const sofiaVideos = allPosts.filter(p => p.creator === 'sofia' && p.isVideo);
  const ellePhotos = allPosts.filter(p => p.creator === 'elle' && !p.isVideo);
  const elleVideos = allPosts.filter(p => p.creator === 'elle' && p.isVideo);

  const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
  // Photos first, then videos
  const shuffledSofia = [...shuffle([...sofiaPhotos]), ...shuffle([...sofiaVideos])];
  const shuffledElle = [...shuffle([...ellePhotos]), ...shuffle([...elleVideos])];

  // Build final feed: photos first, during free period hide friend content
  const posts: any[] = isAgeVerified
    ? [
        ...shuffledSofia.slice(0, 6),
        { id: 'vazados', type: 'vazados' } as any,
        ...shuffledSofia.slice(6, 10),
        { id: 'friend-separator', type: 'separator' } as any,
        ...shuffledElle,
        ...shuffledSofia.slice(10),
      ]
    : [
        ...shuffledSofia.slice(0, 6),
        { id: 'vazados', type: 'vazados' } as any,
        ...shuffledSofia.slice(6),
      ];

  const handleCommentClick = (postId: number) => {
    if (!isAgeVerified) {
      onRequestAgeVerification();
    } else {
      setShowCommentPrompt(postId);
      setTimeout(() => setShowCommentPrompt(null), 2000);
    }
  };

  // Build feed items
  const feedItems = posts.map(p => {
    if (p.type === 'vazados') return { type: 'vazados' as const, data: null };
    if (p.type === 'separator') return { type: 'separator' as const, data: null };
    return { type: 'post' as const, data: p };
  });

  let sofiaLockedCount = 0;
  let elleLockedCount = 0;

  // Feed loading screen
  if (!feedReady) {
    return (
      <div className="max-w-2xl mx-auto py-16 flex flex-col items-center justify-center gap-6 animate-pulse">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[3px]" style={{ animation: 'spin 2s linear infinite' }}>
            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
              <span className="text-3xl">🔥</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Carregando conteúdos</p>
          <p className="text-zinc-600 text-[10px] uppercase tracking-[3px] mt-2">preparando tudo pra você...</p>
        </div>
        <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-amber-400" style={{ animation: 'loadBar 2s ease-in-out infinite' }} />
        </div>
        {/* Skeleton cards */}
        <div className="w-full space-y-6 mt-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse" />
                <div className="space-y-2 flex-1"><div className="h-3 bg-zinc-800 rounded w-28 animate-pulse" /><div className="h-2 bg-zinc-800/60 rounded w-16 animate-pulse" /></div>
              </div>
              <div className="px-5 mb-3"><div className="h-3 bg-zinc-800/50 rounded w-3/4 animate-pulse" /></div>
              <div className="aspect-[4/3] bg-zinc-800 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent" style={{ animation: 'shimmer 1.5s infinite' }} />
              </div>
              <div className="p-4 flex gap-6"><div className="h-3 bg-zinc-800 rounded w-16 animate-pulse" /><div className="h-3 bg-zinc-800 rounded w-16 animate-pulse" /></div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes loadBar { 0% { width: 0%; } 50% { width: 80%; } 100% { width: 100%; } }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12" style={{ animation: 'feedReveal 0.6s ease-out' }}>
      <style>{`@keyframes feedReveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {feedItems.map((item, idx) => {
        if (item.type === 'vazados') {
          return <VazadosCard key="vazados" onOpen={onOpenVazados} onOpenVip={onOpenSubscription} vipPrice={`DESBLOQUEAR — ${vipPrice}`} isFreePeriod={!isAgeVerified} />;
        }

        if (item.type === 'separator') {
          return (
            <div key="friend-sep" className="relative py-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pink-500/30"></div></div>
              <div className="relative flex justify-center">
                <span className="bg-zinc-950 px-6 py-2 text-pink-400 font-black uppercase text-sm tracking-wider flex items-center gap-2 rounded-full border border-pink-500/20">
                  👯‍♀️ Conteúdos da minha amiga
                </span>
              </div>
            </div>
          );
        }

        const post = item.data;
        if (!post) return null;
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
                    <VideoPreview src={post.mediaUrl} blurLevel={getBlurLevel(currentLockedIdx)} onUnlock={onLockClick} likes={post.likes} vipPrice={lockMessage || `DESBLOQUEAR — ${vipPrice}`} />
                  ) : (
                    <>
                      <LazyMedia src={post.mediaUrl} isVideo={false} className="absolute inset-0 w-full h-full object-cover" style={{ filter: `blur(${getBlurLevel(currentLockedIdx)}px)` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent"></div>
                      {getBlurLevel(currentLockedIdx) >= 8 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                          <Lock className="w-8 h-8 text-pink-400 mb-3 drop-shadow-lg" />
                          <button onClick={onLockClick}
                            className={`${isAgeVerified ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white py-2.5 px-6 rounded-xl font-black uppercase text-xs shadow-lg active:scale-[0.97] transition-transform`}>
                            {lockMessage || `DESBLOQUEAR — ${vipPrice}`}
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
                    <LazyMedia src={post.mediaUrl} isVideo={true} className="w-full max-h-[700px] object-contain" videoProps={{ controls: true, playsInline: true, controlsList: 'nodownload' }} />
                  ) : (
                    <LazyMedia src={post.mediaUrl} isVideo={false} className="w-full h-auto max-h-[800px] object-contain" />
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
            </div>

            {/* Fake comments (visible after age verification) */}
            {isAgeVerified && (
              <div className="px-4 pb-3 space-y-2 border-t border-zinc-800/30">
                {FAKE_COMMENTS.slice((post.id * 3) % FAKE_COMMENTS.length, (post.id * 3) % FAKE_COMMENTS.length + 2).map((c, ci) => (
                  <div key={ci} className="flex items-start gap-2 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] shrink-0">{c.emoji}</div>
                    <div>
                      <span className="text-white text-xs font-bold">{c.user}</span>
                      <span className="text-zinc-400 text-xs ml-2">{c.text}</span>
                    </div>
                  </div>
                ))}
                {/* Comment input - VIP only */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/30">
                  <input
                    type="text"
                    placeholder={isVip ? "Adicione um comentário..." : "💎 Apenas VIPs podem comentar"}
                    readOnly={!isVip}
                    onClick={() => { if (!isVip) onOpenSubscription(); }}
                    className="flex-1 bg-zinc-800/50 text-zinc-400 text-xs px-3 py-2 rounded-lg border border-zinc-700/50 outline-none placeholder-zinc-600 cursor-pointer"
                  />
                  {!isVip && <Lock className="w-4 h-4 text-pink-400 shrink-0" />}
                </div>
              </div>
            )}

            {/* Comment prompt toast */}
            {showCommentPrompt === post.id && (
              <div className="px-4 pb-3">
                <span className={`text-xs font-bold ${isAgeVerified ? 'text-pink-400' : 'text-blue-400'} animate-fade-in`}>
                  {isAgeVerified ? '💎 Apenas VIPs podem comentar' : '🔐 Verifique sua idade primeiro'}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Live Section Card */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-56 md:h-72 w-full overflow-hidden">
          <video
            src="https://secreto.meuprivacy.digital/nataliexking/video10.mp4"
            autoPlay muted loop playsInline
            className={`w-full h-full object-cover ${!isAgeVerified ? 'blur-[12px]' : !isVip ? 'blur-[6px]' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"></div>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-black uppercase tracking-widest">AO VIVO</span>
          </div>
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-[10px] font-bold backdrop-blur-sm">
            👁 {Math.floor(Math.random() * 300 + 200)} assistindo
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-10 h-10 text-white mx-auto mb-3 drop-shadow-lg" />
              {!isAgeVerified ? (
                <>
                  <p className="text-white font-black text-lg uppercase tracking-tight mb-3">
                    🔴 Sofia está ao vivo
                  </p>
                  <a href="https://wa.me/" target="_blank" rel="noopener"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-xl font-black uppercase text-sm shadow-lg active:scale-[0.97] transition-transform inline-flex items-center gap-2">
                    💬 COMPRAR NO WHATSAPP
                  </a>
                </>
              ) : (
                <>
                  <p className="text-white font-black text-lg uppercase tracking-tight mb-3">
                    😈 Conteúdo VIP
                  </p>
                  <button
                    onClick={onOpenSubscription}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-8 rounded-xl font-black uppercase text-sm shadow-lg active:scale-[0.97] transition-transform">
                    ASSISTIR AO VIVO — {vipPrice}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-white font-bold">Sofia Oliveira está ao vivo agora 🔴</p>
          <p className="text-zinc-500 text-xs mt-1">Conteúdo exclusivo em tempo real</p>
        </div>
      </div>
    </div>
  );
};

// Fake comments pool
const FAKE_COMMENTS = [
  { emoji: '🔥', user: 'marcos_rj', text: 'gata demais 😍' },
  { emoji: '💕', user: 'rafael_sp', text: 'cada dia mais linda' },
  { emoji: '😈', user: 'pedro_mg', text: 'esse conteúdo é outro nível' },
  { emoji: '🤤', user: 'lucas_ba', text: 'perfeita demais' },
  { emoji: '💋', user: 'andre_pr', text: 'meu deus que mulher' },
  { emoji: '🍑', user: 'carlos_ce', text: 'não aguento mais 🔥' },
  { emoji: '👀', user: 'thiago_rs', text: 'finalmente desbloqueei, valeu muito' },
  { emoji: '💎', user: 'bruno_sc', text: 'VIP vale cada centavo' },
  { emoji: '🔞', user: 'felipe_go', text: 'conteúdo pesado hein 🤫' },
  { emoji: '😏', user: 'gustavo_pe', text: 'quero mais disso' },
  { emoji: '🥵', user: 'ricardo_am', text: 'socorro essa mulher' },
  { emoji: '💰', user: 'vinicius_ma', text: 'melhor investimento do mês' },
];

export default Feed;
