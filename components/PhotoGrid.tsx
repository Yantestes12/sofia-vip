
import React, { useState } from 'react';
import { Lock, Heart, ImageIcon, X, Gem } from './Icons';

interface PhotoGridProps {
  isVip: boolean;
  onUnlock: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ isVip, onUnlock }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // 30 photos from Sofia + 30 from Camila
  const sofiaPhotos = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    url: `https://secreto.meuprivacy.digital/nataliexking/foto${i + 1}.webp`,
    isLocked: i >= 8, // first 8 free, rest locked
    creator: 'sofia' as const,
  }));

  const camilaPhotos = Array.from({ length: 30 }, (_, i) => ({
    id: 100 + i,
    url: `https://secreto.meuprivacy.digital/acesso/foto${i + 1}.jpg`,
    isLocked: i >= 5, // first 5 free, rest locked
    creator: 'camila' as const,
  }));

  const allPhotos = [...sofiaPhotos, ...camilaPhotos];

  const handleClick = (photo: typeof allPhotos[0]) => {
    const locked = photo.isLocked && !isVip;
    if (locked) {
      onUnlock();
    } else {
      setSelectedPhoto(photo.id);
    }
  };

  const selected = allPhotos.find(p => p.id === selectedPhoto);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sofia section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-lg">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-400" /> Sofia Oliveira
        </h3>
        <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full border border-amber-500/20">
          30 FOTOS
        </span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {sofiaPhotos.map((photo) => {
          const locked = photo.isLocked && !isVip;
          return (
            <div key={photo.id} className="relative aspect-[3/4] group overflow-hidden bg-zinc-900 rounded-xl cursor-pointer border border-zinc-800/50 hover:border-pink-400/50 transition-all shadow-md"
              onClick={() => handleClick(photo)}>
              <div className="absolute inset-0 z-20 bg-transparent"></div>
              <img src={photo.url} alt="" loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${locked ? '' : 'opacity-90 group-hover:opacity-100'}`}
                style={locked ? { filter: 'blur(12px)', opacity: 0.5 } : {}} />
              {locked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-30">
                  <Lock className="w-5 h-5 text-blue-400 mb-1 drop-shadow-lg" />
                  <span className="bg-blue-500/90 text-white px-2 py-0.5 rounded-md font-black text-[7px] uppercase shadow-lg">
                    🔐 VERIFICAR IDADE
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Camila section */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-lg mt-8">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-pink-400" /> 👯‍♀️ Camila Elle
        </h3>
        <span className="bg-pink-500/10 text-pink-400 text-xs font-black px-4 py-1.5 rounded-full border border-pink-500/20">
          30 FOTOS
        </span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {camilaPhotos.map((photo) => {
          const locked = photo.isLocked && !isVip;
          return (
            <div key={photo.id} className="relative aspect-[3/4] group overflow-hidden bg-zinc-900 rounded-xl cursor-pointer border border-zinc-800/50 hover:border-pink-400/50 transition-all shadow-md"
              onClick={() => handleClick(photo)}>
              <div className="absolute inset-0 z-20 bg-transparent"></div>
              <img src={photo.url} alt="" loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${locked ? '' : 'opacity-90 group-hover:opacity-100'}`}
                style={locked ? { filter: 'blur(12px)', opacity: 0.5 } : {}} />
              {locked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-30">
                  <Lock className="w-5 h-5 text-blue-400 mb-1 drop-shadow-lg" />
                  <span className="bg-blue-500/90 text-white px-2 py-0.5 rounded-md font-black text-[7px] uppercase shadow-lg">
                    🔐 VERIFICAR IDADE
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full view modal */}
      {selected && (
        <div className="fixed inset-0 w-screen h-screen z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-6 right-6 z-[110] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"><X size={24}/></button>
          <div className="relative max-h-screen max-w-5xl" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="absolute inset-0 z-10 bg-transparent"></div>
            <img src={selected.url} className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl border border-zinc-800" alt="" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
