import { PubSubPublisher } from './pubsubPublisher';
import { Server } from 'node:http';
import { Webhook } from './webhook';
import { Firewall } from './firewall';

async function startHttp1Server() {

  const http = require('http');

  const publisher = PubSubPublisher.new(process.env);
  await publisher.checkPublishPermissionsAsync();

  const firewall = await Firewall.getFirewallAsync(process.env);
  const webhook = new Webhook(process.env, firewall, publisher);

  const server: Server = http.createServer();
  server.on('request', webhook.requestHandler);
  server.on('clientError', webhook.errorHandler);

  const port = process.env.PORT || 8080;
  server.listen(port, () => { console.log(`http server listening on port ${port}`); });
}

startHttp1Server().catch((error: Error) => { console.error(error); return 0; });