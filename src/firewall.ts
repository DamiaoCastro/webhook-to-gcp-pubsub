import { IncomingMessage, RequestListener, ServerResponse } from 'node:http';

export class Firewall {

    private ipWhitelist: string = "";

    /**
     *
     */
    constructor(environmentVariables: Dict<string>) {

        const ipWhitelist = environmentVariables["IP_WHITELIST"];
        if (ipWhitelist && ipWhitelist.length > 0) { this.ipWhitelist = ipWhitelist; }

    }

    public requestHandler: RequestListener = (request: IncomingMessage, response: ServerResponse) => {

        console.info(request.socket.remoteAddress);

        response.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');

    }

}