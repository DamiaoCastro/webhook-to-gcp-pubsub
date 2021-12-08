import { Firewall } from "../src/firewall";
import * as sinon from "ts-sinon";
import { IncomingMessage, ServerResponse } from "node:http";

describe('test default response when NOT defined in the environment variables', function () {

    //arrange
    const environmentVariables: Dict<string> = {
        "test": "123",
        "IP_WHITELIST": "whatever-ip"
    };

    const request = sinon.stubInterface<IncomingMessage>();
    request.headers = {
        "x-forwarded-for": "totally-diferent-ip",
        "content-type": "application/json"
    };
    const response = sinon.stubInterface<ServerResponse>();
    response.writeHead.returns(response);

    const firewall = new Firewall(environmentVariables);

    //act
    firewall.requestHandler(request, response);

    //assert 
    // assertRequestListeners(request);

    // it('statusCode', function () {
    //     assert.equal(response.writeHead.callCount, 1);
    //     assert.equal(response.writeHead.getCall(0).firstArg, 200);
    // });

    // it('response body', function () {
    //     assert.equal(response.end.callCount, 1);
    //     assert.equal(response.end.getCall(0).firstArg, 'OK');
    // });

});