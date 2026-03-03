const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

// --- INICIO DE LÓGICA DE SILENCIO ---
const usuariosSilenciados = new Map();
// --- FIN DE LÓGICA DE SILENCIO ---

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === WEBHOOK_TOKEN) return res.status(200).send(challenge);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const rawInput = (msg.text?.body || "").toLowerCase().trim();
  const inputId = msg.type === "interactive" ? msg.interactive.list_reply.id : "";

  // --- FILTRO DE SILENCIO ---
  if (usuariosSilenciados.has(from)) {
    const tiempoExpiracion = usuariosSilenciados.get(from);
    if (Date.now() < tiempoExpiracion) {
      console.log(`Bot silenciado para ${from}. Bryan está al mando.`);
      return res.sendStatus(200);
    } else {
      usuariosSilenciados.delete(from); // El tiempo pasó, el bot puede volver a actuar
    }
  }
  // --- FIN FILTRO ---

  const palabrasActivadoras = [
    "hola", "menu", "precio", "informacion", "info", "fotos", "fotografia", "quiero",
    "interesa", "buenas", "sesion", "cotización", "cotizar", "paquetes","información",  
    "costo", "vale", "agendar", "disponibilidad", "cita", "lugar", "ubicación", "buenos",
    "horario", "portafolio", "book", "tardes", "dias", "noches", "ubicacion", "cotizacion", "video", 
  ];
  
  const debeActivarMenu = palabrasActivadoras.some(palabra => rawInput.includes(palabra));

  try {
    if (debeActivarMenu || inputId === "menu_principal") {
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: "Hola como estás?" },
          body: { text: "Gracias por escribir a B Shutter Stories 📸: Te habla el chatbot 🤖 para ayudarte con tu consulta" },
          action: {
            button: "Ver opciones",
            sections: [
              {
                title: "Precio y Catálogos",
                rows: [
                  { id: "op_1", title: "Catálogos y precios", description: "Tipos de sesiones" },
                  { id: "op_2", title: "Paquetes y precios", description: "Ver paquetes Mini, Mid y Full" }
                ]
              },
              {
                title: "Información y Citas",
                rows: [
                  { id: "op_3", title: "Ubicación y horario", description: "Ver ubicación" },
                  { id: "op_4", title: "Portafolio clientes", description: "Ver mi portafolio de clientes" },
                  { id: "op_5", title: "Hablar con Bryan", description: "Estoy listo para agendar, quiero hablar con Bryan." }
                ]
              }
            ]
          }
        }
      }, { headers: { Authorization: `Bearer ${TOKEN}` } });
    } else {
      let txt = "";
      if (inputId === "op_1") txt = "Aquí te dejo el catálogo detallado, con los tipos de sesiones que hago y precios 📸: https://wa.me/c/50687086658";
      else if (inputId === "op_2") txt = "Paquete Mini 📸:\n6 fotografias, sesion de 45 minutos máximo sin cambios de ropa adicionales. 42,000 mil colones.\n\nPaquete Mid 📸:\n10 fotografias, sesion de una hora y un cambio extra de ropa. (El mas popular entre los clientes) 47,000 mil colones\n\nPaquete Full 📸:\n15 fotografias, sesion de una hora y media con 2 cambios de ropa. 52,000 mil colones.";
      else if (inputId === "op_3") txt = "Estoy ubicado en San Jose, Escazú, San Antonio 📍. Y de Lunes a Viernes de 9:00 am a 7:00 pm, Sabados y Domingos de 9:00 am a 3:00 pm.";
      else if (inputId === "op_4") txt = "Te comparto un poco de los clintes que han confiando en mi trabajo: https://bshutterstories.pixieset.com/bshutterportfolio/";
      else if (inputId === "op_5") {
        txt = "Ya Bryan te escribirá en unos minutos para agendar tu espacio 📸. (El chatbot se desactivará para ti por 24 horas).";
        // ACTIVAR EL SILENCIO POR 24 HORAS
        usuariosSilenciados.set(from, Date.now() + (24 * 60 * 60 * 1000));
      }

      if (txt) {
        await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
          messaging_product: "whatsapp", to: from, text: { body: txt }
        }, { headers: { Authorization: `Bearer ${TOKEN}` } });
      }
    }
  } catch (e) { console.log("Error:", JSON.stringify(e.response?.data)); }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => console.log(`Servidor activo puerto ${PORT}`));
