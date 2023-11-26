const http = require('http');
const app = require('./src/app');
const { createSocketServer } = require('./src/sockets/socketHandlers');

const server = http.createServer(app);
createSocketServer(server);

const port = 3000;
server.listen(port, () => {
  console.log(`Server kører på http://localhost:${port}`);
});
