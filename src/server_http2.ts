const http2 = require('http2');

//openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-privkey.pem -out localhost-cert.pem
// const fs = require('fs');
const options = {
    // key: fs.readFileSync('localhost-privkey.pem'),
    // cert: fs.readFileSync('localhost-cert.pem'),
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
    .createServer(options, onRequest)
    .listen(port, () => { console.log(`http server listening on port ${port}`); });

// server.on('stream', (stream, headers) => {
//     stream.respond({
//       'content-type': 'text/html; charset=utf-8',
//       ':status': 200
//     });
//     stream.end('<h1>Hello World</h1>');
//   });

function onRequest(req, res) {

    console.info(req.httpVersion);

    // Detects if it is a HTTPS request or HTTP/2
    const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
        req.stream.session : req;

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end("{}");
}

// const port = process.env.PORT || 8080;
// server.listen(port, () => { console.log(`http server listening on port ${port}`); });
