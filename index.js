const express = require("express");
const app = express();

app.use(express.json());

// Endpoint principal
app.get("/", (req, res) => {
  res.send("Servidor del bot funcionando 🚀");
});

// Webhook GET: Verificación con Meta
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "bryan123"; // Pega este mismo token en Meta

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado correctamente!");
      res.send(challenge); // Solo texto plano
    } else {
      res.sendStatus(403);
    }
  }
});

// Webhook POST: Aquí llegan los mensajes de WhatsApp
app.post("/webhook", (req, res) => {
  console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
