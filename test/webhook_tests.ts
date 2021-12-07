import { describe } from "mocha";
import { Webhook } from "../src/webhook";
import { strict as assert } from 'assert';
import { IncomingMessage, ServerResponse } from "node:http";
// import { sinon } from 'sinon';
const http = require('http');
// const sinon = require('sinon');
import * as sinon from "ts-sinon";

// const publishMessageAsync = sinon.;

const publisher: IPubsubPublisher = sinon.stubInterface<IPubsubPublisher>();

// const publisher: IPubsubPublisher = {
//     publishMessageAsync: publishMessageAsync,
//     checkPublishPermissionsAsync: function (): Promise<void> { throw new Error("Function not implemented."); }
// };

describe('test default response when NOT defined in the environment variables', function () {

    //arrange
    const environmentVariables: Dict<string> = {
        "test": "123",
    };

    const webhook = new Webhook(environmentVariables, publisher);

    const request = sinon.stubInterface<IncomingMessage>();
    request.headers = {
        "content-type": "application/json"
    };
    // request.on = sinon.fake();
    // const response = sinon.mock(http.ServerResponse);
    const response = sinon.stubInterface<ServerResponse>();

    //act
    webhook.handlerHttp1(request, response);

    //assert 
    it('request on data', function () {
        assert.equal(request.on.callCount, 2);
        const dataListener = request.on.getCalls().find(c => c.firstArg === 'data');
        assert.equal(dataListener.firstArg, 'data');
        //call listener function for 'data' event
        dataListener.lastArg(Buffer.from('test'));
        const endListener = request.on.getCalls().find(c => c.firstArg === 'end');
        assert.equal(endListener.firstArg, 'end');
        //call listener function for 'end' event
        endListener.lastArg();
    });

    it('statusCode', function () {
        assert.equal(response.writeHead.callCount, 1);
        assert.equal(response.writeHead.getCall(0).firstArg, 200);
    });

    it('response body', function () {
        assert.equal(response.end.callCount, 1);
        assert.equal(response.end.getCall(0).firstArg, 'OK');
    });

});


// describe('test default response when defined in the environment variables', function () {

//     //arrange
//     const defaultResponse = "[default response]";

//     const environmentVariables = {
//         "test": "123",
//         "DEFAULT_RESPONSE": defaultResponse,
//     };

//     const webhook = new Webhook(environmentVariables);

//     const request = mockRequest({ body: "{ some dummy body }" })
//     const response = mockResponse();

//     //act
//     webhook.handler(request, response);

//     //assert
//     it('statusCode', function () {
//         assert.equal(response.status.calledOnce, true);
//         assert.equal(response.status.calledOnceWith(200), true);
//     });

//     it('response body', function () {
//         assert.equal(response.send.calledOnce, true);
//         assert.equal(response.send.calledOnceWith(defaultResponse), true);
//     });

// });
