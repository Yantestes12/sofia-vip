
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Lock, Video as VideoIcon, X, Gem, ArrowLeft } from './Icons';

interface VideoGalleryProps {
  isVip: boolean;
  isFreePeriod?: boolean;
  onUnlock: () => void;
}

interface VideoMeta {
  id: number;
  title: string;
  url: string;
  duration: number;
  durationLabel: string;
  views: string;
  locked: boolean;
  creator: 'sofia' | 'camila';
  ready: boolean;
  failed: boolean;
  thumbCanvas: string | null;
  preloaded: boolean;
}

// Stable view counts
const VIEWS = [
  '142k','89k','231k','67k','178k','54k','312k','95k',
  '203k','41k','156k','73k','118k','86k','49k','267k',
  '98k','62k','145k','38k','112k','71k','89k','134k',
  '53k','167k','44k','78k','103k','56k','189k','72k',
];

const videoTitles = [
  "Gemendo alto no chuveiro 🚿", "Teste de flexibilidade na cama 🤸‍♀️", "POV: Sou sua vizinha safada 🚪",
  "Gozei muito rápido nesse... 🤫", "Brincadeirinha com o brinquedo novo 🎥", "Aulas de sexo prático 🔞",
  "O que eu faço quando estou carente... 😈", "Masturbação intensa no sofá 🛋️", "Ficando toda molhadinha pra você 💦",
  "Sentando com força total (POV) 🍑", "Experiência 4K: Minha primeira vez por trás 🎬", "Preview: Safadeza na sala 🔞",
  "Garganta profunda sem limites 🍌", "Brincando com o gelo no mamilo 🧊", "Striptease lento só pra você 👗",
  "Lingerie transparente e muito tesão ❤️",
];

const formatDuration = (secs: number): string => {
  if (!secs || isNaN(secs)) return '';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ============================================================
// LAZY THUMB — canvas frame capture
// ============================================================
const LazyThumb: React.FC<{
  video: VideoMeta;
  eager?: boolean; // true = load immediately (first 4)
  onMeta: (id: number, dur: number, thumbUrl: string) => void;
  onFail: (id: number) => void;
  locked: boolean;
}> = ({ video, eager, onMeta, onFail, locked }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager || false);
  const [thumb, setThumb] = useState<string | null>(video.thumbCanvas);

  useEffect(() => {
    if (eager) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '400px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!visible || thumb) return;
    const vid = document.createElement('video');
    vid.crossOrigin = 'anonymous';
    vid.preload = eager ? 'auto' : 'metadata';
    vid.muted = true;
    vid.playsInline = true;
    vid.src = video.url + '#t=2';

    const handleError = () => { onFail(video.id); vid.remove(); };
    const handleMeta = () => { vid.currentTime = Math.min(2, vid.duration * 0.15); };
    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = vid.videoWidth || 640;
        canvas.height = vid.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/webp', 0.85);
          setThumb(dataUrl);
          onMeta(video.id, vid.duration, dataUrl);
        }
      } catch {
        onMeta(video.id, vid.duration, '');
      }
      vid.remove();
    };

    vid.addEventListener('loadedmetadata', handleMeta);
    vid.addEventListener('seeked', handleSeeked);
    vid.addEventListener('error', handleError);
    vid.load();
    return () => { vid.pause(); vid.src = ''; };
  }, [visible, thumb, video.url, video.id, eager]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-zinc-950 overflow-hidden">
      {thumb ? (
        <img src={thumb} alt="" draggable={false}
          className={`w-full h-full object-cover transition-all duration-500 ${locked ? 'scale-110' : ''}`}
          style={{
            filter: locked ? 'blur(14px) brightness(0.5)' : 'contrast(1.08) saturate(1.12) brightness(1.02)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <VideoIcon className="w-6 h-6 text-zinc-700" />
            <div className="w-12 h-1 bg-zinc-800 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// WHATSAPP CONFIRMATION MODAL
// ============================================================
const WhatsAppModal: React.FC<{ onConfirm: () => void; onClose: () => void }> = ({ onConfirm, onClose }) => (
  <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in"
    onClick={onClose}>
    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in-up"
      onClick={e => e.stopPropagation()}>
      {/* Avatar */}
      <div className="w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden border-4 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <img src="https://secreto.meuprivacy.digital/nataliexking/foto1.webp" alt="Sofia" className="w-full h-full object-cover" />
      </div>

      <h3 className="text-white font-black text-xl mb-2 leading-tight">
        Quer desbloquear <span className="text-green-400">todos</span> os meus vídeos? 😈
      </h3>

      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
        Amor, me chama no WhatsApp que eu te mando a <span className="text-white font-bold">chave PIX</span> pra você pagar e eu libero <span className="text-green-400 font-bold">tudo</span> pra você agora mesmo 💕
      </p>

      {/* Benefícios */}
      <div className="bg-zinc-950 rounded-xl p-4 mb-6 border border-zinc-800 text-left space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-400">✓</span>
          <span className="text-zinc-300">Todos os vídeos desbloqueados</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-400">✓</span>
          <span className="text-zinc-300">Fotos exclusivas sem censura</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-400">✓</span>
          <span className="text-zinc-300">Acesso vitalício — pague uma vez só</span>
        </div>
      </div>

      <button onClick={onConfirm}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-black uppercase text-sm rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] active:scale-[0.97] transition-transform flex items-center justify-center gap-2 mb-3">
        💬 SIM, QUERO IR PRO WHATSAPP
      </button>

      <button onClick={onClose}
        className="w-full py-2.5 text-zinc-500 text-xs font-bold uppercase hover:text-zinc-300 transition-colors">
        Agora não
      </button>
    </div>
  </div>
);

// ============================================================
// VIDEO PLAYER — with swipe navigation
// ============================================================
const VideoPlayer: React.FC<{
  video: VideoMeta;
  playlist: VideoMeta[];
  onClose: () => void;
  onNavigate: (id: number) => void;
}> = ({ video, playlist, onClose, onNavigate }) => {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentIdx = playlist.findIndex(v => v.id === video.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < playlist.length - 1;

  const goPrev = () => { if (hasPrev) { setLoaded(false); onNavigate(playlist[currentIdx - 1].id); } };
  const goNext = () => { if (hasNext) { setLoaded(false); onNavigate(playlist[currentIdx + 1].id); } };

  // Touch swipe
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) { diff > 0 ? goNext() : goPrev(); }
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIdx]);

  return (
    <div className="fixed inset-0 w-screen h-screen z-[100] bg-black flex flex-col animate-fade-in"
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm z-20 shrink-0">
        <button onClick={onClose} className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 text-center px-4 min-w-0">
          <p className="text-white text-sm font-bold truncate">{video.title}</p>
          <p className="text-zinc-500 text-[10px]">{video.durationLabel} • {currentIdx + 1}/{playlist.length}</p>
        </div>
        <button onClick={onClose} className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Video area */}
      <div className="flex-1 relative flex items-center justify-center bg-black min-h-0">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-zinc-500 text-xs font-bold">Carregando...</p>
          </div>
        )}

        <video
          ref={videoRef}
          key={video.id}
          src={video.url}
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          className={`w-full h-full object-contain transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ filter: 'contrast(1.05) saturate(1.06)' }}
          onCanPlay={() => setLoaded(true)}
        />

        {/* Prev/Next tap zones */}
        {hasPrev && (
          <button onClick={goPrev}
            className="absolute left-0 top-0 bottom-0 w-16 z-10 flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
            style={{ touchAction: 'manipulation' }}>
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
              <ArrowLeft size={18} className="text-white" />
            </div>
          </button>
        )}
        {hasNext && (
          <button onClick={goNext}
            className="absolute right-0 top-0 bottom-0 w-16 z-10 flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
            style={{ touchAction: 'manipulation' }}>
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center rotate-180">
              <ArrowLeft size={18} className="text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Bottom nav: next video preview */}
      {hasNext && (
        <button onClick={goNext}
          className="shrink-0 flex items-center gap-3 px-4 py-3 bg-zinc-900/90 border-t border-zinc-800 hover:bg-zinc-800/90 transition-colors"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
          <div className="w-12 h-8 bg-zinc-800 rounded overflow-hidden shrink-0">
            {playlist[currentIdx + 1]?.thumbCanvas && (
              <img src={playlist[currentIdx + 1].thumbCanvas!} className="w-full h-full object-cover" alt="" />
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-zinc-400 text-[10px] font-bold uppercase">Próximo</p>
            <p className="text-white text-xs font-bold truncate">{playlist[currentIdx + 1]?.title}</p>
          </div>
          <div className="text-zinc-500 text-lg rotate-180 shrink-0">
            <ArrowLeft size={16} />
          </div>
        </button>
      )}
    </div>
  );
};

// ============================================================
// MAIN GALLERY
// ============================================================
const VideoGallery: React.FC<VideoGalleryProps> = ({ isVip, isFreePeriod, onUnlock }) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [videos, setVideos] = useState<VideoMeta[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  useEffect(() => {
    const sofiaList: VideoMeta[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      title: videoTitles[i % videoTitles.length],
      url: `https://secreto.meuprivacy.digital/nataliexking/${i === 0 ? 'video' : `video${i}`}.mp4`,
      duration: 0, durationLabel: '',
      views: VIEWS[i],
      locked: isFreePeriod ? (i >= 12) : (i >= 4),
      creator: 'sofia' as const,
      ready: false, failed: false, thumbCanvas: null, preloaded: false,
    }));

    const camilaList: VideoMeta[] = Array.from({ length: 15 }, (_, i) => ({
      id: 100 + i,
      title: `Camila Elle - Vídeo Exclusivo #${i + 1} 🔥`,
      url: `https://secreto.meuprivacy.digital/acesso/video${i + 1}.mp4`,
      duration: 0, durationLabel: '',
      views: VIEWS[16 + i] || VIEWS[i],
      locked: isFreePeriod ? (i >= 6) : (i >= 3),
      creator: 'camila' as const,
      ready: false, failed: false, thumbCanvas: null, preloaded: false,
    }));

    setVideos([...sofiaList, ...camilaList]);
    setInitialized(true);
  }, [isFreePeriod]);

  // Preload first 4 unlocked video files for instant playback
  useEffect(() => {
    if (!initialized) return;
    const unlocked = videos.filter(v => !v.locked && !v.failed && v.creator === 'sofia').slice(0, 4);
    unlocked.forEach(v => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = v.url;
      link.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(link);
    });
  }, [initialized, videos]);

  const handleMeta = useCallback((id: number, dur: number, thumbUrl: string) => {
    setVideos(prev => prev.map(v =>
      v.id === id ? { ...v, duration: dur, durationLabel: formatDuration(dur), ready: true, thumbCanvas: thumbUrl || v.thumbCanvas } : v
    ));
  }, []);

  const handleFail = useCallback((id: number) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, failed: true } : v));
  }, []);

  const handleClick = (video: VideoMeta) => {
    if (video.failed) return;
    if (video.locked && !isVip) {
      if (isFreePeriod) {
        setShowWhatsAppModal(true);
      } else {
        onUnlock();
      }
    } else if (video.ready) {
      setSelectedVideo(video.id);
    }
  };

  const confirmWhatsApp = () => {
    setShowWhatsAppModal(false);
    window.open('https://wa.me/', '_blank');
  };

  // Sort: ready sorted by duration (shortest first), then unready
  const sortByDuration = (list: VideoMeta[]) => {
    const working = list.filter(v => !v.failed);
    const ready = working.filter(v => v.ready && v.duration > 0);
    const notReady = working.filter(v => !v.ready || v.duration === 0);
    ready.sort((a, b) => a.duration - b.duration);
    return [...ready, ...notReady];
  };

  const sofiaVideos = sortByDuration(videos.filter(v => v.creator === 'sofia'));
  const camilaVideos = sortByDuration(videos.filter(v => v.creator === 'camila'));

  // Playable playlist for navigation (unlocked + ready)
  const playableVideos = [...sofiaVideos, ...camilaVideos].filter(v => !v.locked && v.ready && !v.failed);

  const selected = videos.find(v => v.id === selectedVideo);
  const sofiaReady = sofiaVideos.filter(v => v.ready).length;
  const camilaReady = camilaVideos.filter(v => v.ready).length;

  const renderCard = (video: VideoMeta, idx: number, creatorList: VideoMeta[]) => {
    const locked = video.locked && !isVip;
    if (video.failed) return null;

    // First 4 of each creator load eagerly
    const isEager = idx < 4;

    return (
      <div key={video.id}
        className={`bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group hover:border-pink-400/40 transition-all cursor-pointer shadow-lg ${!video.ready ? 'animate-pulse' : ''}`}
        onClick={() => handleClick(video)}>
        <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
          <LazyThumb video={video} eager={isEager} onMeta={handleMeta} onFail={handleFail} locked={locked} />

          {/* Overlay */}
          {video.ready && (
            <div className="relative z-10 transition-transform group-hover:scale-110">
              {locked ? (
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 ${isFreePeriod ? 'bg-green-500/20 border-green-500/30' : 'bg-pink-500/20 border-pink-500/30'} backdrop-blur-md rounded-full flex items-center justify-center border shadow-lg`}>
                    <Lock className={`w-6 h-6 ${isFreePeriod ? 'text-green-400' : 'text-pink-400'}`} />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:bg-pink-500 transition-all border border-white/20 shadow-2xl">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              )}
            </div>
          )}

          {/* Duration — ONLY on unlocked videos */}
          {video.ready && !locked && video.duration > 0 && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-black text-white z-10 tabular-nums">
              {video.durationLabel}
            </div>
          )}
        </div>

        <div className="p-3 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <h3 className="font-bold text-[13px] text-white mb-0.5 group-hover:text-pink-400 transition-colors line-clamp-1">
            {video.title}
          </h3>
          {locked ? (
            <p className={`text-[10px] font-black uppercase tracking-wider ${isFreePeriod ? 'text-green-400' : 'text-pink-400'}`}>
              {isFreePeriod ? '💬 Compre no WhatsApp' : '😈 VIP — R$ 16,90'}
            </p>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
              {video.duration > 0 && <span>{video.durationLabel}</span>}
              {video.duration > 0 && <span className="w-0.5 h-0.5 bg-zinc-600 rounded-full" />}
              <span>{video.views} views</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!initialized) return null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Sofia section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-amber-400" /> Sofia Oliveira
        </h3>
        <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-3 py-1 rounded-full border border-amber-500/20">
          {sofiaReady > 0 ? `${sofiaReady} vídeos` : '...'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sofiaVideos.map((v, i) => renderCard(v, i, sofiaVideos))}
      </div>

      {/* Camila section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 mt-4">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-pink-400" /> 👯‍♀️ Camila Elle
        </h3>
        <span className="bg-pink-500/10 text-pink-400 text-xs font-black px-3 py-1 rounded-full border border-pink-500/20">
          {camilaReady > 0 ? `${camilaReady} vídeos` : '...'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {camilaVideos.map((v, i) => renderCard(v, i, camilaVideos))}
      </div>

      {/* Video player with navigation */}
      {selected && (
        <VideoPlayer
          video={selected}
          playlist={playableVideos}
          onClose={() => setSelectedVideo(null)}
          onNavigate={(id) => setSelectedVideo(id)}
        />
      )}

      {/* WhatsApp confirmation modal */}
      {showWhatsAppModal && (
        <WhatsAppModal onConfirm={confirmWhatsApp} onClose={() => setShowWhatsAppModal(false)} />
      )}
    </div>
  );
};

export default VideoGallery;
