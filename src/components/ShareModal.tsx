import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Smartphone } from 'lucide-react';

interface ShareModalProps {
  title: string;
  shareText: string;
  shareUrl: string;
  onClose: () => void;
}

export default function ShareModal({ title, shareText, shareUrl, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const fullTextWithUrl = `${shareText} ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullTextWithUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullTextWithUrl)}`;
  const shareTelegram = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.error('Error sharing natively:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[150] flex items-center justify-center p-4 font-sans" onClick={onClose}>
      <div 
        className="bg-white border-4 border-black w-full max-w-sm rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative p-6 text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="toon-button bg-white p-1 min-w-0 absolute top-4 right-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <X className="h-5 w-5 text-black" />
        </button>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-2 mt-4">
          ¡COMPARTIR OBRA! 🚀
        </h3>

        <p className="text-xs text-slate-500 font-bold mb-4">
          Comparte la obra en tus aplicaciones favoritas al instante con un mensaje personalizado.
        </p>

        {/* Preview of Share Link text box */}
        <div className="border-4 border-black bg-slate-50 p-4 rounded-2xl text-left text-xs text-slate-700 font-black tracking-tight leading-relaxed mb-4 relative overflow-hidden shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)]">
          "{shareText}"
          <span className="block text-primary mt-1 select-all break-all underline decoration-2">{shareUrl}</span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`w-full py-3.5 px-4 font-black uppercase text-[11px] tracking-wider rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 mb-4 cursor-pointer ${
            copied ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 stroke-[3px]" />
              ¡ENLACE COPIADO!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 stroke-[3px]" />
              COPIAR ENLACE AL PORTAPAPELES
            </>
          )}
        </button>

        {/* Quick Social Shares */}
        <div className="grid grid-cols-4 gap-2">
          {/* WhatsApp */}
          <a
            href={shareWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 bg-[#25D366] text-white font-black text-[9px] tracking-wide uppercase rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <MessageSquare className="h-5 w-5 mb-1 stroke-[2.5px]" />
            WhatsApp
          </a>

          {/* Telegram */}
          <a
            href={shareTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 bg-[#0088cc] text-white font-black text-[9px] tracking-wide uppercase rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <MessageSquare className="h-5 w-5 mb-1 stroke-[2.5px]" />
            Telegr.
          </a>

          {/* Twitter / X */}
          <a
            href={shareTwitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 bg-black text-white font-black text-[9px] tracking-wide uppercase rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <MessageSquare className="h-5 w-5 mb-1 stroke-[2.5px]" />
            Twitter
          </a>
          
          {/* TikTok - Generic */}
          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center justify-center p-2 bg-[#000000] text-white font-black text-[9px] tracking-wide uppercase rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Smartphone className="h-5 w-5 mb-1 stroke-[2.5px]" />
            TikTok
          </button>
        </div>
      </div>
    </div>
  );
}
