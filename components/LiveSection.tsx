
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Gem, Radio } from './Icons';

interface LiveSectionProps {
  isVip: boolean;
  onOpenSubscription: () => void;
}

const LiveSection: React.FC<LiveSectionProps> = ({ isVip, onOpenSubscription }) => {
  const [messages, setMessages] = useState([
    { user: 'Master_SP', text: 'Você é perfeita Sofia! 🔥', color: 'text-blue-400' },
    { user: 'LoverBoy', text: 'Que delícia de lingerie...', color: 'text-pink-400' },
    { user: 'VipKing', text: 'Mandei presente, faz pose! 💎', color: 'text-amber-400', isTip: true },
  ]);
  const [viewers, setViewers] = useState(14580);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['Safadinho', 'TopFã', 'Rich_Guy', 'Ghost', 'Anônimo'];
      const msgs = ['Dá uma voltinha!', 'Mostra os pés...', 'Linda demais', 'Vem pv?', 'Tira tudo!'];
      const newMsg = {
        user: users[Math.floor(Math.random() * users.length)],
        text: msgs[Math.floor(Math.random() * msgs.length)],
        color: 'text-zinc-400',
        isTip: Math.random() > 0.90
      };
      setMessages(prev => [...prev.slice(-15), newMsg]);
      setViewers(v => v + Math.floor(Math.random() * 50) - 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Se NÃO é VIP, mostra tela bloqueada
  if (!isVip) {
    return (
      <div className="relative h-[calc(100vh-200px)] min-h-[500px] overflow-hidden rounded-xl border border-zinc-800 bg-black">
        {/* Preview do vídeo — blur leve pra criar desejo */}
        <div className="absolute inset-0">
          <video 
            src="https://secreto.meuprivacy.digital/acesso/video24.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-40 scale-105"
            style={{ filter: 'blur(8px)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/30"></div>
        </div>

        {/* Badge AO VIVO */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-600/90 backdrop-blur px-3 py-1.5 rounded-full border border-red-400/30 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
          <span className="text-white font-black text-sm">AO VIVO</span>
          <span className="text-white/70 text-xs border-l border-white/30 pl-2 ml-1">{(viewers / 1000).toFixed(1)}k</span>
        </div>

        {/* Conteúdo bloqueado */}
        <div className="absolute inset-0 flex items-center justify-center z-20 p-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center max-w-lg w-full shadow-2xl backdrop-blur-xl animate-fade-in-up">
            <div className="w-20 h-20 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 relative">
              <Lock className="w-10 h-10 text-red-400" />
              <div className="absolute -top-1 -right-1">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
            </div>

            <h2 className="text-white font-black text-2xl md:text-3xl uppercase italic tracking-tighter mb-3 leading-tight">
              LIVE <span className="text-red-400">AO VIVO</span>
            </h2>
            
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-4">
              Sofia está <span className="text-red-400 font-bold">ao vivo agora</span> fazendo tudo que pedem no chat... sem censura nenhuma 🔥
            </p>

            {/* Social proof na live */}
            <div className="bg-zinc-950 rounded-xl p-3 mb-5 border border-zinc-800">
              <p className="text-pink-400 text-xs font-bold">🔥 {Math.floor(Math.random() * 20) + 30} pessoas desbloquearam nos últimos 30 min</p>
              <p className="text-zinc-500 text-[10px] mt-1">Desbloqueia pra assistir e interagir no chat</p>
            </div>

            {/* Info badges */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
                <span className="text-lg">📹</span>
                <p className="text-[9px] text-red-400 font-bold uppercase mt-1">Lives<br/>Diárias</p>
              </div>
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
                <span className="text-lg">💬</span>
                <p className="text-[9px] text-red-400 font-bold uppercase mt-1">Chat<br/>Exclusivo</p>
              </div>
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
                <span className="text-lg">🔞</span>
                <p className="text-[9px] text-red-400 font-bold uppercase mt-1">Sem<br/>Censura</p>
              </div>
            </div>

            <button 
              onClick={onOpenSubscription}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white py-4 rounded-xl font-black uppercase text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(236,72,153,0.3)] flex justify-center items-center gap-3"
            >
              <Gem size={18} className="fill-white" />
              DESBLOQUEAR — R$ 4,50
            </button>
            
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-3">
              ✨ Acesso imediato • Lives + Fotos + Vídeos
            </p>
          </div>
        </div>

        {/* Chat preview (parcialmente visível pra criar FOMO) */}
        <div className="absolute right-0 top-0 bottom-0 w-80 hidden lg:flex flex-col bg-zinc-900/60 backdrop-blur-lg border-l border-zinc-800 opacity-50">
          <div className="p-3 border-b border-zinc-800 font-bold text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Chat ao Vivo 🔒
          </div>
          <div className="flex-1 overflow-hidden p-3 space-y-3 blur-[3px]">
            {messages.slice(0, 5).map((msg, idx) => (
              <div key={idx} className="text-sm">
                <span className={`font-bold ${msg.color} mr-2`}>{msg.user}:</span>
                <span className="text-zinc-500">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Se É VIP, mostra a live normalmente
  return (
    <div className="relative h-[calc(100vh-200px)] min-h-[500px] overflow-hidden rounded-xl border border-zinc-800 bg-black flex flex-col lg:flex-row">
      <div className="flex-1 bg-black relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-700">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          <span className="text-white font-bold text-sm">AO VIVO</span>
          <span className="text-zinc-400 text-xs border-l border-zinc-600 pl-2 ml-1">{(viewers / 1000).toFixed(1)}k assistindo</span>
        </div>

        {/* Vídeo da Live Sofia */}
        <video 
          src="https://secreto.meuprivacy.digital/acesso/video24.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-4 left-4 z-10 hidden md:block">
           <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Meta do Show</p>
              <p className="text-sm">Ficar totalmente pelada: 2500/5000 💎</p>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-80 bg-zinc-900 flex flex-col border-l border-zinc-800">
        <div className="p-3 border-b border-zinc-800 font-bold text-zinc-300">Chat Exclusivo</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`text-sm ${msg.isTip ? 'bg-amber-400/10 p-2 rounded border border-amber-400/20' : ''}`}>
              <span className={`font-bold ${msg.color} mr-2`}>{msg.user}:</span>
              <span className="text-zinc-300">{msg.text}</span>
              {msg.isTip && <span className="block text-amber-500 text-[10px] font-bold mt-1">Enviou Presente 💎</span>}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <input 
                disabled 
                placeholder="Envie uma mensagem..." 
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full py-2 px-4 text-xs text-white opacity-50 cursor-not-allowed"
            />
            <button className="bg-zinc-800 p-2 rounded-full opacity-50"><Lock size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSection;
