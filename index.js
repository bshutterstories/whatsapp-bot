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
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const text = msg.text?.body?.toLowerCase().trim();
  let respuesta = "";

  if (text === "hola" || text === "menu") {
    respuesta = "🌟 *MENÚ*\n1. Servicios\n2. Contacto";
  } else if (text === "1") {
    respuesta = "📸 Foto y Video.";
  } else if (text === "2") {
    respuesta = "👨‍💻 Un agente te contactará.";
  } else {
    respuesta = "Escribe *Menu* para ver opciones.";
  }

  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp", to: from, text: { body: respuesta }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) {
    console.log("Error:", e.response?.data || e.message);
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => console.log("Bot Online"));
