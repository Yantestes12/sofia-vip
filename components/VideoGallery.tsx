
import React, { useState } from 'react';
import { Play, Lock, Video as VideoIcon, X, Gem } from './Icons';

interface VideoGalleryProps {
  isVip: boolean;
  onUnlock: () => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ isVip, onUnlock }) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videoTitles = [
    "Gemendo alto no chuveiro 🚿", "Teste de flexibilidade na cama 🤸‍♀️", "POV: Sou sua vizinha safada 🚪",
    "Gozei muito rápido nesse... 🤫", "Brincadeirinha com o brinquedo novo 🎥", "Aulas de sexo prático 🔞",
    "O que eu faço quando estou carente... 😈", "Masturbação intensa no sofá 🛋️", "Ficando toda molhadinha pra você 💦",
    "Sentando com força total (POV) 🍑", "Experiência 4K: Minha primeira vez por trás 🎬", "Preview: Safadeza na sala 🔞",
    "Garganta profunda sem limites 🍌", "Brincando com o gelo no mamilo 🧊", "Striptease lento só pra você 👗",
    "Lingerie transparente e muito tesão ❤️",
  ];

  // Sofia videos (16)
  const sofiaVideos = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    title: videoTitles[i % videoTitles.length],
    url: `https://secreto.meuprivacy.digital/nataliexking/${i === 0 ? 'video' : `video${i}`}.mp4`,
    thumb: `https://secreto.meuprivacy.digital/nataliexking/foto${(i % 30) + 1}.webp`,
    duration: `${Math.floor(Math.random() * 8) + 2}:${Math.floor(Math.random() * 50) + 10}`,
    views: `${Math.floor(Math.random() * 250) + 30}k`,
    locked: i >= 4, // first 4 free
    creator: 'sofia' as const,
  }));

  // Camila videos (15)
  const camilaVideos = Array.from({ length: 15 }, (_, i) => ({
    id: 100 + i,
    title: `Camila Elle - Vídeo Exclusivo #${i + 1} 🔥`,
    url: `https://secreto.meuprivacy.digital/acesso/video${i + 1}.mp4`,
    thumb: `https://secreto.meuprivacy.digital/acesso/foto${(i % 30) + 1}.jpg`,
    duration: `${Math.floor(Math.random() * 8) + 2}:${Math.floor(Math.random() * 50) + 10}`,
    views: `${Math.floor(Math.random() * 200) + 20}k`,
    locked: i >= 3, // first 3 free
    creator: 'camila' as const,
  }));

  const allVideos = [...sofiaVideos, ...camilaVideos];

  const handleClick = (video: typeof allVideos[0]) => {
    if (video.locked && !isVip) {
      onUnlock();
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
          <video src={`${video.url}#t=1`} muted playsInline preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${locked ? '' : 'opacity-60 group-hover:opacity-80'}`}
            style={locked ? { filter: 'blur(12px)', opacity: 0.4 } : {}} />
          
          <div className="relative z-10 transition-transform group-hover:scale-110">
            {locked ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <Lock className="w-7 h-7 text-blue-400" />
                </div>
                <span className="mt-2 bg-blue-500/90 text-white px-3 py-1 rounded-full font-black text-[9px] uppercase shadow-lg">
                  🔐 VERIFICAR IDADE
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
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-blue-400 border border-blue-500/20 z-10">
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
