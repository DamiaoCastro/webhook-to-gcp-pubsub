import { PubSubPublisher } from './pubsubPublisher';
import { Server } from 'node:http';
import { Duplex } from 'node:stream';
import { Webhook } from './webhook';

function startHttp1Server() {

  const http = require('http');

  const publisher = PubSubPublisher.new(process.env);
  const webhook = new Webhook(process.env, publisher);

  const server: Server = http.createServer(webhook.handlerHttp1);

  server.on('clientError', (err: Error, socket: Duplex) => {
    console.error(err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  const port = process.env.PORT || 8080;
  server.listen(port, () => { console.log(`http server listening on port ${port}`); });
}

startHttp1Server();