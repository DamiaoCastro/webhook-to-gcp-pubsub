import { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import { PubSubPublisher } from './pubsubPublisher';

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

        // var body = request.read();
        console.log("body:");
        // console.log(body);

        response.writeHead(200, { 'Content-Type': 'text/plain' }).end(this.defaultResponse);
    }

}