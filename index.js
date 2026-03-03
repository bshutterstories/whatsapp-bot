const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

app.get("/", (req, res) => res.send("Bot funcionando ✅"));

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const input = msg.type === "interactive" ? msg.interactive.list_reply.id : msg.text?.body?.toLowerCase().trim();

  // --- LÓGICA DE RESPUESTAS CON TU INFO EXACTA ---
  
  if (input === "hola" || input === "menu") {
    await enviarMenu(from, res);
  } 
  else if (input === "op_catalogo_precios") {
    await enviarTexto(from, "Aquí puedes ver nuestros catálogos y precios oficiales:\nhttps://wa.me/c/50687086658");
  } 
  else if (input === "op_paquetes_detalle") {
    const textoPaquetes = "*Paquete Mini:* \n6 fotografias, sesion de 45 minutos máximo sin cambios de ropa adicionales. 42,000 mil colones.\n\n" +
                          "*Paquete Mid:* \n10 fotografias, sesion de una hora y un cambio extra de ropa. (El mas popular entre los clientes) 47,000 mil colones.\n\n" +
                          "*Paquete Full:* \n15 fotografias, sesion de una hora y media con 2 cambios de ropa. 52,000 mil colones.";
    await enviarTexto(from, textoPaquetes);
  } 
  else if (input === "op_ubicacion_horario") {
    await enviarTexto(from, "Estoy ubicado en San Jose, Escazu, San Antonio. Y de Lunes a Viernes de 9:00 am a 7:00 pm, Sabado y Domingo de 9:00 am a 3:00 pm.");
  } 
  else if (input === "op_portafolio") {
    await enviarTexto(from, "Mira mi portafolio de clientes aquí:\nhttps://bshutterstories.pixieset.com/bshutterportfolio/");
  } 
  else if (input === "op_hablar_bryan") {
    await enviarTexto(from, "Estoy listo para agendar, quiero hablar con Bryan.");
  }

  if (!res.headersSent) res.sendStatus(200);
});

async function enviarMenu(to, res) {
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: "BShutter Stories 📸" },
        body: { text: "¡Hola! Soy el asistente virtual. Por favor seleccioná una opción del menú para ayudarte:" },
        footer: { text: "Menú interactivo" },
        action: {
          button: "Ver opciones",
          sections:
