const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Configuracion de credenciales
// He pegado el token que me diste directamente para evitar fallos de variables
const TOKEN = "EAAW7lqynL1wBQ9yyyle4V0lp09BSnTlSUJN0VJlfDSkNtB0AReAycBfcWA3UscdUV6RrPcAq7lZBVGi5tJG2YIKPhbm3GhV3cHEHlqRyXI32lKjjpfafaPxOji9L5c1v6N0mWoZAIouYT0dQTr6jz6EOOMmzWO1fZB9zfhjkw53Hx65EztSnQ5ZASxnbRhKTd3OqQuDZBdAZDZD";
const PHONE_ID = process.env.PHONE_ID || "948993161640189"; 
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN || "tu_token_de_verificacion";

// 1. Verificación del Webhook (Lo que Meta usa para validar tu URL)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === WEBHOOK_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// 2. Recepción y respuesta de mensajes
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;

        if (body.object === 'whatsapp_business_account') {
            if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
                const message = body.entry[0].changes[0].value.messages[0];
                const from = message.from; // Número del cliente
                const msgText = message.text ? message.text.body : "Mensaje no recibido";

                console.log(`Mensaje recibido de ${from}: ${msgText}`);

                // Respuesta automática usando el nuevo Token
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        type: "text",
                        text: { body: "¡Hola! Gracias por contactarme. He recibido tu mensaje." }
                    },
                    headers: {
                        "Authorization": `Bearer ${TOKEN}`,
                        "Content-Type": "application/json"
                    }
                });
                
                console.log("Respuesta enviada con éxito");
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error detallado:', error.response ? error.response.data : error.message);
        res.sendStatus(200); // Meta requiere un 200 siempre para no bloquear el webhook
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Bot activo en puerto ${PORT}`);
});
