import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare } from 'lucide-react';

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
          Difunde el manga en tus redes y aplicaciones favoritas al instante.
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
        <div className="grid grid-cols-3 gap-3">
          {/* WhatsApp */}
          <a
            href={shareWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-[#25D366] text-white font-black text-[10px] tracking-wide uppercase rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            <MessageSquare className="h-5 w-5 mb-1 stroke-[2.5px]" />
            WhatsApp
          </a>

          {/* Telegram */}
          <a
            href={shareTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-[#0088cc] text-white font-black text-[10px] tracking-wide uppercase rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 mb-1 fill-white stroke-none" strokeWidth={0}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.1.02-1.62 1.03-4.57 3.03-.43.3-.82.45-1.17.44-.39-.01-1.14-.22-1.7-.4s-1.01-.28-1-.59c.01-.16.23-.33.68-.51 2.78-1.21 4.63-2.01 5.56-2.4 2.64-1.1 3.19-1.29 3.55-1.29.08 0 .25.02.36.11.09.08.12.19.13.27 0 .05.01.12 0 .19z" fill="#ffffff" />
            </svg>
            Telegram
          </a>

          {/* Twitter / X */}
          <a
            href={shareTwitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-black text-white font-black text-[10px] tracking-wide uppercase rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 mb-1 fill-white stroke-none">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff" />
            </svg>
            Twitter / X
          </a>
        </div>

        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="mt-4 text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest cursor-pointer select-none"
          >
            Utilizar opción nativa
          </button>
        )}
      </div>
    </div>
  );
}
