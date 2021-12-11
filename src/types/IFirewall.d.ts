import { IncomingMessage } from "node:http";

interface IFirewall {

    isRequestAllowed(request: IncomingMessage): boolean;
    
}