import { IncomingMessage, RequestListener, ServerResponse } from 'node:http';

interface Dict<T> {
    readonly [key: string]: T | undefined;
}

export class Webhook {

    private defaultResponse: string = "OK";

    constructor(environmentVariables: Dict<string>) {
        this.analyseEnvironmentVariables(environmentVariables);
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
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('OK');
    }

}