const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// CONFIGURACIÓN (DATOS ACTUALIZADOS)
const TOKEN = "EAAW7lqynL1wBQ4BqiZCJxWgMYgZCCpL3DRZAXrw8XeYsdCd8egUu9Hw3S1xbqvLP9xxd0Orb6fPOe7hThNSEIcSCOvO1v19fyWgQKhywZArdnx1FFnc18PA0lNUBMbo4EAGvqMhZC3KCC9fcsiozZCzo1tcYOke27ml9gWj1dnCOXdWMQLzxN3ReZAotSi5WoBZCz6AC26p1tFxxbkpPi9izE1QjNO2rORxZAQ2PBRzP9MGXUgJyYtDtu9Lx6GlczaOHB9hnfGC7e4YFSjpx5pucDRNxrduuxGo4ZD";
const PHONE_ID = "116586229808120";
const VERIFY_TOKEN = "bryan123";

// 1. RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("Servidor del bot funcionando 🚀");
});

// 2. VERIFICACIÓN DEL WEBHOOK (META)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 3. RECEPCIÓN DE MENSAJES Y RESPUESTA
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const messages = entry?.messages;

    // IMPORTANTE: Si no hay mensaje o es un estado de "leído/entregado", ignorar
    if (!messages || !messages[0]) {
      return res.sendStatus(200);
    }

    const from = messages[0].from;
    const text = messages[0].text?.body?.trim() || "";

    // LÓGICA DEL MENÚ
    let reply = "";
    if (text === "1") {
      reply = "📸 *Servicios:* Fotografía profesional, eventos y sesiones.";
    } else if (text === "2") {
      reply = "📍 *Horarios:* Lun-Vie 9am-6pm. San José, Costa Rica. Tel: +50612345678.";
    } else if (text === "3") {
      reply = "💰 *Precios:* Sesiones desde $50. ¡Consulta paquetes!";
    } else {
      reply = "¡Hola! 👋 Gracias por escribir al +1 555 157 9070.\n\nElige una opción enviando el número:\n1️⃣ Servicios\n2️⃣ Horarios\n3️⃣ Precios";
    }

    // ENVÍO A LA API DE WHATSAPP
    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: reply },
      },
      {
        headers: { 
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        },
      }
    );

    res.sendStatus(200);
  } catch (err) {
    // Si hay error, lo vemos en la consola de Railway pero no tumbamos el server
    console.error("Error en el bot:", err.response?.data || err.message);
    res.sendStatus(200); 
  }
});

// 4. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot activo en puerto ${PORT}`));
