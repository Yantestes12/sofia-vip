
import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Timer, Play, X, Heart, Check, Copy, Gem } from './Icons';
import SubmundoVazado from './SubmundoVazado';
// VIP access stored in localStorage

interface ExclusiveLeakPageProps {
  onBack: () => void;
  leadLocation?: string;
}

interface PixResponse {
  id: string;
  qr_code: string;
  status: string;
  value: number;
  qr_code_base64: string;
}

const generateAccessId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const API_KEY = "nxp_live_bba943703263271e69dbbec5a94d8a3f9cb2a7ddc10ab4f7b817145a0b3c32a3";

const VAZADOS_PROMO_KEY = 'vazados_promo_start';

const PixPaymentModal = ({ onClose, onConfirm, accessId, currentPrice }: { onClose: () => void, onConfirm: (id: string) => void, accessId: string, currentPrice: number }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<{ qrcode: string, copiaCola: string, id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  // Timer de expiração do PIX
  useEffect(() => {
    let timer: any;
    if (pixData && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [pixData, timeLeft]);

  // Gerar PIX diretamente via NexusPag (proxy Vercel)
  useEffect(() => {
    const createPix = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('[PIX-Leak] Chamando NexusPag via proxy Vercel...');
        const response = await fetch('/api/pix/create', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ 
            amount: currentPrice,
            webhook_url: 'https://weebhooks.synio.com.br/webhook/receber-nexuspag'
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        const text = await response.text();
        console.log('[PIX-Leak] Resposta bruta NexusPag:', text);
        
        let data: any;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error('[PIX-Leak] Falha ao parsear JSON:', text);
          setError("Resposta inválida do servidor.");
          return;
        }

        console.log('[PIX-Leak] Resposta parseada:', JSON.stringify(data, null, 2));

        if (response.ok) {
          const tx = data.transaction || data.data || (Array.isArray(data) ? (data[0]?.transaction || data[0]) : data);
          console.log('[PIX-Leak] Objeto tx extraído:', JSON.stringify(tx, null, 2));
          
          const copiaCola = tx?.pix_copia_cola || tx?.qr_code || tx?.pixCopiaECola || tx?.brcode || tx?.emv || tx?.copy_paste || tx?.pix_copy_paste;
          const txId = tx?.id || tx?.txid || tx?.uuid || tx?.transaction_id;
          
          // QR code image: NexusPag retorna vazio, gera a partir do pix_copia_cola
          let qrCodeImage = tx?.qr_code_base64 || tx?.qrcode_base64 || tx?.qr_code_image;
          
          if ((!qrCodeImage || qrCodeImage === '') && copiaCola) {
            qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(copiaCola)}`;
            console.log('[PIX-Leak] QR code gerado via qrserver.com');
          }

          console.log('[PIX-Leak] Campos resolvidos:', { 
            qrCodeImage: qrCodeImage ? qrCodeImage.substring(0, 80) + '...' : null, 
            copiaCola: copiaCola ? copiaCola.substring(0, 80) + '...' : null, 
            txId,
            todasAsChaves: tx ? Object.keys(tx) : 'tx é null'
          });

          if (copiaCola) {
            const pixInfo = {
              qrcode: qrCodeImage && qrCodeImage.startsWith('data:') ? qrCodeImage : (qrCodeImage || ''),
              copiaCola: copiaCola,
              id: txId
            };
            setPixData(pixInfo);

            localStorage.setItem(`access_${accessId}`, JSON.stringify({
              pix_id: pixInfo.id,
              status: 'pending',
              createdAt: new Date().toISOString()
            }));
          } else {
            console.error('[PIX-Leak] COPIA E COLA FALTANDO! Chaves:', tx ? Object.keys(tx) : 'null');
            setError("PIX criado mas código copia e cola não retornado.");
          }
        } else {
          console.error('[PIX-Leak] HTTP erro:', response.status, data);
          setError(`Erro ${response.status}: ${data?.message || data?.error || 'Falha no servidor'}`);
        }
      } catch (err: any) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
          console.error('[PIX-Leak] Timeout de 30s!');
          setError("Timeout: servidor demorou demais. Recarregue a página.");
        } else {
          setError(err.message || 'Falha na conexão.');
        }
      } finally {
        setLoading(false);
      }
    };
    createPix();
  }, [accessId]);

  // Polling automático a cada 5 segundos
  useEffect(() => {
    let interval: any;
    if (pixData?.id) {
      interval = setInterval(() => {
        checkPaymentStatus(pixData.id, true);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [pixData]);

  const checkPaymentStatus = async (txId: string, isSilent = false) => {
    if (!isSilent) setIsVerifying(true);
    
    try {
      const response = await fetch(`/api/pix/${txId}`, {
        headers: { 'x-api-key': API_KEY }
      });
      const data = await response.json();
      console.log('[PIX-Leak] Consulta status:', JSON.stringify(data, null, 2));

      if (response.ok) {
        const tx = data.transaction || data.data || (Array.isArray(data) ? (data[0]?.transaction || data[0]) : data);
        const status = (tx?.status || data?.status || '').toUpperCase();
        
        if (status === 'PAID' || status === 'COMPLETED' || status === 'PAGO' || status === 'APPROVED') {
          localStorage.setItem(`access_${accessId}`, JSON.stringify({
            pix_id: txId,
            status: 'paid',
            paidAt: new Date().toISOString()
          }));
          onConfirm(accessId);
        } else if (!isSilent) {
          setError("Pagamento ainda não identificado. Aguarde alguns instantes.");
        }
      } else if (!isSilent) {
        setError("Erro ao consultar status. Tente novamente.");
      }
    } catch (err) {
      if (!isSilent) {
        setError("Falha ao verificar. Tente novamente.");
      }
    } finally {
      if (!isSilent) setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (!pixData?.copiaCola) return;
    const text = pixData.copiaCola;
    const fallback = () => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(fallback);
    } else { fallback(); }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-zinc-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up relative my-auto flex flex-col">
        <div className="bg-zinc-50/80 px-8 py-6 flex items-center justify-between border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white">
              <Check size={20} strokeWidth={4} />
            </div>
            <div>
              <h3 className="font-black uppercase text-lg leading-none">PAGAMENTO VIA PIX</h3>
              <p className="text-[9px] uppercase font-bold text-zinc-400 mt-1">ID ÚNICO: <span className="text-zinc-900">{accessId}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-300 hover:text-zinc-900"><X size={24} /></button>
        </div>

        <div className="px-8 pt-6 pb-4 flex flex-col items-center">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gerando PIX R$ {currentPrice.toFixed(2).replace('.', ',')}...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
              <p className="text-zinc-800 font-black uppercase italic">Erro de Conexão</p>
              <p className="text-zinc-400 text-xs mt-2">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-6 bg-zinc-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase">Reiniciar</button>
            </div>
          ) : pixData ? (
            <>
              <div className="text-center mb-6">
                <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">VALOR DO ACESSO</span>
                <div className="text-5xl font-black text-zinc-900 italic tracking-tighter">R$ {currentPrice.toFixed(2).replace('.', ',')}</div>
              </div>
              <div className="bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm mb-6">
                <img src={pixData.qrcode} alt="QR Code" className="w-48 h-48 object-contain" />
              </div>
              <button onClick={handleCopy} className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-2xl p-4 flex items-center justify-between mb-6 active:scale-95 transition-all">
                <Copy size={18} className="text-zinc-400" />
                <span className="text-[10px] font-mono font-bold text-zinc-500 truncate max-w-[150px] uppercase">{pixData.copiaCola.substring(0, 20)}...</span>
                <span className="text-[12px] font-black text-[#10b981] uppercase">{copied ? "COPIADO" : "COPIAR"}</span>
              </button>
              
              <button 
                onClick={() => checkPaymentStatus(pixData.id)}
                disabled={isVerifying}
                className="w-full bg-[#10b981] text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-sm mb-2 flex items-center justify-center gap-2"
              >
                {isVerifying && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {isVerifying ? "VERIFICANDO..." : "JÁ PAGUEI, LIBERAR SUBMUNDO"}
              </button>

              {error && (
                <p className="text-red-500 text-sm mb-2 font-bold text-center w-full bg-red-500/10 p-2 rounded-lg">{error}</p>
              )}

              <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-lg mt-4 mb-2">
                <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
              </div>
              <p className="text-zinc-400 text-[9px] mb-4 text-center">Verificação automática a cada 5s • Expira em 10 min</p>
            </>
          ) : null}
        </div>
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 text-center">
          <p className="text-[8px] text-zinc-400 uppercase font-bold tracking-tighter">Esta chave ID é única e será vinculada ao seu dispositivo permanentemente.</p>
        </div>
      </div>
    </div>
  );
};

const ExclusiveLeakPage: React.FC<ExclusiveLeakPageProps> = ({ onBack, leadLocation }) => {
  // Extrai só a cidade da localização (formato "Cidade, Estado")
  const cityName = leadLocation ? leadLocation.split(',')[0].trim() : '';
  const [showPixModal, setShowPixModal] = useState(false);
  const [pendingId, setPendingId] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [validatedId, setValidatedId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 45);

  // Timer de promoção Vazados: R$14,71 fixo
  const [promoSecondsLeft, setPromoSecondsLeft] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(14.71);

  useEffect(() => {
    const stored = localStorage.getItem(VAZADOS_PROMO_KEY);
    let startTime: number;

    if (stored) {
      startTime = parseInt(stored, 10);
    } else {
      startTime = Date.now();
      localStorage.setItem(VAZADOS_PROMO_KEY, startTime.toString());
    }

    const updatePromo = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const promoTotal = 6 * 60; // 6 minutos
      const remaining = promoTotal - elapsed;

      if (remaining > 0) {
        setPromoSecondsLeft(remaining);
      } else {
        setPromoSecondsLeft(0);
      }
      setCurrentPrice(14.71);
    };

    updatePromo();
    const interval = setInterval(updatePromo, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPromoActive = promoSecondsLeft > 0;

  const formatPromoTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleStartPurchase = () => {
    const newId = generateAccessId();
    setPendingId(newId);
    setShowPixModal(true);
    // Facebook Pixel: Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'vazados_submundo', value: currentPrice, currency: 'BRL' });
    }
  };

  const handleConfirmAccess = (id: string) => {
    setShowPixModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setValidatedId(id);
      setIsUnlocked(true);
      window.history.pushState({}, '', `?access=${encodeURIComponent(id)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3000);
  };



  if (isUnlocked) {
    return <SubmundoVazado accessId={validatedId} onBack={() => setIsUnlocked(false)} />;
  }

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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 pb-20">
      <div className="fixed top-0 left-0 w-full bg-red-600 py-1.5 px-4 text-center z-[120] border-b border-black/10">
        <span className="text-[10px] font-black uppercase tracking-[3px] animate-pulse">Acesso Restrito +18 - Portal de Vazamentos Oficiais</span>
      </div>

      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-red-900/30 pt-10">
        <div className="absolute inset-0">
          <img src="https://secreto.meuprivacy.digital/nataliexking/foto15.webp" className="w-full h-full object-cover opacity-20 blur-xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 py-20 space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/60 px-6 py-2 rounded-full text-red-500 animate-bounce">
            <AlertTriangle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Submundo Detectado</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">CONTEÚDO <br/> <span className="text-red-600">VAZADO</span></h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed">Os Vídeos mais bizarros do Submundo, aproveite antes que o acesso seja suspenso definitivamente!</p>
          
          {/* BONUS: Grupo VIP Garotas da Cidade */}
          <div className="bg-gradient-to-b from-pink-950/40 to-zinc-950/80 border-2 border-pink-500/40 rounded-3xl p-6 md:p-8 max-w-md mx-auto relative overflow-hidden shadow-[0_0_40px_rgba(236,72,153,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/5 to-purple-600/5"></div>
            <div className="absolute top-3 right-3">
              <span className="bg-pink-500 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full tracking-widest animate-pulse shadow-lg">BÔNUS GRÁTIS</span>
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto border border-pink-500/30">
                <span className="text-2xl">📹</span>
              </div>
              
              <h3 className="text-white font-black text-xl md:text-2xl uppercase italic tracking-tighter leading-tight">
                GRUPO VIP DE <span className="text-pink-400">GAROTAS</span> <br/>{cityName ? `DE ${cityName.toUpperCase()}` : 'DA SUA CIDADE'}
              </h3>
              
              <p className="text-zinc-300 text-sm leading-relaxed">
                Ao liberar o acesso, você também entra no <span className="text-pink-400 font-bold">grupo exclusivo</span> com garotas reais {cityName ? `de ${cityName}` : 'da sua cidade'}, <span className="text-white font-bold">loucas para fazer chamada de vídeo</span> e se encontrar pessoalmente! 🔥
              </p>

              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="bg-black/40 rounded-xl p-3 border border-pink-500/20 text-center">
                  <span className="text-lg">📱</span>
                  <p className="text-[9px] text-pink-300 font-bold uppercase mt-1">Chamadas<br/>de Vídeo</p>
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-pink-500/20 text-center">
                  <span className="text-lg">📍</span>
                  <p className="text-[9px] text-pink-300 font-bold uppercase mt-1">Garotas<br/>Perto de Você</p>
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-pink-500/20 text-center">
                  <span className="text-lg">🤫</span>
                  <p className="text-[9px] text-pink-300 font-bold uppercase mt-1">Encontros<br/>Reais</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-400">{(() => { const seed = parseInt(sessionStorage.getItem('leak_seed') || String(Math.floor(Math.random() * 80 + 120))); if (!sessionStorage.getItem('leak_seed')) sessionStorage.setItem('leak_seed', String(seed)); return seed; })()} garotas online agora {cityName ? `em ${cityName}` : 'na sua região'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-4">

            {/* Promo timer badge */}
            {isPromoActive ? (
              <div className="bg-gradient-to-r from-green-950/60 to-emerald-950/60 border-2 border-green-500/40 rounded-2xl px-8 py-5 backdrop-blur-xl flex flex-col items-center shadow-[0_0_30px_rgba(16,185,129,0.2)] w-full max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">PROMOÇÃO RELÂMPAGO ATIVA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Timer size={22} className="text-green-400" />
                  <span className="text-green-400 font-mono font-black text-3xl">{formatPromoTime(promoSecondsLeft)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-zinc-400 text-xs line-through">R$ 89,00</span>
                  <span className="text-green-400 font-black text-lg">R$ 14,71</span>
                </div>
                <p className="text-green-300/60 text-[9px] mt-1 font-bold">Promoção por tempo limitado — garanta agora!</p>
              </div>
            ) : (
              <div className="bg-red-950/40 border-2 border-red-500/30 rounded-2xl px-8 py-5 backdrop-blur-xl flex flex-col items-center w-full max-w-md">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">PROMOÇÃO ENCERRADA</span>
                </div>
                <p className="text-zinc-500 text-[10px]">O valor promocional de R$ 14,71 expirou</p>
              </div>
            )}

            <button onClick={handleStartPurchase} className="group relative w-full max-w-md">
              <div className="absolute -inset-1 bg-red-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-red-600 hover:bg-red-500 text-white font-black uppercase text-lg py-6 rounded-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4">
                <span>LIBERAR ACESSO</span>
                <span className="text-white/60 text-sm">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </button>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">✅ Vazados + Grupo VIP de Garotas inclusos</p>
          </div>
        </div>
        <button onClick={onBack} className="absolute top-16 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all z-20"><ArrowLeft size={24} /></button>
      </div>

      <div className="container mx-auto px-4 py-24">
         <div className="max-w-xl mx-auto space-y-32">
            {mediaList.map((media, idx) => (
              <div key={idx} className="space-y-8 group">
                <div className="text-center space-y-2">
                    <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em]">PRÉVIA OCULTA #{idx + 1}</p>
                    <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-zinc-100 whitespace-pre-line leading-tight">"{media.title}"</h2>
                </div>
                <div className="relative aspect-[9/16] rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl group-hover:border-red-600/50 transition-colors">
                    <video src={media.url} muted autoPlay loop playsInline className="w-full h-full object-cover grayscale-0 opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                       <Lock className="w-12 h-12 text-red-600 mb-4 group-hover:scale-125 transition-transform duration-500" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-lg">Acesso Bloqueado</p>
                    </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      {showPixModal && <PixPaymentModal accessId={pendingId} onClose={() => setShowPixModal(false)} onConfirm={handleConfirmAccess} currentPrice={currentPrice} />}

      {isProcessing && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
           <h3 className="text-white font-black text-2xl uppercase italic animate-pulse text-center">Sincronizando Chave ID...</h3>
        </div>
      )}
    </div>
  );
};

export default ExclusiveLeakPage;
