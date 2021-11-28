import { Request, Response } from "express";

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

    public handler = (request: Request, response: Response) => {
        response.status(200).send(this.defaultResponse);
    }

}