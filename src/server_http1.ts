import { PubSubPublisher } from './pubsubPublisher';
import { Server } from 'node:http';
import { Webhook } from './webhook';

async function startHttp1Server() {

  const http = require('http');

  const publisher = PubSubPublisher.new(process.env);
  await publisher.checkPublishPermissionsAsync();

  const webhook = new Webhook(process.env, publisher);

  const server: Server = http.createServer();
  server.on('request', webhook.handlerHttp1);
  server.on('clientError', webhook.errorHandler);

  const port = process.env.PORT || 8080;
  server.listen(port, () => { console.log(`http server listening on port ${port}`); });
}

startHttp1Server().catch((error: Error) => { console.error(error); return 0; });