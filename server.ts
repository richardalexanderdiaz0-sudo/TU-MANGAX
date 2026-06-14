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
  const { title, latestLocalChapter = 0 } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
  }

  try {
    const prompt = `Investiga en Internet de manera real y detallada sobre el manga/manhwa/webtoon en español o inglés titulado "${title}".
    
    En nuestra base de datos, el último capítulo publicado es el Capítulo ${latestLocalChapter}.
    
    Analiza las noticias de anime/manga, foros, wikis o páginas de scans de manga externas para saber si ya se publicaron capítulos de manera oficial o por fansub con un número de capítulo superior al Capítulo ${latestLocalChapter}.
    
    Responde estrictamente en español siguiendo este formato basado en tu investigación de Google Search:
    
    - Si encuentras capítulos más nuevos en internet (por ejemplo, si en internet está publicado hasta el Capítulo 15 y el local es el Capítulo 10):
      "Hay X capítulo(s) nuevo(s) de la obra ${title}. En internet se encuentra hasta el Capítulo Y según los últimos resultados. Fuentes reales: [Lista los nombres o dominios de los sitios o fuentes encontrados en tu búsqueda]."
      
    - Si no hay capítulos más nuevos o estamos completamente actualizados:
      "No hay capítulos nuevos de la obra ${title}. Actualmente está al día (último capítulo local: ${latestLocalChapter})."
    
    Sé ultra detallado y real, sin inventar ni simular nada.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      tools: [{ googleSearch: {} }],
    });

    res.json({ message: response.text });
  } catch (error) {
    console.error("Error checking updates:", error);
    res.status(500).json({ error: "Failed to check updates" });
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
