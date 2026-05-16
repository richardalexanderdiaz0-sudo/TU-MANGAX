import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configurar el worker de PDF.js usando CDN para evitar problemas de Vite/Webpack
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function LazyPdfPage({ pageNumber, width }: { pageNumber: number, width: number }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [loadedHeight, setLoadedHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Desmontar las páginas que están lejos para ahorrar memoria en móviles (evita el "Aw, Snap!")
        setInView(entries[0].isIntersecting);
      },
      { rootMargin: '2500px 0px' } // Cargar 2500px antes/después
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ minHeight: loadedHeight || '100vh', width: '100%' }} 
      className="flex justify-center bg-[#111] relative border-b-2 border-black/10"
    >
      {inView ? (
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={width}
          onLoadSuccess={(page) => {
            // Guardar la altura para que cuando se desmonte no haya saltos al hacer scroll
            const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
            setLoadedHeight(viewport.height);
          }}
          loading={<div className="absolute inset-0 flex items-center justify-center font-black text-slate-700 uppercase animate-pulse">Cargando...</div>}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800 uppercase">
          {loadedHeight ? '' : '...'}
        </div>
      )}
    </div>
  );
}

interface PdfReaderProps {
  url: string;
}

export default function PdfReader({ url }: PdfReaderProps) {
  const [numPages, setNumPages] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const readerWidth = Math.min(window.innerWidth, 768);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading file:', error);
    setError('No se pudo cargar el archivo. Intenta abrirlo de nuevo.');
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
          <div className="p-12 flex flex-col justify-center items-center font-black uppercase tracking-widest text-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-6"></div>
            CARGANDO...
          </div>
        }
        className="w-full flex flex-col mx-auto"
      >
        {numPages && Array.from(new Array(numPages), (el, index) => (
          <LazyPdfPage key={`page_${index + 1}`} pageNumber={index + 1} width={readerWidth} />
        ))}
      </Document>
    </div>
  );
}
