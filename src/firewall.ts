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
        console.info(`requestorIp: ${requestorIp}`);

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
        //example  ::ffff:169.254.8.129
        const remoteAddress = request.socket.remoteAddress?.replace(RegExp('$::ffff:'), '');

        if (remoteAddress && remoteAddress.length > 0) {
            return remoteAddress;
        }

        throw new Error('request ip not determined');
    }

}