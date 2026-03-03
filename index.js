const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

app.get("/", (req, res) => res.status(200).send("Bot Online ✅"));

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === WEBHOOK_TOKEN) return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const input = msg.type === "interactive" ? msg.interactive.list_reply.id : (msg.text?.body || "").toLowerCase().trim();

  try {
    if (input === "hola" || input === "menu") {
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp", to: from, type: "interactive",
        interactive: {
          type: "list", header: { type: "text", text: "BShutter Stories 📸" },
          body: { text: "¡Hola! Seleccioná una opción del menú para ayudarte:" },
          action: {
            button: "Ver opciones",
            sections: [
              { title: "Precio y Catálogos", rows: [
                { id: "op_cat", title: "Catálogos y Precios", description: "Catálogo de WhatsApp" },
                { id: "op_paq", title: "Paquetes y Precios", description: "Detalle Mini, Mid y Full" }
              ]},
              { title: "Información y Citas", rows: [
                { id: "op_ubi", title: "Ubicación y Horario", description: "Dónde estoy y horas" },
                { id: "op_port", title: "Ver mi portafolio", description: "Portafolio de clientes" },
                { id: "op_bry", title: "Hablar con Bryan", description: "Listo para agendar" }
              ]}
            ]
          }
        }
      }, { headers: { Authorization: `Bearer ${TOKEN}` } });
    } 
    else {
      let txt = "";
      if (input === "op_cat") txt = "Aquí puedes ver nuestros catálogos y precios oficiales: https://wa.me/c/50687086658";
      else if (input === "op_paq") txt = "*Paquete Mini:* 6 fotos, 45 min, ₡42k.\n*Paquete Mid:* 10 fotos, 1 hr, 1 cambio (Popular), ₡47k.\n*Paquete Full:* 15 fotos, 1.5 hr, 2 cambios, ₡52k.";
      else if (input === "op_ubi") txt = "Estoy ubicado en San Jose, Escazu, San Antonio. L-V de 9am-7pm, S y D de 9am-3pm.";
      else if (input === "op_port") txt = "Mira mi portafolio de clientes aquí: https://bshutterstories.pixieset.com/bshutterportfolio/";
      else if (input === "op_bry") txt = "Estoy listo para agendar, quiero hablar con Bryan.";

      if (txt) {
        await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
          messaging_product: "whatsapp", to: from, text: { body: txt }
        }, { headers: { Authorization: `Bearer ${TOKEN}` } });
      }
    }
  } catch (e) { console.log("Error API"); }
  
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
