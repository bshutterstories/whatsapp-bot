const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Leer variables desde Railway (NO ESCRIBAS EL TOKEN AQUÍ)
const TOKEN = process.env.TOKEN;
const PHONE_ID = process.env.PHONE_ID;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

// Verificación del Webhook (Esto es lo que Meta usa para conectar)
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
        const message = req.body.entry[0].changes[0].value.messages[0];
        if (message) {
            const from = message.from;
            const text = message.text.body;

            console.log(`Mensaje de ${from}: ${text}`);

            // Respuesta automática
            await axios.post(`https://graph.facebook.com/v22.0/${PHONE_ID}/messages`, {
                messaging_product: 'whatsapp',
                to: from,
                text: { body: '¡Hola! He recibido tu mensaje correctamente.' }
            }, {
                headers: { 'Authorization': `Bearer ${TOKEN}` }
            });
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error al procesar mensaje:', error.response?.data || error.message);
        res.sendStatus(200);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Bot activo en puerto ${PORT}`);
});
