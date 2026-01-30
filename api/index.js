const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

// --- PUNTO 1: CONFIGURAZIONE CORS (Sistemata) ---
// Questo permette al tuo sito su GitHub di parlare con questo server su Vercel
app.use(cors({
    origin: '*', 
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Rotta per la chat
app.post('/api', async (req, res) => {
  try {
    const { prompt, datiPlayer } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          // Qui ci sono le tue istruzioni per Groq, rimaste invariate
          content: `Sei Re Panza, sovrano di L&K Tools. Dati attuali: ${datiPlayer}` 
        },
        { role: "user", content: prompt }
      ],
      model: "mixtral-8x7b-32768",
    });

    res.json({ risposta: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore del Regno" });
  }
});

// Aggiungiamo questa piccola parte per testare se il server è vivo
app.get('/api', (req, res) => {
  res.send("Il Regno di Re Panza è online!");
});

module.exports = app;
