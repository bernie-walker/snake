class Response {
  constructor(date) {
    this.response = 'HTTP/1.0 200 OK';
    this.header = {
      'content-Length': 0,
      Date: date
    };
    this.body = ['', ''];
  }

  addBody(content) {
    this.body.splice(0, 1, content);
  }

  getMessage() {
    const head = JSON.stringify(this.header)
      .slice(1, -1)
      .split(',')
      .map(headline => headline.replace(/"/g, ''));

    return [this.response]
      .concat(head)
      .concat(this.body)
      .join('\r\n');
  }
}

module.exports = { Response };
