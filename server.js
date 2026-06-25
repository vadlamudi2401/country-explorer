const http = require('http');
const { handleRequest } = require('./controller');

const PORT = process.env.PORT || 3002;

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('server.js loaded from', __filename);
  console.log('server running in', __dirname);
});
