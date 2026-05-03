
import React, { useState, useRef, useEffect } from 'react';
import { Play, Lock, Video as VideoIcon, X, Gem } from './Icons';

interface VideoGalleryProps {
  isVip: boolean;
  isFreePeriod?: boolean;
  onUnlock: () => void;
}

// Stable durations per video (seeded, not random on each render)
const SOFIA_DURATIONS = [
  '3:42', '5:18', '2:56', '4:31', '6:12', '3:07', '7:45', '4:23',
  '5:51', '2:33', '6:08', '3:49', '4:17', '5:02', '3:28', '7:11'
];
const CAMILA_DURATIONS = [
  '4:15', '3:38', '5:44', '2:49', '6:21', '3:55', '4:08', '5:32',
  '3:12', '6:47', '4:39', '2:58', '5:16', '3:43', '7:02'
];
const SOFIA_VIEWS = [
  '142k', '89k', '231k', '67k', '178k', '54k', '312k', '95k',
  '203k', '41k', '156k', '73k', '118k', '86k', '49k', '267k'
];
const CAMILA_VIEWS = [
  '98k', '62k', '145k', '38k', '112k', '71k', '89k', '134k',
  '53k', '167k', '44k', '78k', '103k', '56k', '189k'
];

// Lazy video thumbnail — only loads video when scrolled into view
const LazyVideoThumb: React.FC<{ src: string; locked: boolean }> = ({ src, locked }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !ref.current) return;
    const vid = ref.current;
    const onLoaded = () => setHasFrame(true);
    vid.addEventListener('loadeddata', onLoaded);
    return () => vid.removeEventListener('loadeddata', onLoaded);
  }, [isVisible]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-zinc-950">
      {isVisible && (
        <video
          ref={ref}
          src={`${src}#t=1.5`}
          muted
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover transition-all duration-500 ${
            hasFrame ? 'opacity-100' : 'opacity-0'
          } ${locked ? 'blur-[12px] scale-105' : ''}`}
          style={locked ? { opacity: 0.4 } : {}}
        />
      )}
      {/* Loading skeleton while frame loads */}
      {!hasFrame && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
          <VideoIcon className="w-8 h-8 text-zinc-700" />
        </div>
      )}
    </div>
  );
};

const VideoGallery: React.FC<VideoGalleryProps> = ({ isVip, isFreePeriod, onUnlock }) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videoTitles = [
    "Gemendo alto no chuveiro 🚿", "Teste de flexibilidade na cama 🤸‍♀️", "POV: Sou sua vizinha safada 🚪",
    "Gozei muito rápido nesse... 🤫", "Brincadeirinha com o brinquedo novo 🎥", "Aulas de sexo prático 🔞",
    "O que eu faço quando estou carente... 😈", "Masturbação intensa no sofá 🛋️", "Ficando toda molhadinha pra você 💦",
    "Sentando com força total (POV) 🍑", "Experiência 4K: Minha primeira vez por trás 🎬", "Preview: Safadeza na sala 🔞",
    "Garganta profunda sem limites 🍌", "Brincando com o gelo no mamilo 🧊", "Striptease lento só pra você 👗",
    "Lingerie transparente e muito tesão ❤️",
  ];

  // Sofia videos (16) — stable thumbs & durations
  const sofiaVideos = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    title: videoTitles[i % videoTitles.length],
    url: `https://secreto.meuprivacy.digital/nataliexking/${i === 0 ? 'video' : `video${i}`}.mp4`,
    duration: SOFIA_DURATIONS[i],
    views: SOFIA_VIEWS[i],
    locked: isFreePeriod ? (i >= 12) : (i >= 4), // Free: 12 unlocked, After: 4 unlocked
    creator: 'sofia' as const,
  }));

  // Camila videos (15) — stable thumbs & durations
  const camilaVideos = Array.from({ length: 15 }, (_, i) => ({
    id: 100 + i,
    title: `Camila Elle - Vídeo Exclusivo #${i + 1} 🔥`,
    url: `https://secreto.meuprivacy.digital/acesso/video${i + 1}.mp4`,
    duration: CAMILA_DURATIONS[i],
    views: CAMILA_VIEWS[i],
    locked: isFreePeriod ? (i >= 6) : (i >= 3), // Free: 6 unlocked, After: 3 unlocked
    creator: 'camila' as const,
  }));

  const allVideos = [...sofiaVideos, ...camilaVideos];

  const handleClick = (video: typeof allVideos[0]) => {
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

  const selected = allVideos.find(v => v.id === selectedVideo);

  const renderVideoCard = (video: typeof allVideos[0]) => {
    const locked = video.locked && !isVip;
    return (
      <div key={video.id}
        className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group hover:border-pink-400/50 transition-all cursor-pointer shadow-lg"
        onClick={() => handleClick(video)}>
        <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
          <LazyVideoThumb src={video.url} locked={locked} />
          
          <div className="relative z-10 transition-transform group-hover:scale-110">
            {locked ? (
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 ${isFreePeriod ? 'bg-green-500/20 border-green-500/30' : 'bg-pink-500/20 border-pink-500/30'} backdrop-blur-md rounded-full flex items-center justify-center border shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                  <Lock className={`w-7 h-7 ${isFreePeriod ? 'text-green-400' : 'text-pink-400'}`} />
                </div>
                <span className={`mt-2 ${isFreePeriod ? 'bg-green-500/90' : 'bg-pink-500/90'} text-white px-3 py-1 rounded-full font-black text-[9px] uppercase shadow-lg`}>
                  {isFreePeriod ? '💬 COMPRE NO WHATSAPP' : '😈 DESBLOQUEAR VIP'}
                </span>
              </div>
            ) : (
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:bg-pink-500 transition-all border border-white/20 shadow-2xl">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            )}
          </div>

          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-black text-white border border-white/10 z-10">
            {video.duration}
          </div>

          {locked && (
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-pink-400 border border-pink-500/20 z-10">
              🔥 {video.views} views
            </div>
          )}
        </div>
        <div className="p-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-pink-400 transition-colors line-clamp-1">
            {video.title}
          </h3>
          <p className="text-zinc-500 text-[10px] flex items-center gap-2 font-medium uppercase tracking-wider">
            <span>{video.views} VISUALIZAÇÕES</span>
            <span>•</span>
            <span className="text-pink-500/80">ULTRA HD 4K</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sofia section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-lg">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-amber-400" /> Sofia Oliveira
        </h3>
        <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full border border-amber-500/20">
          16 VÍDEOS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sofiaVideos.map(renderVideoCard)}
      </div>

      {/* Camila section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-lg mt-8">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-pink-400" /> 👯‍♀️ Camila Elle
        </h3>
        <span className="bg-pink-500/10 text-pink-400 text-xs font-black px-4 py-1.5 rounded-full border border-pink-500/20">
          15 VÍDEOS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {camilaVideos.map(renderVideoCard)}
      </div>

      {/* Video player modal */}
      {selected && (
        <div className="fixed inset-0 w-screen h-screen z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}>
          <button className="absolute top-6 right-6 z-50 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"><X size={24} /></button>
          <div className="w-full max-w-6xl max-h-screen relative flex flex-col items-center" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <video src={selected.url} controls autoPlay playsInline
              className="w-full h-full object-contain"
              controlsList="nodownload" />
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur px-4 py-1 rounded-full border border-white/10">
              <p className="text-white text-xs font-bold">{selected.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
