const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

// Ruta de prueba para ver en el navegador
app.get("/", (req, res) => res.send("Bot funcionando ✅"));

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const input = msg.type === "interactive" ? msg.interactive.list_reply.id : msg.text?.body?.toLowerCase().trim();

  // Respuestas rápidas
  let textOut = "";
  if (input === "hola" || input === "menu") return await enviarMenu(from, res);
  if (input === "op_cat") textOut = "📸 Catálogo: https://wa.me/c/50687086658";
  else if (input === "op_paq") textOut = "📦 *PAQUETES:*\n✨ Mini: ₡42k\n🔥 Mid: ₡47k\n👑 Full: ₡52k";
  else if (input === "op_ubi") textOut = "📍 Escazú, San Antonio.\n⏰ L-V 9am-7pm / S-D 9am-3pm.";
  else if (input === "op_port") textOut = "🖼️ Portafolio: https://bshutterstories.pixieset.com/bshutterportfolio/";
  else if (input === "op_bry") textOut = "🚀 Bryan te contactará pronto.";

  if (textOut) await enviarTexto(from, textOut);
  res.sendStatus(200);
});

async function enviarMenu(to, res) {
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "interactive",
      interactive: {
        type: "list", header: { type: "text", text: "BShutter Stories 📸" },
        body: { text: "¡Hola! Elige una opción:" },
        action: {
          button: "Ver Opciones",
          sections: [
            { title: "Precios", rows: [{ id: "op_cat", title: "Catálogo" }, { id: "op_paq", title: "Paquetes" }] },
            { title: "Info", rows: [{ id: "op_ubi", title: "Ubicación" }, { id: "op_port", title: "Portafolio" }, { id: "op_bry", title: "Agendar" }] }
          ]
        }
      }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { console.log("Error Menu:", e.message); }
  res.sendStatus(200);
}

async function enviarTexto(to, text) {
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp", to, text: { body: text }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { console.log("Error Texto:", e.message); }
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => console.log(`Puerto: ${PORT}`));
