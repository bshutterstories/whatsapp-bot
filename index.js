const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// --- CONFIGURACIÓN ---
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

// VERIFICACIÓN DEL WEBHOOK (Para Meta)
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

// GESTIÓN DE MENSAJES Y MENÚ
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const msg = changes?.value?.messages?.[0];

  if (msg) {
    const from = msg.from;
    const text = msg.text?.body?.toLowerCase().trim();
    console.log(`Mensaje recibido: "${text}" de ${from}`);

    let respuesta = "";

    // LÓGICA DEL MENÚ INTERACTIVO
    if (text === "hola" || text === "menu" || text === "inicio") {
      respuesta = "🌟 *BIENVENIDO AL MENÚ PRINCIPAL* 🌟\n\n" +
                  "Por favor, responde con un número para ayudarte:\n\n" +
                  "1️⃣ *Nuestros Servicios*\n" +
                  "2️⃣ *Ubicación y Horarios*\n" +
                  "3️⃣ *Hablar con un Agente*\n\n" +
                  "👉 Escribe *Menu* en cualquier momento para volver aquí.";
    } 
    else if (text === "1") {
      respuesta = "📸 *NUESTROS SERVICIOS*\n\n" +
                  "• Fotografía de Eventos\n" +
                  "• Sesiones Retrato\n" +
                  "• Edición Digital\n\n" +
                  "¿Te gustaría una cotización? Escribe *3* para contactarnos.";
    } 
    else if (text === "2") {
      respuesta = "📍 *UBICACIÓN Y HORARIOS*\n\n" +
                  "Estamos en San José, Costa Rica.\n" +
                  "Lunes a Viernes: 8:00 AM - 6:00 PM\n" +
                  "Sábados: Con cita previa.";
    } 
    else if (text === "3") {
      respuesta = "👨‍💻 *CONTACTO DIRECTO*\n\n" +
                  "Un agente se pondrá en contacto contigo en breve a este número. ¡Gracias por tu paciencia!";
    } 
    else {
      respuesta = "Opps! No reconozco esa opción. 😅\n\nEscribe *Menu* para ver las opciones disponibles.";
    }

    // ENVÍO DE LA RESPUESTA
    try {
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: { body: respuesta },
      }, {
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
      });
      console.log("Respuesta enviada con
