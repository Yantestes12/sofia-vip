import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, Timer, Copy } from './Icons';

const AGE_VERIFIED_KEY = 'sofia_age_verified';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const checkAgeVerified = (): boolean => {
  try {
    const stored = localStorage.getItem(AGE_VERIFIED_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return parsed?.verified === true;
  } catch { return false; }
};

export const activateAgeVerified = (): void => {
  localStorage.setItem(AGE_VERIFIED_KEY, JSON.stringify({
    verified: true,
    token: `age_${Date.now()}_${Math.random().toString(36).substring(2,10)}`,
    verifiedAt: new Date().toISOString(),
    discountAmount: 1.99
  }));
};

export const getDiscount = (): number => {
  try {
    const stored = localStorage.getItem(AGE_VERIFIED_KEY);
    if (!stored) return 0;
    const parsed = JSON.parse(stored);
    return parsed?.verified ? parsed.discountAmount || 1.99 : 0;
  } catch { return 0; }
};

const API_KEY = "nxp_live_bba943703263271e69dbbec5a94d8a3f9cb2a7ddc10ab4f7b817145a0b3c32a3";

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'intro' | 'loading' | 'pix_generated' | 'verifying' | 'success'>('intro');
  const [timeLeft, setTimeLeft] = useState(600);
  const [pixData, setPixData] = useState<{ qrcode: string; copiaCola: string; id: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const price = 1.99;

  useEffect(() => {
    if (isOpen) { setStep('intro'); setPixData(null); setTimeLeft(600); setErrorMsg(''); setCopied(false); }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'pix_generated' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'pix_generated' && pixData?.id) {
      interval = setInterval(() => checkPayment(pixData.id, true), 5000);
    }
    return () => clearInterval(interval);
  }, [step, pixData]);

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const handleGeneratePix = async () => {
    setStep('loading'); setErrorMsg('');
    const ctrl = new AbortController();
    const tout = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({ amount: price, webhook_url: 'https://weebhooks.synio.com.br/webhook/receber-nexuspag' }),
        signal: ctrl.signal
      });
      clearTimeout(tout);
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { setErrorMsg('Resposta inválida.'); setStep('intro'); return; }
      if (res.ok) {
        const tx = data.transaction || data.data || (Array.isArray(data) ? (data[0]?.transaction || data[0]) : data);
        const cc = tx?.pix_copia_cola || tx?.qr_code || tx?.pixCopiaECola || tx?.brcode || tx?.emv || tx?.copy_paste;
        const txId = tx?.id || tx?.txid || tx?.uuid || tx?.transaction_id;
        let qr = tx?.qr_code_base64 || tx?.qrcode_base64 || tx?.qr_code_image;
        if ((!qr || qr === '') && cc) qr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(cc)}`;
        if (cc) {
          setPixData({ qrcode: qr && qr.startsWith('data:') ? qr : (qr || ''), copiaCola: cc, id: txId });
          setStep('pix_generated');
          if ((window as any).fbq) (window as any).fbq('track', 'InitiateCheckout', { content_name: 'verificacao_idade', value: price, currency: 'BRL' });
        } else { setErrorMsg('PIX criado mas código não retornado.'); setStep('intro'); }
      } else { setErrorMsg(`Erro ${res.status}`); setStep('intro'); }
    } catch (err: any) {
      clearTimeout(tout);
      setErrorMsg(err.name === 'AbortError' ? 'Timeout. Tente novamente.' : 'Erro de conexão.');
      setStep('intro');
    }
  };

  const checkPayment = async (txId: string, silent = false) => {
    if (!silent) setStep('verifying');
    try {
      const res = await fetch(`/api/pix/${txId}`, { headers: { 'x-api-key': API_KEY } });
      const data = await res.json();
      if (res.ok) {
        const tx = data.transaction || data.data || data;
        const st = (tx?.status || data?.status || '').toUpperCase();
        if (['PAID','COMPLETED','PAGO','APPROVED'].includes(st)) {
          setStep('success');
          activateAgeVerified();
          onSuccess();
          setTimeout(() => onClose(), 2500);
        } else if (!silent) { setErrorMsg('Pagamento ainda não identificado.'); setStep('pix_generated'); }
      } else if (!silent) { setErrorMsg('Erro ao consultar.'); setStep('pix_generated'); }
    } catch { if (!silent) { setErrorMsg('Falha ao verificar.'); setStep('pix_generated'); } }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-white bg-black/20 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        {step === 'intro' && (
          <div className="p-6 sm:p-8 text-center animate-fade-in-up mt-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/30">
              <ShieldAlert className="w-10 h-10 text-blue-400" />
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full mb-4 tracking-widest">
              🔒 VERIFICAÇÃO OBRIGATÓRIA
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              Verificação de Idade
            </h2>

            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
              Para acessar conteúdos restritos e interagir com as criadoras, precisamos confirmar que você é <span className="text-white font-bold">maior de 18 anos</span>.
            </p>

            <div className="bg-zinc-950 rounded-xl p-4 mb-5 border border-zinc-800 text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/15 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm">🔐</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Por que cobrar pela verificação?</p>
                  <p className="text-zinc-500 text-[11px] leading-snug mt-0.5">
                    Menores de idade não possuem PIX — é a forma mais segura de confirmar sua identidade.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/15 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Valor devolvido em desconto!</p>
                  <p className="text-zinc-500 text-[11px] leading-snug mt-0.5">
                    Os <span className="text-emerald-400 font-bold">R$ {price.toFixed(2).replace('.',',')}</span> serão convertidos em desconto no VIP e nos conteúdos exclusivos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-center gap-3">
                <span className="text-zinc-500 text-sm">Verificação</span>
                <span className="text-blue-400 font-black text-2xl">R$ {price.toFixed(2).replace('.',',')}</span>
              </div>
              <p className="text-blue-400/60 text-[9px] mt-1 font-bold uppercase">Pagamento único • Valor vira desconto</p>
            </div>

            {errorMsg && <p className="text-red-500 text-sm mb-4 font-bold bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>}

            <button onClick={handleGeneratePix}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              🔐 VERIFICAR MINHA IDADE — R$ {price.toFixed(2).replace('.',',')}
            </button>
            <p className="text-zinc-500 text-[10px] mt-3 font-medium">🔒 Pagamento seguro e anônimo via PIX</p>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-12 mt-4 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-blue-400 font-black uppercase tracking-widest animate-pulse text-lg">Gerando verificação...</p>
          </div>
        )}

        {step === 'pix_generated' && pixData && (
          <div className="p-6 sm:p-8 animate-fade-in flex flex-col items-center min-h-[400px]">
            <h3 className="text-white font-black text-xl mb-2 text-center mt-4">VERIFICAÇÃO VIA PIX</h3>
            <p className="text-zinc-400 text-sm text-center mb-4">Escaneie o código ou use "Pix Copia e Cola".</p>
            <div className="text-center mb-4">
              <span className="text-blue-400 font-black text-2xl">R$ {price.toFixed(2).replace('.',',')}</span>
              <p className="text-emerald-400 text-[10px] font-bold mt-1">✅ Valor será convertido em desconto</p>
            </div>
            <div className="bg-white p-2 rounded-xl mb-6">
              <img src={pixData.qrcode} alt="QR Code" className="w-48 h-48 object-contain" />
            </div>
            <div className="w-full mb-6">
              <p className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-wider">Pix Copia e Cola</p>
              <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <input type="text" readOnly value={pixData.copiaCola} className="bg-transparent text-zinc-300 text-xs outline-none flex-1 truncate font-mono" />
                <button onClick={() => { 
                  const text = pixData.copiaCola;
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }).catch(() => {
                      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2500);
                    });
                  } else {
                    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2500);
                  }
                }}
                  className={`px-3 shrink-0 py-2 ${copied ? 'bg-green-600' : 'bg-zinc-800 hover:bg-zinc-700'} text-white rounded-lg transition-colors flex items-center gap-1 uppercase text-[10px] font-bold`}>
                  <Copy size={12} /> {copied ? 'COPIADO ✓' : 'COPIAR'}
                </button>
              </div>
            </div>
            {errorMsg && <p className="text-red-500 text-sm mb-4 font-bold text-center w-full bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>}
            <button onClick={() => checkPayment(pixData.id)}
              className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center uppercase text-sm mb-4">
              JÁ EFETUEI O PAGAMENTO
            </button>
            <div className="flex items-center justify-center gap-2 text-blue-400 font-mono text-lg mb-2">
              <Timer className="w-5 h-5" /> {fmt(timeLeft)}
            </div>
          </div>
        )}

        {step === 'verifying' && (
          <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-zinc-500 border-t-blue-500 rounded-full animate-spin mb-6"></div>
            <p className="text-white font-bold tracking-widest animate-pulse text-lg">Verificando...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 sm:p-12 text-center animate-fade-in min-h-[400px] flex flex-col justify-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-white font-black text-2xl uppercase tracking-tight mb-2">IDADE VERIFICADA! ✅</h3>
            <p className="text-zinc-400 text-sm">Seu desconto de <span className="text-emerald-400 font-bold">R$ {price.toFixed(2).replace('.',',')}</span> foi ativado!</p>
            <p className="text-zinc-500 text-xs mt-2">Redirecionando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeVerificationModal;
