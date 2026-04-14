
import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, X, Gem } from './Icons';

interface LeakAdCardProps {
  onClick: () => void;
  onVipClick: () => void;
}

const LeakAdCard: React.FC<LeakAdCardProps> = ({ onClick, onVipClick }) => {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Aparece após 8 segundos na página
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <>
      {/* MOBILE: Popup overlay fullscreen */}
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md md:hidden animate-fade-in">
        {/* Botão fechar */}
        <button
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          className="absolute top-6 right-6 z-[310] bg-zinc-800/80 p-2.5 rounded-full text-zinc-400 hover:text-white transition-colors border border-zinc-700"
        >
          <X size={20} />
        </button>

        <div 
          className="relative bg-zinc-950 border-2 border-red-600 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden w-full max-w-sm"
          onClick={onClick}
        >
          <div className="relative h-52 w-full overflow-hidden">
            <img 
              src="https://secreto.meuprivacy.digital/acesso/foto6.jpg" 
              alt="Leak" 
              className="w-full h-full object-cover blur-[4px] opacity-60 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-red-600/90 p-5 rounded-full border-2 border-white/20 backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-pulse">
                 <Lock className="w-10 h-10 text-white" />
               </div>
            </div>
            <div className="absolute top-4 -right-10 bg-red-600 text-white text-[10px] font-black uppercase py-1.5 w-40 text-center rotate-[45deg] shadow-lg border-y border-white/20 tracking-widest">
              VAZOU 2026
            </div>
          </div>

          <div className="p-6 bg-zinc-950 flex flex-col items-center text-center relative">
             <div className="absolute -top-4 bg-white text-red-600 text-[10px] font-black uppercase px-5 py-1.5 rounded-full shadow-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> ⚠️ MATERIAL RESTRITO
             </div>

             <h4 className="text-white font-black text-3xl leading-[0.9] mb-3 uppercase italic tracking-tighter mt-3">
                CONTEÚDO <br/> <span className="text-red-600">VAZADO</span>
             </h4>
             
             <p className="text-zinc-400 text-sm leading-tight mb-5 font-medium">
                Os vídeos mais proibidos do submundo acabaram de ser liberados...
             </p>
             
             <div className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl py-4 flex items-center justify-center transition-colors shadow-[0_0_30px_rgba(220,38,38,0.3)]">
               <span className="text-sm font-black uppercase italic tracking-wider">ACESSAR AGORA!</span>
             </div>

             <button 
               onClick={(e) => { e.stopPropagation(); onVipClick(); }}
               className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl py-3.5 flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(251,191,36,0.3)] mt-2"
             >
               <span className="text-sm font-black uppercase italic tracking-wider flex items-center gap-2"><Gem size={14} className="fill-black" /> DESBLOQUEAR VIP — R$ 6,90</span>
             </button>

             <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mt-3">
               ⚡ {Math.floor(Math.random() * 300 + 500)} pessoas acessando agora
             </p>
          </div>
        </div>
      </div>

      {/* DESKTOP: Card fixo no canto inferior direito */}
      <div className="hidden md:block fixed bottom-10 right-10 w-72 z-40 animate-fade-in-up">
        {/* Botão fechar desktop */}
        <button
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          className="absolute -top-3 -right-3 z-50 bg-zinc-800 p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors border border-zinc-700 shadow-lg"
        >
          <X size={14} />
        </button>

        <div 
          className="relative bg-zinc-950 border-2 border-red-600 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.3)] overflow-hidden hover:border-red-500 hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:scale-105 flex flex-col cursor-pointer"
          onClick={onClick}
        >
          <div className="relative h-44 w-full overflow-hidden">
            <img 
              src="https://secreto.meuprivacy.digital/acesso/foto6.jpg" 
              alt="Leak" 
              className="w-full h-full object-cover blur-[4px] opacity-60 hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-red-600/90 p-4 rounded-full border-2 border-white/20 backdrop-blur-sm shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse">
                 <Lock className="w-8 h-8 text-white" />
               </div>
            </div>
            <div className="absolute top-4 -right-10 bg-red-600 text-white text-[10px] font-black uppercase py-1.5 w-40 text-center rotate-[45deg] shadow-lg border-y border-white/20 tracking-widest">
              VAZOU 2026
            </div>
          </div>

          <div className="p-5 bg-zinc-950 flex flex-col items-center text-center relative">
             <div className="absolute -top-4 bg-white text-red-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> URGENTE
             </div>

             <h4 className="text-white font-black text-2xl leading-[0.9] mb-2 uppercase italic tracking-tighter mt-2">
                CONTEÚDO <br/> <span className="text-red-600">VAZADO</span>
             </h4>
             
             <p className="text-zinc-500 text-[11px] leading-tight mb-4 font-bold uppercase tracking-tight">
                Os Vídeos mais bizarros que você <br/> não encontrará em lugar nenhum
             </p>
             
             <div className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl py-4 flex items-center justify-center transition-colors shadow-lg">
               <span className="text-sm font-black uppercase italic tracking-wider">ACESSAR AGORA!</span>
             </div>

             <button 
               onClick={(e) => { e.stopPropagation(); onVipClick(); }}
               className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl py-3 flex items-center justify-center transition-colors shadow-lg mt-2"
             >
               <span className="text-xs font-black uppercase italic tracking-wider flex items-center gap-2"><Gem size={12} className="fill-black" /> DESBLOQUEAR VIP</span>
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeakAdCard;
