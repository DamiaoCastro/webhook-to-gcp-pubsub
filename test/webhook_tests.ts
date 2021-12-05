import { describe } from "mocha";
import { Webhook } from "../src/webhook";
import { strict as assert } from 'assert';
// import { IncomingMessage, ServerResponse } from "node:http";
// import { sinon } from 'sinon';
const http = require('http');
const sinon = require('sinon');

const publishMessageAsync = sinon.fake();

const publisher: IPubsubPublisher = {
    publishMessageAsync: publishMessageAsync,
    checkPublishPermissionsAsync: function (): Promise<void> { throw new Error("Function not implemented."); }
};

describe('test default response when NOT defined in the environment variables', function () {

    //arrange
    const environmentVariables: Dict<string> = {
        "test": "123",
    };

    const webhook = new Webhook(environmentVariables, publisher);

    const request = sinon.mock(http.IncomingMessage);
    request.headers = {
        "content-type": "application/json"
    };
    request.on = sinon.fake();
    const response = sinon.mock(http.ServerResponse);

    //act
    webhook.handlerHttp1(request, response);

    //assert
    it('request on data', function () {
        assert.equal(request.on.calledExactly(2), true);
        // assert.equal(response.status.calledOnceWith(200), true);
    });


    it('statusCode', function () {
        // assert.equal(response., true);
        // assert.equal(response.status.calledOnceWith(200), true);
    });

    it('response body', function () {
        assert.equal(response.end.calledOnce, true);
        // assert.equal(response.end.calledOnceWith("OK"), true);
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
