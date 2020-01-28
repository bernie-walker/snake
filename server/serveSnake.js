const { Server } = require('http');
const { readFileSync } = require('fs');
const CONT_TYPE = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  gif: 'image/gif',
  pdf: 'application/pdf',
  jpg: 'image/jpg'
};

const getFileDetails = function(resource, response) {
  const pubPath = `${__dirname.match(/.*\//)[0]}public`;
  const fileName = resource === '/' ? '/index.html' : resource;
  let content;

  try {
    content = readFileSync(`${pubPath}/${fileName}`);
    const ext = fileName.match(/.*\.(.*)$/)[1];
    response.setHeader('Content-Type', CONT_TYPE[ext]);
  } catch (e) {
    response.writeHead(404);
    response.end();
    return;
  }

  response.end(content, 'utf8');
};

const main = function() {
  const server = new Server((request, response) => {
    const { socket } = request;
    console.log(`connected to ${socket.remoteAddress} at ${socket.remotePort}`);

    if (request.method === 'GET') {
      responseMessage = getFileDetails(request.url, response);
      return;
    }

    response.writeHead(422);
    response.end();
  });

  server.listen(3000, () => {
    console.log('server started', server.address());
  });
};

main();
