const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('Servidor WebSocket rodando na porta 8080');

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);

    // Reenvia a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Certifique-se de enviar o texto puro, sem Buffer
        client.send(message.toString());
      }
      
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});
