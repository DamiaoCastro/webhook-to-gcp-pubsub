const http2 = require('http2');

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `http2.createSecureServer()`
// is necessary when communicating with browser clients.
const {
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;


// const server = http2.createServer();


//openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-privkey.pem -out localhost-cert.pem
const fs = require('fs');
const options = {
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem'),
    allowHTTP1: true
};


// let t = (stream, headers) => {
//     stream.respond({
//       'content-type': 'text/html; charset=utf-8',
//       ':status': 200
//     });
//     stream.end('<h1>Hello World</h1>');
//   };

// Create a secure HTTP/2 server
const port = process.env.PORT || 8080;
const server = http2
    .createSecureServer(options, onRequest)
    .listen(port, () => { console.log(`http server listening on port ${port}`); });

// server.on('stream', (stream, headers) => {
//     stream.respond({
//       'content-type': 'text/html; charset=utf-8',
//       ':status': 200
//     });
//     stream.end('<h1>Hello World</h1>');
//   });

function onRequest(req, res) {
    // Detects if it is a HTTPS request or HTTP/2
    const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
        req.stream.session : req;
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end("OK");
}

// const port = process.env.PORT || 8080;
// server.listen(port, () => { console.log(`http server listening on port ${port}`); });
