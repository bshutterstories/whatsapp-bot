const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// CONFIGURACIÓN ACTUALIZADA
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "1048401435016270"; // Tu nuevo ID verificado
const WEBHOOK_TOKEN = "bryan123";

// 1. Verificación del Webhook (Lo que Meta pide para conectar)
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

// 2. Recepción de mensajes (Aquí es donde el bot "escucha")
app.post("/webhook", async (req, res) => {
    try {
        const entry = req.body.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        if (value.messages) {
            const message = value.messages[0];
            const sender = message.from; // Número del cliente
            const text = message.text.body;

            console.log(`Mensaje recibido de ${sender}: ${text}`);

            // Respuesta automática sencilla
            await sendWhatsAppMessage(sender, "¡Hola! He recibido tu mensaje.");
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Error procesando mensaje:", error);
        res.sendStatus(500);
    }
});

// 3. Función para enviar mensajes
async function sendWhatsAppMessage(to, text) {
    const url = `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`;
    
    await axios.post(url, {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text }
    }, {
        headers: {
            "Authorization": `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
        }
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot activo en puerto ${PORT}`));
