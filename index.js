const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// CONFIGURACIÓN (RECUERDA: Mantén esto en secreto)
const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "1048401435016270";
const WEBHOOK_TOKEN = "bryan123";

// 1. Verificación del Webhook
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

// 2. Ruta para ACTIVAR el número (Llama a esto una sola vez desde el navegador)
app.get("/activar-numero", async (req, res) => {
    try {
        const url = `https://graph.facebook.com/v21.0/${PHONE_ID}/register`;
        const response = await axios.post(url, {
            messaging_product: "whatsapp",
            pin: "123456" 
        }, {
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        res.status(200).json({ success: true, respuesta_meta: response.data });
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// 3. Recepción de mensajes
app.post("/webhook", async (req, res) => {
    try {
        const value = req.body.entry[0].changes[0].value;
        if (value.messages) {
            const sender = value.messages[0].from;
            const text = value.messages[0].text.body;
            console.log(`Mensaje de ${sender}: ${text}`);
            await sendWhatsAppMessage(sender, "¡Hola! He recibido tu mensaje correctamente.");
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

async function sendWhatsAppMessage(to, text) {
    const url = `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`;
    await axios.post(url, {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text }
    }, {
        headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" }
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot activo en puerto ${PORT}`));
