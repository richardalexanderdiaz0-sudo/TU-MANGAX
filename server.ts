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
  const { title } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
  }

  try {
    const prompt = `Search the web for any new chapters of the manga/manhwa titled "${title}". 
    Answer ONLY in Spanish, strictly in one of these two formats: 
    - "Hay X capítulos nuevos de la obra [TITLE]" 
    - "No hay capítulos nuevos de la obra [TITLE]"
    Do not add any other text. If X is 0 or not found, use the "No hay..." format.`;

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
