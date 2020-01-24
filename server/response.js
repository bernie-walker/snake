const statusCodeLookup = { 200: 'OK', 404: 'Not Found' };

class Response {
  #response;
  #header;
  #body;

  constructor(date) {
    this.#response = 'HTTP/1.0 ';
    this.#header = {
      'Content-Length': 0,
      Date: date
    };
    this.#body = '';
  }

  updateResponse(code) {
    this.#response = `${this.#response} ${code} ${statusCodeLookup[code]}`;
  }

  updateHeader(key, value) {
    this.#header[key] = value;
  }

  addBody(content) {
    this.#body = content;
  }

  getMessage() {
    const head = JSON.stringify(this.#header)
      .slice(1, -1)
      .split(',')
      .map(headline => headline.replace(/"/g, ''));

    return (
      [this.#response]
        .concat(head)
        .concat(['', this.#body])
        .join('\r\n') + '\n'
    );
  }
}

const parseHeaders = function(headers) {
  return headers.reduce((container, element) => {
    const [key, value] = element.split(': ');
    container[key] = value;
    return container;
  }, {});
};

class Request {
  #command;
  #resource;
  #headers;
  #body;

  constructor(command, resource, headers, body) {
    this.#command = command;
    this.#resource = resource;
    this.#headers = headers;
    this.#body = body;
  }

  get command() {
    return this.#command;
  }

  get resource() {
    return this.#resource;
  }

  static from(userRequest) {
    const [top, body] = userRequest.split('\r\n\r\n');
    const head = top.split('\r\n');
    const requestLine = head[0];
    const [command, resource] = requestLine.split(' ');
    const headers = parseHeaders(head.slice(1));

    return new Request(command, resource, headers, body);
  }
}

module.exports = { Response, Request };
