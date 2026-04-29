import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, ShieldAlert, Timer, Copy, Gem, AlertTriangle } from './Icons';

const PROMO_STORAGE_KEY = 'sofia_promo_start';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenVazados?: () => void;
  leadLocation?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, onOpenVazados, leadLocation }) => {
  const [step, setStep] = useState<'intro' | 'loading' | 'pix_generated' | 'verifying' | 'success' | 'upsell'>('intro');
  const [timeLeft, setTimeLeft] = useState(600);
  const [pixData, setPixData] = useState<{ qrcode: string, copiaCola: string, id: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [onlineCount] = useState(() => Math.floor(Math.random() * 60 + 80));
  
  // Preço fixo R$4,50
  const currentPrice = 4.50;

  const API_KEY = "nxp_live_bba943703263271e69dbbec5a94d8a3f9cb2a7ddc10ab4f7b817145a0b3c32a3";

  // Extrai cidade da localização
  const cityName = leadLocation ? leadLocation.split(',')[0].trim() : '';



  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setPixData(null);
      setTimeLeft(600);
      setErrorMsg("");
      setCopied(false);
      // Facebook Pixel: AddToCart event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', { content_name: 'segredinho_sofia', value: currentPrice, currency: 'BRL' });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'pix_generated' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Polling automático a cada 5 segundos enquanto o QRCode estiver na tela
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'pix_generated' && pixData?.id) {
        interval = setInterval(() => {
            checkPaymentStatus(pixData.id, true);
        }, 5000);
    }
    return () => clearInterval(interval);
  }, [step, pixData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Chama a NexusPag diretamente via proxy do Vercel (sem depender do n8n)
  const handleGeneratePix = async () => {
    setStep('loading');
    setErrorMsg("");
    
    // Timeout de 30 segundos pra não ficar infinito
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    try {
      console.log('[PIX] Chamando NexusPag via proxy Vercel...');
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
      console.log('[PIX] Resposta bruta NexusPag:', text);
      
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error('[PIX] Falha ao parsear JSON:', text);
        setErrorMsg("Resposta inválida do servidor.");
        setStep('intro');
        return;
      }

      console.log('[PIX] Resposta parseada:', JSON.stringify(data, null, 2));

      if (response.ok) {
        // Suporte a múltiplos formatos de resposta
        const tx = data.transaction || data.data || (Array.isArray(data) ? (data[0]?.transaction || data[0]) : data);
        console.log('[PIX] Objeto tx extraído:', JSON.stringify(tx, null, 2));
        
        // Resolve nomes de campo flexíveis
        const copiaCola = tx?.pix_copia_cola || tx?.qr_code || tx?.pixCopiaECola || tx?.brcode || tx?.emv || tx?.copy_paste || tx?.pix_copy_paste;
        const txId = tx?.id || tx?.txid || tx?.uuid || tx?.transaction_id;
        
        // QR code image: NexusPag retorna vazio, então geramos a partir do pix_copia_cola
        let qrCodeImage = tx?.qr_code_base64 || tx?.qrcode_base64 || tx?.qr_code_image;
        
        // Se qr_code_base64 está vazio ou não existe, gera via API externa
        if ((!qrCodeImage || qrCodeImage === '') && copiaCola) {
          qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(copiaCola)}`;
          console.log('[PIX] QR code gerado via qrserver.com');
        }
        
        console.log('[PIX] Campos resolvidos:', { 
          qrCodeImage: qrCodeImage ? qrCodeImage.substring(0, 80) + '...' : null, 
          copiaCola: copiaCola ? copiaCola.substring(0, 80) + '...' : null, 
          txId,
          todasAsChaves: tx ? Object.keys(tx) : 'tx é null'
        });

        if (copiaCola) {
             setPixData({
                 qrcode: qrCodeImage && qrCodeImage.startsWith('data:') ? qrCodeImage : (qrCodeImage || ''),
                 copiaCola: copiaCola,
                 id: txId
             });
             setStep('pix_generated');
             // Facebook Pixel: InitiateCheckout event
             if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'InitiateCheckout', { content_name: 'segredinho_sofia', value: currentPrice, currency: 'BRL' });
             }
        } else {
             console.error('[PIX] COPIA E COLA FALTANDO! Chaves:', tx ? Object.keys(tx) : 'null', 'Valores:', JSON.stringify(tx, null, 2));
             setErrorMsg("PIX criado mas código copia e cola não retornado.");
             setStep('intro');
        }
      } else {
        console.error('[PIX] HTTP erro:', response.status, data);
        setErrorMsg(`Erro ${response.status}: ${data?.message || data?.error || 'Falha no servidor'}`);
        setStep('intro');
      }
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        console.error('[PIX] Timeout de 30s atingido!');
        setErrorMsg("Timeout: servidor demorou demais. Tente novamente.");
      } else {
        console.error('[PIX] Erro de conexão:', err);
        setErrorMsg("Erro de conexão. Tente novamente.");
      }
      setStep('intro');
    }
  };

  // Consulta status diretamente na NexusPag via proxy Vercel
  const checkPaymentStatus = async (txId: string, isSilent = false) => {
    if (!isSilent) setStep('verifying');
    
    try {
      const response = await fetch(`/api/pix/${txId}`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY
        }
      });

      const data = await response.json();
      console.log('[PIX] Consulta status:', JSON.stringify(data, null, 2));

      if (response.ok) {
        const tx = data.transaction || data.data || (Array.isArray(data) ? (data[0]?.transaction || data[0]) : data);
        const status = (tx?.status || data?.status || '').toUpperCase();
        
        if (status === 'PAID' || status === 'COMPLETED' || status === 'PAGO' || status === 'APPROVED') {
          setStep('success');
          // Ativa VIP imediatamente
          onSuccess();
          // Facebook Pixel: Purchase event (R$4,50 real)
          if (typeof window !== 'undefined' && (window as any).fbq) {
            const eventID = 'purchase_' + Date.now();
            (window as any).fbq('track', 'Purchase', {
              value: currentPrice,
              currency: 'BRL',
              content_ids: ['segredinho_sofia'],
              content_type: 'product',
              content_name: 'Segredinho Sofia'
            }, { eventID });
            console.log('[Pixel] Purchase disparado - valor:', currentPrice, 'eventID:', eventID);
          }
          // Depois de 2.5s mostra upsell
          setTimeout(() => {
            setStep('upsell');
          }, 2500);
        } else if (!isSilent) {
          setErrorMsg("Pagamento ainda não identificado.");
          setStep('pix_generated');
        }
      } else if (!isSilent) {
        setErrorMsg("Erro ao consultar status.");
        setStep('pix_generated');
      }
    } catch (err) {
      if (!isSilent) {
         setErrorMsg("Falha ao verificar. Tente novamente.");
         setStep('pix_generated');
      }
    }
  };

  const copyToClipboard = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.copiaCola);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in sm:p-6">
      <div className="relative w-full max-w-md overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'intro' && (
          <div className="p-6 sm:p-8 text-center animate-fade-in-up mt-4">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/30">
              <Lock className="w-8 h-8 text-pink-500" />
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              Meu Segredinho 😈
            </h2>
            
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
              Amor, esses são os meus conteúdos mais íntimos... coisas que eu <span className="text-white font-bold">tenho vergonha de postar</span> em qualquer lugar 🙈💦<br/><br/>
              Me ajuda desbloqueando? O valor é só pro meu café na padaria e pão com presunto depois da faculdade 🥺📚
            </p>



            {/* Preço */}
            <div className="bg-zinc-950 rounded-xl p-4 mb-5 border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400 text-sm font-medium">Segredinho Completo 😈</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-black">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400 text-sm font-medium">Vídeos Sem Censura</span>
                <span className="text-green-500 font-black text-xs">INCLUSO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm font-medium">Fotos Proibidas</span>
                <span className="text-green-500 font-black text-xs">INCLUSO</span>
              </div>
              <div className="h-px bg-zinc-800 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total a pagar</span>
                <span className="text-amber-500 font-black text-xl">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* BÔNUS: Faculdade + ajuda */}
            <div className="bg-gradient-to-b from-pink-950/30 to-zinc-950/50 border border-pink-500/20 rounded-xl p-4 mb-5 text-left relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center shrink-0 border border-pink-500/30 mt-0.5">
                  <span className="text-lg">📚</span>
                </div>
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-tight leading-tight">
                    Me ajuda a pagar minha faculdade 🥺
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed mt-1">
                    Amor, o que é <span className="text-pink-400 font-bold">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>? O preço de um café na padaria com pão com presunto... <span className="text-white font-semibold">pra mim é a diferença entre continuar meus estudos ou ter que largar tudo</span> 😢
                  </p>
                </div>
              </div>
            </div>

            {errorMsg && (
                <p className="text-red-500 text-sm mb-4 font-bold bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>
            )}

            <button 
              onClick={handleGeneratePix}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              😈 DESBLOQUEAR SEGREDINHO — R$ {currentPrice.toFixed(2).replace('.', ',')} <Gem size={18} className="fill-white" />
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-zinc-500 text-xs font-medium">
              <ShieldAlert className="w-4 h-4" /> Pagamento 100% Seguro e Anônimo
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-12 mt-4 flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-amber-500 font-black uppercase tracking-widest animate-pulse text-lg">Gerando PIX...</p>
          </div>
        )}

        {step === 'pix_generated' && pixData && (
           <div className="p-6 sm:p-8 animate-fade-in flex flex-col items-center min-h-[400px]">
               <h3 className="text-white font-black text-xl mb-2 text-center mt-4">PAGAMENTO VIA PIX</h3>
               <p className="text-zinc-400 text-sm text-center mb-4">
                   Abra o app do seu banco e escaneie o código ou use a opção "Pix Copia e Cola".
               </p>

               <div className="text-center mb-4">
                 <span className="text-amber-400 font-black text-2xl">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
               </div>

               <div className="bg-white p-2 rounded-xl mb-6">
                   <img src={pixData.qrcode} alt="QR Code PIX" className="w-48 h-48 object-contain" />
               </div>

               <div className="w-full mb-6">
                   <p className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-wider">Pix Copia e Cola</p>
                   <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                       <input 
                          type="text" 
                          readOnly 
                          value={pixData.copiaCola} 
                          className="bg-transparent text-zinc-300 text-xs outline-none flex-1 truncate font-mono"
                       />
                       <button 
                          onClick={copyToClipboard}
                          className={`px-3 shrink-0 py-2 ${copied ? 'bg-green-600' : 'bg-zinc-800 hover:bg-zinc-700'} text-white rounded-lg transition-colors flex items-center gap-1 uppercase text-[10px] font-bold`}
                       >
                           <Copy size={12} /> {copied ? 'COPIADO ✓' : 'COPIAR'}
                       </button>
                   </div>
               </div>

               {errorMsg && (
                   <p className="text-red-500 text-sm mb-4 font-bold text-center w-full bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>
               )}

               <button 
                  onClick={() => checkPaymentStatus(pixData.id)}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center uppercase text-sm mb-4 tracking-wide"
               >
                   JÁ EFETUEI O PAGAMENTO
               </button>

               <div className="flex items-center justify-center gap-2 text-amber-500 font-mono text-lg mb-2">
                   <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
               </div>
               <p className="text-zinc-500 text-xs mt-2">O código expira em 10 minutos.</p>
           </div>
        )}

        {step === 'verifying' && (
           <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-zinc-500 border-t-amber-500 rounded-full animate-spin mb-6"></div>
              <p className="text-white font-bold tracking-widest animate-pulse text-lg">Buscando confirmação...</p>
           </div>
        )}

        {step === 'success' && (
          <div className="p-8 sm:p-12 text-center animate-fade-in min-h-[400px] flex flex-col justify-center">
             <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-500" />
             </div>
              <h3 className="text-white font-black text-2xl uppercase tracking-tight mb-2">PAGAMENTO APROVADO!</h3>
              <p className="text-zinc-400">Liberando seu Segredinho 😈...</p>
          </div>
        )}

        {step === 'upsell' && (
          <div className="p-6 sm:p-8 text-center animate-fade-in-up">
            {/* Header verde de sucesso */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">SEGREDINHO DESBLOQUEADO 😈</span>
            </div>

            {/* Separador */}
            <div className="h-px bg-zinc-800 mb-6"></div>

            {/* Oferta relâmpago */}
            <div className="bg-gradient-to-b from-red-950/40 to-zinc-900 border-2 border-red-500/40 rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-red-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full mb-4 animate-pulse tracking-widest">
                  ⚡ OFERTA ÚNICA PRA VOCÊ
                </div>

                <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-2 leading-tight">
                  SUBMUNDO <span className="text-red-500">VAZADO</span>
                </h3>
                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                  9 vídeos proibidos do submundo que <span className="text-white font-bold">você não encontra em nenhum outro lugar</span>. Conteúdo restrito, pesado e exclusivo.
                </p>

                {/* Preview dos vídeos */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {['foto22.jpg', 'foto20.jpg', 'foto21.jpg'].map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={`https://secreto.meuprivacy.digital/acesso/${img}`} className="w-full h-full object-cover blur-[3px] opacity-60" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-500" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preço com desconto */}
                <div className="bg-black/40 rounded-xl p-4 border border-red-500/20">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-zinc-500 line-through text-lg">R$ 89,00</span>
                    <span className="text-red-500 font-black text-3xl">R$ 29,90</span>
                  </div>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase">Desconto exclusivo só pra quem desbloqueou o Segredinho</p>
                </div>
              </div>
            </div>

            {/* Botão CTA */}
            <button
              onClick={() => {
                onClose();
                if (onOpenVazados) onOpenVazados();
              }}
              className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
            >
              <ShieldAlert className="w-5 h-5" /> LIBERAR SUBMUNDO — R$ 29,90
            </button>

            {/* Botão pular */}
            <button
              onClick={onClose}
              className="w-full py-3 text-zinc-600 text-xs font-bold uppercase hover:text-zinc-400 transition-colors"
            >
              Não, obrigado. Continuar navegando.
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
