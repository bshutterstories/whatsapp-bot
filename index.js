const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Endpoint principal
app.get("/", (req, res) => {
  res.send("Servidor del bot funcionando 🚀");
});

// Webhook GET: Verificación con Meta
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "bryan123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado correctamente!");
      res.send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Webhook POST: Recibe mensajes de WhatsApp y responde con menú
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    try {
      const entry = body.entry[0];
      const changes = entry.changes[0];
      const value = changes.value;
      const messages = value.messages;

      if (messages) {
        const from = messages[0].from;
        const text = messages[0].text?.body?.trim() || "";

        console.log("Mensaje recibido de", from, ":", text);

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
            text: { body: reply }
          },
          {
            headers: { Authorization: `Bearer ${TOKEN}` }
          }
        );

        console.log("Respuesta enviada a", from);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Error procesando mensaje:", error.response?.data || error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

const TOKEN = "TU_TEMPORARY_ACCESS_TOKEN"; // reemplaza con tu token de WhatsApp Cloud
const PHONE_NUMBER_ID = "TU_PHONE_NUMBER_ID"; // reemplaza con tu Phone Number ID

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
