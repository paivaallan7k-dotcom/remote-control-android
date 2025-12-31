const WebSocket = require("ws");

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

let androidClient = null;
let webClient = null;

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      // IDENTIFICAÇÃO
      if (data.type === "android") {
        androidClient = ws;
        console.log("Android conectado");
        return;
      }

      if (data.type === "web") {
        webClient = ws;
        console.log("Web conectado");
        return;
      }

      // COMANDO vindo do navegador → Android
      if (androidClient && ws === webClient) {
        androidClient.send(JSON.stringify(data));
      }

    } catch (e) {
      console.log("Erro:", e.message);
    }
  });

  ws.on("close", () => {
    if (ws === androidClient) androidClient = null;
    if (ws === webClient) webClient = null;
    console.log("Cliente desconectado");
  });
});

console.log("Servidor rodando na porta", PORT);
