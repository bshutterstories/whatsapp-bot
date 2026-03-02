const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Endpoint principal
app.get("/", (req, res) => {
  res.send("Servidor del bot funcionando 🚀");
});

// Webhook GET: verificación de Meta
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "bryan123"; // token de verificación
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook POST: recibe mensajes y responde menú
app.post("/webhook", async (req, res) => {
  try {
    const messages = req.body.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages) return res.sendStatus(200);

    const from = messages[0].from;
    const text = messages[0].text?.body?.trim() || "";

    let reply = "";
    if (text === "1") {
      reply = "Información de servicios: Fotografía profesional, cobertura de eventos, sesiones individuales y más.";
    } else if (text === "2") {
      reply = "Horarios y ubicación: Lunes a Viernes de 9am a 6pm, San José, Costa Rica. Contacto directo al +50612345678.";
    } else if (text === "3") {
      reply = "Precios y promociones: Sesiones desde $50, cobertura de eventos desde $200. ¡Promos especiales para paquetes combinados!";
    } else {
      reply = `¡Hola! 👋 Gracias por contactarnos.
Por favor elige una opción respondiendo con el número:

1️⃣ Información de servicios
2️⃣ Horarios y ubicación
3️⃣ Precios y promociones`;
    }

    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply },
      },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Reemplaza con tus datos de Meta
const TOKEN = "TU_TEMPORARY_ACCESS_TOKEN";
const PHONE_NUMBER_ID = "TU_PHONE_NUMBER_ID";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
