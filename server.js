const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Chargez FAQ 
const faqPath = path.resolve(__dirname, 'faq.json');
const faq     = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));

app.post('/commande', (req, res) => {
  const raw     = req.body.message || '';
  const key     = raw.toLowerCase().trim();
  const answer  = faq[key] 
    || "Désolé, je n'ai pas la réponse à cette question. Puis-je vous aider autrement";
  console.log(`Serveur a reçu : "${raw}" → renvoie : "${answer}"`);
  res.json({ reponse: answer });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server démarré sur http://localhost:${PORT}`);
});
