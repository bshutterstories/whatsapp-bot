const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// CONFIGURACIÓN USANDO VARIABLES DE ENTORNO
// En Railway, ve a "Variables" y agrega: TOKEN, PHONE_ID, WEBHOOK_TOKEN
const TOKEN = process.env.TOKEN;
const PHONE_ID = process.env.PHONE_ID;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

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

// 2. Ruta para ACTIVAR el número
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

// 3. Recepción de mensajes (MEJORADA PARA QUE NO SE CAIGA)
app.post("/webhook", async (req, res) => {
    try {
        const entry = req.body.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        if (value.messages && value.messages.length > 0) {
            const sender = value.messages[0].from;
            // Si no hay texto (ej: enviaron una imagen), ponemos un mensaje por defecto
            const text = value.messages[0].text ? value.messages[0].text.body : "Mensaje multimedia recibido";
            
            console.log(`Mensaje de ${sender}: ${text}`);
            await sendWhatsAppMessage(sender, "¡Hola! He recibido tu mensaje correctamente.");
        }
        res.sendStatus(200); // Siempre responder 200 a Meta
    } catch (error) {
        console.error("Error en webhook:", error.message);
        res.sendStatus(200); 
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

// Usamos el puerto que asigne Railway, por defecto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Bot activo en puerto ${PORT}`));
