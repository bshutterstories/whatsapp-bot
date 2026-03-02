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
  const VERIFY_TOKEN = "bryan123"; // +1 555 157 9070

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

// Webhook POST: Recibe mensajes de WhatsApp
app.post("/webhook", async (req, res) => {
  const body = req.body;

  // Solo procesa si es mensaje entrante
  if (body.object) {
    try {
      const entry = body.entry[0];
      const changes = entry.changes[0];
      const value = changes.value;
      const messages = value.messages;

      if (messages) {
        const from = messages[0].from; // número del cliente
        const text = messages[0].text?.body || "";

        console.log("Mensaje recibido de", from, ":", text);

        // Enviar menú de opciones
        await sendMenu(from);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

// Función para enviar el menú automático
const TOKEN = "EAAW7lqynL1wBQyaWFf4V30yM4uYeoSxP7rZBxfSGW7mgPPrVglaSuuVZAtCVPATc5BZBiKA8XSWpoyhGinbjbrPrCRZBjZCGRCKoZCInQ6o3QPnmLzuRTfwZCaE93aefS628gfaMK4XVZApmJTHRxtsf3QTDqA9ZBjmRjKutVk3jQUHoI83q4eZC89yqofa3ZAs8dE4K6hqPGJW0VsGIL27alE2bKAc0Q2PGeGB3CkFM1IpH3ZAB9ffKQEKPKnT0AkSTlK7rii4L54TTy9BSuZATKLZCWKZBYIJCFudrE4ZD"; // tu token
const PHONE_NUMBER_ID = "TU_PHONE_NUMBER_ID"; // reemplaza por tu Phone Number ID

async function sendMenu(to) {
  const menuText = `¡Hola! 👋 Gracias por contactarnos.  
Por favor elige una opción respondiendo con el número:

1️⃣ Información de servicios  
2️⃣ Horarios y ubicación  
3️⃣ Precios y promociones`;

  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: menuText }
      },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );
    console.log("Menú enviado a", to);
  } catch (error) {
    console.error("Error enviando menú:", error.response?.data || error);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
