const http = require('http');
const { handleRequest } = require('./controller');

// Start with the environment port or your default 3002
let PORT = process.env.PORT || 3002;

const server = http.createServer(handleRequest);

function startServer() {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('server.js loaded from', __filename);
    console.log('server running in', __dirname);
  });
}

// Catch the 'address already in use' error and automatically shift up by 1
server.on('error', (er) => {
  if (er.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy. Automatically trying port ${PORT + 1}...`);
    PORT++;
    startServer();
  } else {
    throw er; // Throw any other unexpected errors
  }
});

startServer();