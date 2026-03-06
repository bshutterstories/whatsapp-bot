const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Leer variables desde Railway (Asegúrate de que no tengan espacios al final)
const TOKEN = process.env.TOKEN;
const PHONE_ID = process.env.PHONE_ID;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

// Verificación del Webhook
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === WEBHOOK_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

// Recepción de mensajes
app.post('/webhook', async (req, res) => {
    try {
        // Accedemos a los datos del mensaje
        const entry = req.body.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;
        const message = value.messages ? value.messages[0] : null;

        if (message) {
            const from = message.from;
            const text = message.text.body;

            console.log(`Mensaje de ${from}: ${text}`);

            // Respuesta automática estructurada correctamente para la API de WhatsApp
            await axios.post(`https://graph.facebook.com/v22.0/${PHONE_ID}/messages`, {
                messaging_product: 'whatsapp',
                to: from,
                type: 'text',
                text: { 
                    body: '¡Hola! He recibido tu mensaje correctamente.' 
                }
            }, {
                headers: { 
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json' 
                }
            });
        }
        res.sendStatus(200);
    } catch (error) {
        // Esto mostrará el error específico en los Logs de Railway
        console.error('Error al procesar mensaje:', error.response?.data || error.message);
        res.sendStatus(200);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Bot activo en puerto ${PORT}`);
});
