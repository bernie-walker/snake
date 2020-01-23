const { Server } = require('net');
const { Response } = require('./response');
const { readFileSync } = require('fs');

const getFileDetails = function(requiredResource, response) {
  const pubPath = `${__dirname.match(/.*\//)[0]}public`;
  const fileName = requiredResource === '/' ? '/index.html' : requiredResource;
  let content, code, length;

  try {
    content = readFileSync(`${pubPath}/${fileName}`, 'utf8');
    code = 200;
    length = content.length;
  } catch (e) {
    content = '';
    code = 404;
    length = 0;
  }

  response.addBody(content);
  response.updateResponse(code);
  response.updateHeader('Content-Length', length + 1);

  return response.getMessage();
};

const parseHeaders = function(headersAndBody) {
  return headersAndBody.reduce((container, element) => {
    const [key, value] = element.split(': ');
    container[key] = value;
    return container;
  }, {});
};

const getResponse = function(requestContent) {
  const [request, ...requestHeadersAndBody] = requestContent.split('\r\n');
  const [command, resource] = request.split(' ');
  const headers = parseHeaders(requestHeadersAndBody);
  const response = new Response(new Date());
  let responseMessage;

  if (command === 'GET') {
    responseMessage = getFileDetails(resource, response);
  }

  return responseMessage;
};

const handleRequest = function(socket) {
  console.log(`connected to ${socket.remoteAddress} at ${socket.remotePort}`);

  socket.setEncoding('utf8');

  socket.on('data', text => {
    socket.write(getResponse(text));
  });

  socket.on('close', () => console.log('socket closed'));
};

const main = function() {
  const server = new Server();

  server.on('connection', handleRequest);

  server.listen(4569, () => {
    console.log('server started', server.address());
  });
};

main();
