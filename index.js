const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// --- CONFIGURACIÓN ---
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

// VERIFICACIÓN DEL WEBHOOK
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

// GESTIÓN DE MENSAJES
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const msg = entry?.changes?.[0]?.value?.messages?.[0];

  if (msg) {
    const from = msg.from;
    const tipo = msg.type;
    
    // Obtenemos el texto o el ID del botón presionado
    const input = tipo === "interactive" ? msg.interactive.list_reply.id : msg.text?.body.toLowerCase().trim();

    if (input === "hola" || input === "menu" || input === "inicio") {
      await enviarMenuPrincipal(from);
    } 
    // RESPUESTAS A LAS OPCIONES DEL MENÚ
    else if (input === "op_catalogo") {
      await enviarTexto(from, "📸 *Catálogo y Precios Oficiales*\n\nPuedes ver todos nuestros productos aquí:\nhttps://wa.me/c/50687086658");
    } 
    else if (input === "op_paquetes") {
      const paquetes = "📦 *NUESTROS PAQUETES:*\n\n" +
                        "✨ *Paquete Mini:* 6 fotografías, sesión de 45 min máximo, sin cambios de ropa. \n💰 *42,000 colones.*\n\n" +
                        "🔥 *Paquete Mid (Más Popular):* 10 fotografías, sesión de 1 hora, 1 cambio extra de ropa. \n💰 *47,000 colones.*\n\n" +
                        "👑 *Paquete Full:* 15 fotografías, sesión de 1.5 horas, 2 cambios de ropa. \n💰 *52,000 colones.*";
      await enviarTexto(from, paquetes);
    } 
    else if (input === "op_ubicacion") {
      await enviarTexto(from, "📍 *UBICACIÓN Y HORARIO*\n\nEstoy ubicado en *San José, Escazú, San Antonio*.\n\n⏰ *Horario:*\n• Lunes a Viernes: 9:00 am - 7:00 pm\n• Sábados y Domingos: 9:00 am - 3:00 pm");
    } 
    else if (input === "op_portfolio") {
      await enviarTexto(from, "🖼️ *PORTAFOLIO DE CLIENTES*\n\nMira mis trabajos anteriores aquí:\nhttps://bshutterstories.pixieset.com/bshutterportfolio/");
    } 
    else if (input === "op_agendar") {
      await enviarTexto(from, "🚀 *¡EXCELENTE!* \n\nBryan ha sido notificado. En un momento se pondrá en contacto contigo para agendar tu sesión. ¡Gracias!");
    }
  }
  res.sendStatus(200);
});

// FUNCIÓN PARA ENVIAR EL MENÚ DESPLEGABLE
async function enviarMenuPrincipal(to) {
  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: "BShutter Stories 📸" },
      body: { text: "Hola! Soy el asistente de Bryan. ¿En qué puedo ayudarte hoy?" },
      footer: { text: "Selecciona una opción abajo" },
      action: {
        button: "Ver Menú",
        sections: [
          {
            title: "Precios y Catálogos",
            rows: [
              { id: "op_catalogo", title: "Catálogo General", description: "Link directo a WhatsApp" },
              { id: "op_paquetes", title: "Paquetes y Precios", description: "Mini, Mid y Full" }
            ]
          },
          {
            title: "Información y Contacto",
            rows: [
              { id: "op_ubicacion", title: "Ubicación y Horario", description: "Dónde encontrarnos" },
              { id: "op_portfolio", title: "Ver Portafolio", description: "Galería de clientes
