import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini Client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Admin API
app.post("/api/admin/check-updates", async (req, res) => {
  const { title, latestLocalChapter = 0, existingChapters = [] } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
  }

  try {
    const chaptersText = existingChapters.length > 0 
      ? `Las entradas/capítulos que tenemos creados localmente son:\n${existingChapters.map((c: string) => `- "${c}"`).join('\n')}\n`
      : `El mayor número de capítulo registrado localmente es: Capítulo ${latestLocalChapter}`;

    const prompt = `Investiga en Internet de manera real y detallada sobre el manga/manhwa/webtoon en español o inglés titulado "${title}".
    
    INFORMACIÓN IMPORTANTE SOBRE NUESTRO FORMATO LOCAL:
    En nuestra plataforma, el usuario puede subir capítulos agrupados o individuales (por ejemplo, subir un solo archivo PDF o entrada titulado "Capítulo 1-10" o "Capítulo 4-15" que contiene múltiples subcapítulos agrupados). 
    
    ${chaptersText}
    
    Analiza con extremo cuidado las entradas listadas anteriormente. Identifica el número de capítulo real más alto que ya cubrimos (por ejemplo, si tenemos una entrada llamada "Capítulo 1-10", significa que ya cubrimos hasta el Capítulo 10 inclusive, por lo cual solo nos interesan capítulos a partir de 11 en adelante).
    
    Investiga en noticias de anime/manga, foros reales, wikis oficiales, o portales de scans o editoriales de manga (como MangaDex, TuMangaOnline/TMO, MangaPlus, etc.) si ya se publicaron capítulos de manera oficial o traducidos con un número superior al máximo que ya tenemos cubierto localmente.
    
    Genera la respuesta estrictamente en español utilizando uno de estos formatos de acuerdo a tu investigación real:
    
    - Si encuentras capítulos más nuevos en internet (por ejemplo, si en internet está publicado hasta el Capítulo 15 y nosotros ya cubrimos hasta el 10):
      "Hay X capítulo(s) nuevo(s) de la obra ${title}. En internet se encuentra disponible hasta el Capítulo Y. Fuentes reales encontradas en la búsqueda: [Lista los nombres o dominios de los sitios o fuentes encontrados]."
      
    - Si no hay capítulos más nuevos o estamos completamente actualizados en relación a internet o scans actuales:
      "No hay capítulos nuevos de la obra ${title}. Actualmente está al día con respecto a internet (último rango cubierto localmente: [Menciona aquí detalladamente el último capítulo o rango que detectaste en nuestra lista])."
      
    Sé 100% verídico y detallado. No inventes datos.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    res.json({ message: response.text });
  } catch (error: any) {
    console.error("Error checking updates:", error);
    const errorMsg = String(error?.message || error || "");
    if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Quota exceeded") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({ 
        error: "Límite de cuota de la API de Gemini excedido (429). Por favor, intenta de nuevo en un minuto o asocia una clave de facturación para consultas ilimitadas." 
      });
    }
    res.status(500).json({ error: "No se pudo consultar la IA: " + errorMsg });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
