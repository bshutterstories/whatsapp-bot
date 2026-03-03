const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// CONFIGURACIÓN (Tu nuevo token permanente)
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const WEBHOOK_TOKEN = "bryan123";
const PHONE_ID = "116586229808120"; // Tu ID de teléfono de Meta

// WEBHOOK PARA META (Verificación)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// RECEPCIÓN DE MENSAJES
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from;
      const text = msg.text ? msg.text.body.toLowerCase() : "";

      console.log("Mensaje recibido de:", from, "Texto:", text);

      // LÓGICA DEL MENÚ
      if (text === "hola" || text === "menu") {
        await enviarWhatsApp(from, "¡Hola! Bienvenido al bot de Bryan. \nElige una opción:\n1. Servicios\n2. Horarios\n3. Hablar con un humano");
      } else if (text === "1") {
        await enviarWhatsApp(from, "Of
