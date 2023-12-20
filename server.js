const http = require('http');
const app = require('./src/app.js');
const { createSocketServer } = require('./src/sockets/socketHandlers');

const server = http.createServer(app);
createSocketServer(server);

const PORTS = [3000,3001,3002,3003,3004,3005,3006,3007,3008,3009];
PORTS.forEach(port => {
  server.listen(port, () => {
    console.log(`Serveren er startet på port ${port}`);
  });
})

