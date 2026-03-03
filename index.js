const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// CONFIGURACIÓN
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "116586229808120";
const WEBHOOK_TOKEN = "bryan123";

// WEBHOOK PARA VERIFICACIÓN
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// RECEPCIÓN DE MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const messages = changes?.value?.messages;

      if (messages && messages[0]) {
        const msg = messages[0];
        const from = msg.from;
        const text = msg.text ? msg.text.body.toLowerCase() : "";

        console.log("Mensaje de:", from, "Texto:", text);

        let respuesta = "Hola! Escribe 'Menu' para empezar.";
        
        if (text === "hola" || text === "menu") {
          respuesta = "¡Bienvenido! \n1. Servicios\n2. Contacto";
        } else if (text === "1") {
          respuesta = "Creamos bots inteligentes.";
        } else if (text === "2") {
          respuesta = "Contacta a Bryan al +506...";
        }

        await enviarWhatsApp(from, respuesta);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error("Error en Webhook:", err.message);
    res.sendStatus(200);
  }
});

// FUNCIÓN DE ENVÍO
async function enviarWhatsApp(to, text) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`,
      data: {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text },
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    console.log("Mensaje enviado OK");
  } catch (error) {
    console.error("Error API Meta:", error.response ? error.response.data : error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
