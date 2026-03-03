const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const msg = changes?.value?.messages?.[0];

  if (msg) {
    const from = msg.from;
    const text = msg.text?.body?.toLowerCase();
    console.log(`Mensaje: ${text} de ${from}`);

    try {
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: { body: "¡Ya no hay crasheo! El bot está vivo. 🚀" },
      }, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
    } catch (e) {
      console.log("Error al enviar:", e.response?.data || e.message);
    }
  }
  res.send("EVENT_RECEIVED");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));
