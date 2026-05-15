import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configurar el worker de PDF.js usando CDN para evitar problemas de Vite/Webpack
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfReaderProps {
  url: string;
}

export default function PdfReader({ url }: PdfReaderProps) {
  const [numPages, setNumPages] = useState<number>();
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('No se pudo cargar el PDF. Intenta subirlo de nuevo.');
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center bg-red-500/10 border-4 border-red-500 rounded-2xl my-4">
        <p className="text-red-500 font-black uppercase italic">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="p-12 flex justify-center items-center font-black uppercase tracking-widest text-primary animate-pulse">
            CARGANDO PDF...
          </div>
        }
        className="w-full flex flex-col mx-auto"
      >
        {numPages && Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} className="w-full flex justify-center mb-0 sm:mb-4 bg-white/5 relative border-b-2 sm:border-y-2 border-black/20">
            <Page
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<div className="h-screen w-full bg-slate-900 animate-pulse flex items-center justify-center font-black text-slate-700">CARGANDO PÁGINA {index + 1}...</div>}
              width={Math.min(window.innerWidth, 768)} // Full width or max 3xl
              className="max-w-full !w-full"
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
