const fs = require('fs');
const path = require('path');
const { fetchCountries } = require('./countries-services');

function getContentType(extname) {
  let contentType = '';

  switch (extname) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    default:
      contentType = 'application/octet-stream';
  }

  return contentType;
}

function readAndServe(filePath, extname, res) {
  filePath = decodeURIComponent(filePath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
    return;
  }

  fs.readFile(filePath, function (error, content) {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error: ' + error.code);
    } else {
      const contentType = getContentType(extname);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

function handleRequest(req, res) {
  console.log('Request:', req.method, req.url);
  let filePath = '.' + req.url;

  if (filePath === './') {
    filePath = './index.html';
  } else if (filePath.startsWith('./detail.html') || filePath.startsWith('./details.html')) {
    filePath = './details.html';
  }

  // API route: /countries (match with or without trailing slash or query)
  if (req.url && req.url.startsWith('/countries') && req.method === 'GET') {
    fetchCountries()
      .then(function (data) {
        if (data) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Response data is null');
        }
      })
      .catch(function (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to fetch data');
      });

    return;
  }

  const extname = path.extname(filePath);

  if (extname) {
    readAndServe(filePath, extname, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
  }
}

module.exports = {
  handleRequest,
  getContentType,
  readAndServe,
};
