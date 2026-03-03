const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const TOKEN = "EAAW7lqynL1wBQZBFrt5IluaZCvUgcmQJiy8ww3MG5Lj7wbrYgZC1Fr0vPEOKcDelX9fKN7MJoRfDkvXEwGDWXcEkNtvVJrMDxtLXXiUdFCm7VwlcJtbeI4KBughVp53wvA1xx8pMZBAWsVZAPP0dEsU7ZCbo7lN9jJAP11FWptvUseGeBR2Y9ndiGhmFtg1AZDZD";
const PHONE_ID = "948993161640189"; 
const WEBHOOK_TOKEN = "bryan123";

app.get("/", (req, res) => res.status(200).send("Bot funcionando ✅"));

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
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: "BShutter Stories 📸" },
          body: { text: "¡Hola! Soy el asistente virtual. Por favor seleccioná una opción del menú para ayudarte:" },
          footer: { text: "Menú interactivo" },
          action: {
            button: "Ver opciones",
            sections: [
              {
                title: "Precio y Catálogos",
                rows: [
                  { id: "op_catalogo_precios", title: "Catálogo y Precios", description: "Ver catálogo de WhatsApp" },
                  { id: "op_paquetes_detalle", title: "Paquetes y Precios", description: "Ver detalle Mini, Mid y Full" }
                ]
              },
              {
                title: "Información y Citas",
                rows: [
                  { id: "op_ubicacion_horario", title: "Ubicación y Horario", description: "Ver dónde estoy y horas" },
                  { id: "op_portafolio", title: "Ver mi portafolio", description: "Portafolio de clientes" },
                  { id: "op_hablar_bryan", title: "Hablar con Bryan", description: "Listo para agendar" }
                ]
              }
            ]
          }
        }
      }, { headers: { Authorization: `Bearer ${TOKEN}` } });
    } 
    else {
      let respuestaTxt = "";

      if (input === "op_catalogo_precios") {
        respuestaTxt = "Como es menu interactivo con botones por favor haz que se despiegle y de las opciones 1 catalogos y precios y si escogen esta opcion los redireccione aqui: https://wa.me/c/50687086658";
      } 
      else if (input === "op_paquetes_detalle") {
        respuestaTxt = "Paquete Mini: \n6 fotografias, sesion de 45 minutos máximo sin cambios de ropa adicionales. 42,000 mil colones.\n\n" +
                       "Paquete Mid: 10 fotografias, sesion de una hora y un cambio extra de ropa. (El mas popular entre los clientes) 47,000 mil colones\n\n" +
                       "Paquete Full: 15 fotografias, sesion de una hora y media con 2 cambios de ropa. 52,000 mil colones.";
      } 
      else if (input === "op_ubicacion_horario") {
        respuestaTxt = "''Estoy ubicado en San Jose, Escazu, San Antonio. Y de Lunes a Viernes de 9:00 am a 7:00 pm, Sabado y Domingo de 9:00 am a 3:00 pm.";
      } 
      else if (input === "op_portafolio") {
        respuestaTxt = "y que los envie a este link: https://bshutterstories.pixieset.com/bshutterportfolio/";
      } 
      else if (input === "op_hablar_bryan") {
        respuestaTxt = "Estoy listo para agendar, quiero hablar con Bryan.";
      }

      if (respuestaTxt) {
        await axios.post(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
          messaging_product: "whatsapp",
          to: from,
          text: { body: respuestaTxt }
        }, { headers: { Authorization: `Bearer ${TOKEN}` } });
      }
    }
  } catch (e) {
    console.error("Error en la API de WhatsApp");
  }
  
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Servidor activo en puerto ${PORT}`));
