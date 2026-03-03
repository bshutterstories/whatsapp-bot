const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// --- CONFIGURACIÓN (Asegúrate de que estos datos sigan siendo válidos en tu panel de Meta) ---
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

// Ruta raíz para confirmar que el bot está encendido
app.get("/", (req, res) => res.status(200).send("Bot B Shutter Stories Online ✅"));

// Verificación del Webhook para Meta
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

// Recepción de mensajes
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const msg = changes?.value?.messages?.[0];

  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const input = msg.type === "interactive" 
    ? msg.interactive.list_reply.id 
    : (msg.text?.body || "").toLowerCase().trim();

  try {
    // 1. MENÚ PRINCIPAL (Activado con "Hola" o "Menu")
    if (input === "hola" || input === "menu") {
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: "B Shutter Stories" },
          body: { text: "Gracias por escribir a B Shutter Stories: Te habla el chatbot para ayudarte con tu consulta" },
          footer: { text: "Seleccioná una opción" },
          action: {
            button: "Ver opciones",
            sections: [
              {
                title: "Precio y Catálogos",
                rows: [
                  { id: "op_1_cat", title: "1 catalogos y precios", description: "Ver catálogo de WhatsApp" },
                  { id: "op_2_paq", title: "paquetes y precios", description: "Ver detalle Mini, Mid y Full" }
                ]
              },
              {
                title: "Información
