import React, { useState } from 'react';
import { ArrowLeft, Play, X, ShieldAlert, Lock } from './Icons';

interface SubmundoVazadoProps {
  accessId: string;
  onBack: () => void;
}

const SubmundoVazado: React.FC<SubmundoVazadoProps> = ({ accessId, onBack }) => {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'novinhas', name: 'NOVINHAS BR', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto20.webp', count: '42 VÍDEOS' },
    { id: 'amadores', name: 'CASEIROS REAIS', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto27.webp', count: '28 VÍDEOS' },
    { id: 'flagras', name: 'FLAGRAS OCULTOS', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto10.webp', count: '15 VÍDEOS' },
    { id: 'trans', name: 'SUBMUNDO TRANS', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto21.webp', count: '19 VÍDEOS' },
    { id: 'premium', name: 'PRIVADOS VIP', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto25.webp', count: '32 VÍDEOS' },
    { id: 'raros', name: 'ARQUIVOS RAROS', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto22.webp', count: '11 VÍDEOS' },
  ];

  const mediaList = [
    { title: 'Deficiente rabuda e gostosa, colocando dentro bem devagar nessa vadiazinha (RESTRITO)', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto22.webp' },
    { title: 'Primas e irmãs⁺¹⁸ se pegando em live, novinhas⁺¹⁸ brincando com seus corpos (VIRGENS⁺¹⁸)', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_2.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto20.webp' },
    { title: 'FEMBOY (TRANS)☠️❌\nMeu amigo Trans percebeu que eu sempre quis que ele me chupasse...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_3.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto21.webp' },
    { title: '❌⚠️DEFICIENTE⚠️❌\nEncostei minha mão na coxa dela, e ela fingiu que não tinha percebido...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_4.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto24.webp' },
    { title: 'Filho mostrando que sua mãe deixa ele encostar o p4u nela! o silêncio em casa, o pau bem duro encostando na mamãe...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_5.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto27.webp' },
    { title: 'Irmãos Baianos foram expostos na net, tinha medo colocar dentro da própria irmã, até hoje...🔥', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_6.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto8.webp' },
    { title: 'Verdade e desafio termina com irmã mamando o próprio irmão (IRMÃOS DE SANGUE MESMO) ‼️', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_7.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto2.webp' },
    { title: 'Estavam bebendo, mas ele nem percebeu que sua irmã estava mamando junto com sua namorada ☠️⚠️', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_8.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto1.webp' },
    { title: 'OCULTO - "sempre quis colocar a mão em seu pau..." Diz prima para o próprio primo', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_9.mp4', thumb: 'https://secreto.meuprivacy.digital/nataliexking/foto4.webp' },
  ];

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 pb-20 animate-fade-in">
      {/* Botão de Voltar */}
      <button 
        onClick={handleBack}
        className="fixed top-6 left-6 z-[100] p-3 rounded-full bg-zinc-900/80 border border-white/10 hover:bg-zinc-800 transition-all backdrop-blur-md shadow-2xl"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Cabeçalho de Título - Sempre visível mas adaptado */}
      <div className="pt-24 pb-12 px-6 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 border border-red-600/40 bg-red-600/10 px-6 py-1.5 rounded-full text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
          <div className="w-3.5 h-3.5 rounded-full border border-red-500 flex items-center justify-center text-[7px] font-black">✓</div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">
            ACESSO LIBERADO PELO SEU ID {accessId}
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
          {selectedCategory ? (
            <>CONTEÚDO <span className="text-red-600">{selectedCategory.split(' ')[0]}</span></>
          ) : (
            <>CONTEÚDO <span className="text-red-600">RESTRITO</span></>
          )}
        </h1>

        <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.3em] leading-relaxed max-w-xl mx-auto opacity-60">
          {selectedCategory 
            ? `ARQUIVOS RECUPERADOS DA CATEGORIA ${selectedCategory}` 
            : 'SELECIONE UMA CATEGORIA PARA ACESSAR OS ARQUIVOS DO SUBMUNDO.'}
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {!selectedCategory ? (
          /* GRADE DE CATEGORIAS (QUADRADOS) */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in-up">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className="group relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-zinc-800/50 hover:border-red-600/50 transition-all cursor-pointer shadow-2xl bg-zinc-900"
              >
                {/* Imagem de Fundo */}
                <img 
                  src={cat.thumb} 
                  alt={cat.name} 
                  className="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
                />
                
                {/* Overlay Escuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                {/* Conteúdo do Card */}
                <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end items-center text-center">
                  <h3 className="text-lg md:text-3xl font-black italic tracking-tighter uppercase leading-tight drop-shadow-2xl">
                    {cat.name}
                  </h3>
                  <div className="mt-2 md:mt-4 flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-600/30 backdrop-blur-md">
                    <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase text-red-500">{cat.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* GRADE DE VÍDEOS (LISTA APÓS CLIQUE) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
            {mediaList.map((media, idx) => (
              <div 
                key={idx} 
                className="group relative bg-zinc-900/10 rounded-[2rem] overflow-hidden border border-zinc-800/40 hover:border-red-600/50 transition-all cursor-pointer shadow-2xl"
                onClick={() => setSelectedMedia(media)}
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img 
                    src={media.thumb} 
                    alt="Preview" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center pl-1 shadow-[0_0_25px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform duration-500">
                      <Play size={28} className="text-white fill-white" />
                    </div>
                  </div>

                  {/* Tag Discreta no Vídeo */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ShieldAlert size={10} className="text-red-600" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white italic">PORTAL DESBLOQUEADO</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player Modal Simplificado */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[500] bg-black/98 flex items-center justify-center p-4 md:p-10 animate-fade-in" 
          onClick={() => setSelectedMedia(null)}
        >
          <button className="absolute top-8 right-8 z-[510] text-white bg-zinc-900/80 p-4 rounded-full border border-white/10 hover:bg-red-600 transition-all backdrop-blur-md">
            <X size={28} />
          </button>
          
          <div 
            className="w-full max-w-6xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.25)] border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <video 
              src={selectedMedia.url} 
              className="w-full h-full object-contain"
              autoPlay
              controls
              controlsList="nodownload"
              playsInline
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmundoVazado;