import { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import { Duplex } from 'node:stream';
import { IFirewall } from './types/IFirewall';

export class Webhook {

    private static readonly DefaultResponseEnvironmentKey: string = 'DEFAULT_RESPONSE';

    private defaultResponse: string = "OK";
    private readonly firewall: IFirewall;
    private readonly publisher: IPubsubPublisher;

    constructor(environmentVariables: Dict<string>, firewall: IFirewall, publisher: IPubsubPublisher) {
        this.analyseEnvironmentVariables(environmentVariables);
        this.firewall = firewall;
        this.publisher = publisher;
    }

    /**
     * Extracts from the passed environment variables the values that matter for this class.
     * At the moment only DEFAULT_RESPONSE
     * @param environmentVariables 
     */
    private analyseEnvironmentVariables(environmentVariables: Dict<string>) {

        const defaultResponse = environmentVariables[Webhook.DefaultResponseEnvironmentKey];
        if (defaultResponse && defaultResponse.length > 0) { this.defaultResponse = defaultResponse; }

    }

    public requestHandler: RequestListener = (request: IncomingMessage, response: ServerResponse) => {

        if (!this.firewall.isRequestAllowed(request)) { response.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found'); return; }

        const contentType = request.headers['content-type'];

        request.on('data', (data: Buffer) => {
            return this.publisher.publishMessageAsync(contentType, data);
        });

        request.on('end', () => {
            response.writeHead(200, { 'Content-Type': 'text/plain' }).end(this.defaultResponse);
        });

    }

    public errorHandler = (err: Error, socket: Duplex) => {
        console.error(err);
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    };

}