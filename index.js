const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// CONFIGURACIÓN ACTUALIZADA
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; // El ID correcto de tu pantallazo
const WEBHOOK_TOKEN = "bryan123";

// VERIFICACIÓN PARA META
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) {
    return res.send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// RECEPCIÓN DE MENSAJES
app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  
  if (msg) {
    const from = msg.from;
    const text = msg.text?.body?.toLowerCase();
    console.log(`Mensaje de: ${from} Texto: ${text}`);

    let respuesta = "¡Bot activo! Escribe 'Menu' para opciones.";
    if (text === "hola" || text === "menu") {
      respuesta = "¡Hola Bryan! \n1. Ver servicios\n2. Contactar soporte";
    }

    try {
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: { body: respuesta },
      }, {
        headers: { 
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json" 
        }
      });
      console.log("Respuesta enviada correctamente");
    } catch (error) {
      console.error("Error API Meta:", error.response?.data || error.message);
    }
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto
