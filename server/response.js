const statusCodeLookup = { 200: 'OK', 404: 'Not Found' };

class Response {
  constructor(date) {
    this.response = 'HTTP/1.0 ';
    this.header = {
      'Content-Length': 0,
      Date: date
    };
    this.body = '';
  }

  updateResponse(code) {
    this.response = `${this.response} ${code} ${statusCodeLookup[code]}`;
  }

  updateHeader(key, value) {
    this.header[key] = value;
  }

  addBody(content) {
    this.body = content;
  }

  getMessage() {
    const head = JSON.stringify(this.header)
      .slice(1, -1)
      .split(',')
      .map(headline => headline.replace(/"/g, ''));

    return (
      [this.response]
        .concat(head)
        .concat(['', this.body])
        .join('\r\n') + '\n'
    );
  }
}

module.exports = { Response };
