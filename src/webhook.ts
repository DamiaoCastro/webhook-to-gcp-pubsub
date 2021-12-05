import { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import { PubSubPublisher } from './pubsubPublisher';
import { Duplex } from 'node:stream';

export class Webhook {

    private defaultResponse: string = "OK";
    private readonly publisher: PubSubPublisher;

    constructor(environmentVariables: Dict<string>, publisher: PubSubPublisher) {
        this.analyseEnvironmentVariables(environmentVariables);
        this.publisher = publisher;
    }

    /**
     * Extracts from the passed environment variables the values that matter for this class.
     * At the moment: DEFAULT_RESPONSE
     * @param environmentVariables 
     */
    private analyseEnvironmentVariables(environmentVariables: Dict<string>) {

        const defaultResponse = environmentVariables["DEFAULT_RESPONSE"];
        if (defaultResponse && defaultResponse.length > 0) { this.defaultResponse = defaultResponse; }

    }

    public handlerHttp1: RequestListener = (request: IncomingMessage, response: ServerResponse) => {

        const contentType = request.headers['content-type'];


        request.on('data', (data : Buffer) => { 
            return this.publisher.publishMessageAsync(contentType, data);
        });

        // request.pipe();
        
        response.writeHead(200, { 'Content-Type': 'text/plain' }).end(this.defaultResponse);
    }

    public errorHandler = (err: Error, socket: Duplex) => {
        console.error(err);
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    };

}