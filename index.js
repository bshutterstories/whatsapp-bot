const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const input = msg.type === "interactive" ? msg.interactive.list_reply.id : msg.text?.body.toLowerCase().trim();

  if (input === "hola" || input === "menu") {
    await enviarMenu(from);
  } else if (input === "op_cat") {
    await enviarTexto(from, "📸 *Catálogo y Precios:*\nhttps://wa.me/c/50687086658");
  } else if (input === "op_paq") {
    await enviarTexto(from, "📦 *PAQUETES BRYAN:*\n\n✨ *Mini:* 6 fotos / 45 min / No cambios / ₡42,000\n🔥 *Mid:* 10 fotos / 1 hr / 1 cambio / ₡47,000\n👑 *Full:* 15 fotos / 1.5 hr / 2 cambios / ₡52,000");
  } else if (input === "op_ubi") {
    await enviarTexto(from, "📍 *UBICACIÓN:* Escazú, San Antonio.\n⏰ *HORARIO:* L-V 9am-7pm / S-D 9am-3pm.");
  } else if (input === "op_port") {
    await enviarTexto(from, "🖼️ *PORTAFOLIO:* https://bshutterstories.pixieset.com/bshutterportfolio/");
  } else if (input === "op_bry") {
    await enviarTexto(from, "🚀 ¡Listo! Bryan ya recibió tu notificación y te escribirá pronto.");
  }

  res.sendStatus(200);
});

async function enviarMenu(to) {
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: "BShutter Stories 📸" },
        body: { text: "¡Hola! Selecciona una opción del menú:" },
        footer: { text: "Asistente Virtual" },
        action: {
          button: "Ver Opciones",
          sections: [
            { title: "Precios", rows: [
                { id: "op_cat", title: "Catálogo", description: "Ver catálogo de WhatsApp" },
                { id: "op_paq", title: "Paquetes", description: "Detalles Mini, Mid y Full" }
            ]},
            { title: "Info", rows: [
                { id: "op_ubi", title: "Ubicación", description: "Horarios y lugar" },
                { id: "op_port", title: "Portafolio", description: "Mira mi trabajo" },
                { id: "op_bry", title: "Hablar con Bryan", description: "Agendar sesión" }
            ]}
          ]
        }
      }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { console.log("Error:", e.response?.data || e.message); }
}

async function enviarTexto(to, text
