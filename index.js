const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// CONFIGURACIÓN DE TU CUENTA META
const TOKEN = "EAAW7lqynL1wBQ4BqiZCJxWgMYgZCCpL3DRZAXrw8XeYsdCd8egUu9Hw3S1xbqvLP9xxd0Orb6fPOe7hThNSEIcSCOvO1v19fyWgQKhywZArdnx1FFnc18PA0lNUBMbo4EAGvqMhZC3KCC9fcsiozZCzo1tcYOke27ml9gWj1dnCOXdWMQLzxN3ReZAotSi5WoBZCz6AC26p1tFxxbkpPi9izE1QjNO2rORxZAQ2PBRzP9MGXUgJyYtDtu9Lx6GlczaOHB9hnfGC7e4YFSjpx5pucDRNxrduuxGo4ZD";
const PHONE_ID = "116586229808120";
const VERIFY_TOKEN = "bryan123";

// 1. RUTA DE PRUEBA (Para ver en el navegador)
app.get("/", (req, res) => {
  res.send("Servidor del bot funcionando 🚀");
});

// 2. VERIFICACIÓN DEL WEBHOOK PARA META
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

// 3. RECEPCIÓN DE MENSAJES Y RESPUESTA AUTOMÁTICA
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const messages = entry?.messages;

    // Si no es un mensaje (ej. notificación de entrega), respondemos 200 y salimos
    if (!messages || !messages[0]) {
      return res.sendStatus(200);
    }

    const from = messages[0].from;
    const text = messages[0].text?.body?.trim() || "";

    // LÓGICA DEL MENÚ DE WHATSAPP
    let reply = "";
    if (text === "1") {
      reply = "📸 *Servicios:* Fotografía profesional, eventos y sesiones individuales.";
    } else if (text === "2") {
      reply = "📍 *Horarios:* Lun-Vie 9am-6pm. San José, Costa Rica. Tel: +50612345678.";
    } else if (text === "3") {
      reply = "💰 *Precios:* Sesiones desde $50. ¡Consulta paquetes especiales!";
    } else {
      reply = "¡Hola! 👋 Gracias por escribir al número de prueba (+1 555 157 9070).\n\nPor favor, elige una opción enviando el número:\n\n1️⃣ Información de servicios\n2️⃣ Horarios y ubicación\n3️⃣ Precios y promociones";
    }

    // ENVÍO DE LA RESPUESTA POR WHATSAPP API
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
    // Si hay un error, lo imprime en los logs de Railway sin tumbar el servidor
    console.error("Error en el bot:", err.response?.data || err.message);
    res.sendStatus(200); 
  }
});

// 4. INICIO DEL SERVIDOR (Ajustado para Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bot activo y escuchando en el puerto ${PORT}`);
});
