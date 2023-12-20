const http = require("http");
const app = require("./src/app.js");
const { createSocketServer } = require("./src/sockets/socketHandlers");

const server = http.createServer(app);
createSocketServer(server);

const port = 3000

server.listen(port, () => {
  console.log(`Serveren er startet på port ${port}`);
});
