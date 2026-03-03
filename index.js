const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// CONFIGURACIÓN - ¡VERIFICA ESTOS DOS!
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "116586229808120"; // Asegúrate que este sea el "Phone Number ID" de Meta
const WEBHOOK_TOKEN = "bryan123";

// VERIFICACIÓN DEL WEBHOOK
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) {
    return res.send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// RECEPCIÓN Y RESPUESTA
app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  
  if (msg) {
    const from = msg.from;
    const text = msg.text?.body?.toLowerCase();
    console.log(`Mensaje recibido: ${text} de ${from}`);

    let respuesta = "Hola! Escribe 'Menu'.";
    if (text === "hola" || text === "menu") {
      respuesta = "¡Bienvenido! \n1. Servicios\n2. Contacto";
    }

    await enviarWhatsApp(from, respuesta);
  }
  res.sendStatus(200);
});

// FUNCIÓN DE ENVÍO
async function enviarWhatsApp(to, text) {
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text },
    }, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log("Respuesta enviada con éxito");
  } catch (error) {
    console.error("Error detallado:", error.response?.data || error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puerto: ${PORT}`));
