const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Token de acceso (Recuerda que si es temporal expira en 24h)
const TOKEN = "EAAW7lqynL1wBQyaWFf4V30yM4uYeoSxP7rZBxfSGW7mgPPrVglaSuuVZAtCVPATc5BZBiKA8XSWpoyhGinbjbrPrCRZBjZCGRCKoZCInQ6o3QPnmLzuRTfwZCaE93aefS628gfaMK4XVZApmJTHRxtsf3QTDqA9ZBjmRjKutVk3jQUHoI83q4eZC89yqofa3ZAs8dE4K6hqPGJW0VsGIL27alE2bKAc0Q2PGeGB3CkFM1IpH3ZAB9ffKQEKPKnT0AkSTlK7rii4L54TTy9BSuZATKLZCWKZBYIJCFudrE4ZD";
const PHONE_ID = "116586229808120";

app.get("/", (req, res) => {
  res.send("Servidor del bot funcionando 🚀");
});

// Verificación de Meta
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "bryan123";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Lógica del Bot
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const messages = entry?.messages;

    // IMPORTANTE: Ignora si no es un mensaje (evita que el bot se trabe)
    if (!messages || !messages[0]) {
      return res.sendStatus(200);
    }

    const from = messages[0].from;
    const text = messages[0].text?.body?.trim() || "";

    let reply = "";
    if (text === "1") {
      reply = "📸 Información de servicios: Fotografía profesional, eventos y sesiones individuales.";
    } else if (text === "2") {
      reply = "📍 Horarios: Lun-Vie 9am-6pm. San José, Costa Rica. Tel: +50612345678.";
    } else if (text === "3") {
      reply = "💰 Precios: Sesiones desde
