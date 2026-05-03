
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Lock, Video as VideoIcon, X, Gem } from './Icons';

interface VideoGalleryProps {
  isVip: boolean;
  isFreePeriod?: boolean;
  onUnlock: () => void;
}

interface VideoMeta {
  id: number;
  title: string;
  url: string;
  duration: number; // seconds — real from metadata
  durationLabel: string;
  views: string;
  locked: boolean;
  creator: 'sofia' | 'camila';
  ready: boolean; // frame loaded & video exists
  failed: boolean;
  thumbCanvas: string | null; // data URL from canvas capture
}

// ============================================================
// LAZY THUMB — captures real frame from video, shows skeleton
// Uses canvas capture for crisp thumbnail + quality enhancement
// ============================================================
const LazyThumb: React.FC<{
  video: VideoMeta;
  onMeta: (id: number, dur: number, thumbUrl: string) => void;
  onFail: (id: number) => void;
  locked: boolean;
}> = ({ video, onMeta, onFail, locked }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [thumb, setThumb] = useState<string | null>(video.thumbCanvas);

  // Lazy: only start loading when scrolled near
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '300px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Load video metadata + capture frame via canvas
  useEffect(() => {
    if (!visible || thumb) return;
    const vid = document.createElement('video');
    vid.crossOrigin = 'anonymous';
    vid.preload = 'metadata';
    vid.muted = true;
    vid.playsInline = true;
    vid.src = video.url + '#t=2';

    const handleError = () => onFail(video.id);

    const handleMeta = () => {
      // Seek to 2s for a good frame
      vid.currentTime = Math.min(2, vid.duration * 0.15);
    };

    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        // Render at higher res then display smaller = supersampling for quality
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
        // CORS or other error — use video element as fallback
        onMeta(video.id, vid.duration, '');
      }
      vid.remove();
    };

    vid.addEventListener('loadedmetadata', handleMeta);
    vid.addEventListener('seeked', handleSeeked);
    vid.addEventListener('error', handleError);
    vid.load();

    return () => {
      vid.removeEventListener('loadedmetadata', handleMeta);
      vid.removeEventListener('seeked', handleSeeked);
      vid.removeEventListener('error', handleError);
      vid.pause();
      vid.src = '';
    };
  }, [visible, thumb, video.url, video.id]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-zinc-950 overflow-hidden">
      {thumb ? (
        <img
          src={thumb}
          alt=""
          className={`w-full h-full object-cover transition-all duration-500 ${
            locked ? 'blur-[14px] scale-110 opacity-40' : 'opacity-100'
          }`}
          // CSS quality enhancement for compressed video thumbs
          style={{
            imageRendering: 'auto',
            filter: locked
              ? 'blur(14px) brightness(0.6)'
              : 'contrast(1.08) saturate(1.12) brightness(1.02)',
          }}
          draggable={false}
        />
      ) : visible ? (
        // Fallback: use video element directly while canvas captures
        <video
          ref={videoRef}
          src={`${video.url}#t=2`}
          muted
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover transition-opacity duration-500 opacity-0 ${
            locked ? 'blur-[14px] scale-110' : ''
          }`}
          style={locked ? { opacity: 0.4 } : {}}
          onLoadedData={(e) => {
            (e.target as HTMLVideoElement).style.opacity = '1';
          }}
        />
      ) : null}

      {/* Skeleton while loading */}
      {!thumb && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <VideoIcon className="w-6 h-6 text-zinc-700" />
            <div className="w-16 h-1 bg-zinc-800 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// VIDEO PLAYER MODAL — quality-enhanced playback
// ============================================================
const VideoPlayer: React.FC<{
  video: VideoMeta;
  onClose: () => void;
}> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[100] bg-black flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 z-50 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
        <X size={24} />
      </button>

      <div
        className="w-full h-full max-w-6xl max-h-[90vh] relative flex items-center justify-center mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading spinner */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-400 text-sm font-bold animate-pulse">Carregando vídeo...</p>
          </div>
        )}

        <video
          ref={videoRef}
          src={video.url}
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          className={`w-full h-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          // Quality enhancement CSS for compressed videos
          style={{
            filter: 'contrast(1.06) saturate(1.08)',
            imageRendering: 'auto',
          }}
          onCanPlay={() => setLoaded(true)}
        />

        {/* Title overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 max-w-[70%]">
          <p className="text-white text-sm font-bold truncate">{video.title}</p>
          <p className="text-zinc-400 text-[10px] font-medium">{video.durationLabel}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN GALLERY
// ============================================================
const formatDuration = (secs: number): string => {
  if (!secs || isNaN(secs)) return '--:--';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Stable view counts (seeded per index, not random each render)
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

const VideoGallery: React.FC<VideoGalleryProps> = ({ isVip, isFreePeriod, onUnlock }) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [videos, setVideos] = useState<VideoMeta[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Build initial video list
  useEffect(() => {
    const sofiaList: VideoMeta[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      title: videoTitles[i % videoTitles.length],
      url: `https://secreto.meuprivacy.digital/nataliexking/${i === 0 ? 'video' : `video${i}`}.mp4`,
      duration: 0,
      durationLabel: '--:--',
      views: VIEWS[i],
      locked: isFreePeriod ? (i >= 12) : (i >= 4),
      creator: 'sofia' as const,
      ready: false,
      failed: false,
      thumbCanvas: null,
    }));

    const camilaList: VideoMeta[] = Array.from({ length: 15 }, (_, i) => ({
      id: 100 + i,
      title: `Camila Elle - Vídeo Exclusivo #${i + 1} 🔥`,
      url: `https://secreto.meuprivacy.digital/acesso/video${i + 1}.mp4`,
      duration: 0,
      durationLabel: '--:--',
      views: VIEWS[16 + i] || VIEWS[i],
      locked: isFreePeriod ? (i >= 6) : (i >= 3),
      creator: 'camila' as const,
      ready: false,
      failed: false,
      thumbCanvas: null,
    }));

    setVideos([...sofiaList, ...camilaList]);
    setInitialized(true);
  }, [isFreePeriod]);

  // When metadata arrives from LazyThumb, update video info
  const handleMeta = useCallback((id: number, dur: number, thumbUrl: string) => {
    setVideos(prev => prev.map(v =>
      v.id === id ? { ...v, duration: dur, durationLabel: formatDuration(dur), ready: true, thumbCanvas: thumbUrl || v.thumbCanvas } : v
    ));
  }, []);

  const handleFail = useCallback((id: number) => {
    setVideos(prev => prev.map(v =>
      v.id === id ? { ...v, failed: true } : v
    ));
  }, []);

  const handleClick = (video: VideoMeta) => {
    if (video.failed) return;
    if (video.locked && !isVip) {
      if (isFreePeriod) {
        window.open('https://wa.me/', '_blank');
      } else {
        onUnlock();
      }
    } else {
      setSelectedVideo(video.id);
    }
  };

  // Sort: ready videos first sorted by duration (shortest→longest), then unready
  const sortByDuration = (list: VideoMeta[]) => {
    const working = list.filter(v => !v.failed);
    const ready = working.filter(v => v.ready && v.duration > 0);
    const notReady = working.filter(v => !v.ready || v.duration === 0);
    ready.sort((a, b) => a.duration - b.duration);
    return [...ready, ...notReady];
  };

  const sofiaVideos = sortByDuration(videos.filter(v => v.creator === 'sofia'));
  const camilaVideos = sortByDuration(videos.filter(v => v.creator === 'camila'));

  const selected = videos.find(v => v.id === selectedVideo);

  // Count ready videos
  const sofiaReady = sofiaVideos.filter(v => v.ready).length;
  const camilaReady = camilaVideos.filter(v => v.ready).length;

  const renderCard = (video: VideoMeta) => {
    const locked = video.locked && !isVip;
    if (video.failed) return null; // Don't show broken videos

    return (
      <div
        key={video.id}
        className={`bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group hover:border-pink-400/50 transition-all cursor-pointer shadow-lg ${
          !video.ready ? 'animate-pulse' : ''
        }`}
        onClick={() => handleClick(video)}
      >
        <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
          <LazyThumb video={video} onMeta={handleMeta} onFail={handleFail} locked={locked} />

          {/* Play / Lock overlay */}
          {video.ready && (
            <div className="relative z-10 transition-transform group-hover:scale-110">
              {locked ? (
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 ${isFreePeriod ? 'bg-green-500/20 border-green-500/30' : 'bg-pink-500/20 border-pink-500/30'} backdrop-blur-md rounded-full flex items-center justify-center border shadow-lg`}>
                    <Lock className={`w-6 h-6 ${isFreePeriod ? 'text-green-400' : 'text-pink-400'}`} />
                  </div>
                  <span className={`mt-2 ${isFreePeriod ? 'bg-green-500/90' : 'bg-pink-500/90'} text-white px-3 py-1 rounded-full font-black text-[8px] uppercase shadow-lg tracking-wide`}>
                    {isFreePeriod ? '💬 COMPRE NO ZAP' : '😈 VIP — R$ 16,90'}
                  </span>
                </div>
              ) : (
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:bg-pink-500 transition-all border border-white/20 shadow-2xl">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              )}
            </div>
          )}

          {/* Duration badge — only show real duration */}
          {video.ready && video.duration > 0 && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-black text-white z-10 tabular-nums">
              {video.durationLabel}
            </div>
          )}

          {/* Views badge on locked */}
          {locked && video.ready && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-pink-400 z-10">
              🔥 {video.views}
            </div>
          )}
        </div>

        <div className="p-3.5 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <h3 className="font-bold text-[13px] text-white mb-1 group-hover:text-pink-400 transition-colors line-clamp-1">
            {video.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
            <span>{video.views} views</span>
            <span className="w-0.5 h-0.5 bg-zinc-600 rounded-full" />
            {video.ready && video.duration > 0 ? (
              <span className="text-zinc-400">{video.durationLabel}</span>
            ) : (
              <span className="text-zinc-600">carregando...</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!initialized) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sofia section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-lg">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-amber-400" /> Sofia Oliveira
        </h3>
        <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full border border-amber-500/20">
          {sofiaReady > 0 ? `${sofiaReady} VÍDEOS` : 'CARREGANDO...'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sofiaVideos.map(renderCard)}
      </div>

      {/* Camila section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-lg mt-6">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-pink-400" /> 👯‍♀️ Camila Elle
        </h3>
        <span className="bg-pink-500/10 text-pink-400 text-xs font-black px-4 py-1.5 rounded-full border border-pink-500/20">
          {camilaReady > 0 ? `${camilaReady} VÍDEOS` : 'CARREGANDO...'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {camilaVideos.map(renderCard)}
      </div>

      {/* Video player modal */}
      {selected && <VideoPlayer video={selected} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

export default VideoGallery;
