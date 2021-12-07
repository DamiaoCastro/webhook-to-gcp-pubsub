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

        const requestorIp = this.getRequestorIp(request);

        response.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');

    }

    private getRequestorIp(request: IncomingMessage): string {

        const proxiedIp: string | string[] = request.headers['x-forwarded-for'] ?? '';

        if (typeof (proxiedIp) === 'string') {
            if (proxiedIp && proxiedIp.length > 0) {
                return proxiedIp;
            }
        } else {
            throw new Error('Unexpected value for request.headers["x-forwarded-for"]');
        }

        console.info(`request.socket.remoteAddress: ${request.socket.remoteAddress}`);


        console.info(request.socket.remoteAddress);

        throw new Error('Function not implemented.');
    }

}