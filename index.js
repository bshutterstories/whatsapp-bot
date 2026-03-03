const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// --- TUS DATOS ---
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

// 1. Verificación para Meta (ESTO ES LO QUE HACE QUE EL BOTON DE GUARDAR FUNCIONE)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === WEBHOOK_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    }
  }
  res.sendStatus(403);
});

// 2. Recepción de mensajes y lógica de botones
app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const input = msg.type === "interactive" ? msg.interactive.list_reply.id : (msg.text?.body || "").toLowerCase().trim();

  try {
    if (input === "hola" || input === "menu") {
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: "B Shutter Stories" },
          body: { text: "Gracias por escribir a B Shutter Stories: Te habla el chatbot para ayudarte con tu consulta" },
          action: {
            button: "Ver opciones",
            sections: [
              {
                title: "Precio y Catálogos",
                rows: [
                  { id: "op_1", title: "1 catalogos y precios", description: "Link al catálogo" },
                  { id: "op_2", title: "paquetes y precios", description: "Ver detalle Mini, Mid y Full" }
                ]
              },
              {
                title: "Información y Citas",
                rows: [
                  { id: "op_3", title: "Ubicacion y horario", description: "Ver dónde estoy" },
                  { id: "op_4", title: "Ver mi portafolio de clientes", description: "Link a Pixieset" },
                  { id: "op_5", title: "Estoy listo para agendar, quiero hablar con Bryan.", description: "Hablar con Bryan" }
                ]
              }
            ]
          }
        }
      }, { headers: { Authorization: `Bearer ${TOKEN}` } });
    } else {
      let txt = "";
      if (input === "op_1") txt = "Mira mi portafolio https://wa.me/c/50687086658";
      else if (input === "op_2") txt = "Paquete Mini 📸:\n6 fotografias, sesion de 45 minutos máximo sin cambios de ropa adicionales. 42,000 mil colones.\n\nPaquete Mid 📸: 10 fotografias, sesion de una hora y un cambio extra de ropa. (El mas popular entre los clientes) 47,000 mil colones\n\nPaquete Full 📸: 15 fotografias, sesion de una hora y media con 2 cambios de ropa. 52,000 mil colones.";
      else if (input === "op_3") txt = "Estoy ubicado en San Jose, Escazu, San Antonio. Y de Lunes a Viernes de 9:00 am a 7:00 pm, Sabados y Domingos de 9:00 am a 3:00 pm.";
      else if (input === "op_4") txt = "https://bshutterstories.pixieset.com/bshutterportfolio/";
      else if (input === "op_5") txt = "Ya Bryan te escribira en unos minutos para agendar tu espacio 📸";

      if (txt) {
        await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
          messaging_product: "whatsapp", to: from, text: { body: txt }
        }, { headers: { Authorization: `Bearer ${TOKEN}` } });
      }
    }
  } catch (e) { console.log("Error API"); }
  res.sendStatus(200);
});

// 3. Configuración del puerto para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
