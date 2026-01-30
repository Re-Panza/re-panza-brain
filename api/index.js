const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { prompt, datiPlayer } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "Sei Re Panza, il saggio e ironico sovrano di Lords & Knights. Rispondi in modo regale ma breve, usando il 'Noi'. Sei un esperto di strategia militare e inattività dei player." 
        },
        { 
          role: "user", 
          content: `Contesto Player: ${JSON.stringify(datiPlayer)}. Quesito: ${prompt}` 
        }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });

    res.status(200).json({ risposta: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ errore: "Il Re è a banchetto, riprova più tardi!" });
  }
};
