const { Server } = require('net');
const { readFileSync, existsSync } = require('fs');

const getFileDetails = function(requiredResource) {
  const pubPath = `${__dirname.match(/.*\//)[0]}public`;

  const fileName = requiredResource === '/' ? '/index.html' : requiredResource;

  if (existsSync(`${pubPath}${fileName}`)) {
    return {
      content: readFileSync(`${pubPath}${fileName}`, 'utf8'),
      code: '200 OK'
    };
  }

  return { content: '', code: '404 Not Found' };
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
  const date = new Date();
  let response = 'HTTP/1.0 422 Unprocessable Entity';
  3;
  let responseContent = '';

  if (command === 'GET') {
    const { content, code } = getFileDetails(resource);
    responseContent = content;
    response = `HTTP/1.0 ${code}`;
  }

  const body = (responseContent.length && [responseContent, '']) || [''];

  return [
    response,
    `Date: ${date.toUTCString()}`,
    'Server: SimpleHTTP/0.6',
    `Content-Length: ${responseContent.length}`,
    ''
  ]
    .concat(body)
    .join('\r\n');
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

  server.on('connection', socket => {
    const message = {
      response: 'HTTP/1.0 200 OK',
      header: {
        'content-Length': 0,
        Date: new Date()
      },
      body: ['', ''],
      getMessage: function() {
        const head = JSON.stringify(this.header)
          .slice(1, -1)
          .split(',')
          .map(headline => headline.replace(/"/g, ''));

        return [this.response]
          .concat(head)
          .concat(this.body)
          .join('\r\n');
      }
    };

    console.log(message.getMessage().split('\n'));
    socket.write(message.getMessage());
  });

  server.listen(4569, () => {
    console.log('server started', server.address());
  });
};

main();
