import { describe } from "mocha";
import { Webhook } from "../src/webhook";
import { strict as assert } from 'assert';
import { IncomingMessage, ServerResponse } from "node:http";
// import { sinon } from 'sinon';
const http = require('http');
// const sinon = require('sinon');
import * as sinon from "ts-sinon";

const publisher: IPubsubPublisher = sinon.stubInterface<IPubsubPublisher>();

describe('test default response when NOT defined in the environment variables', function () {

    //arrange
    const environmentVariables: Dict<string> = {
        "test": "123",
    };

    const request = sinon.stubInterface<IncomingMessage>();
    request.headers = {
        "content-type": "application/json"
    };
    const response = sinon.stubInterface<ServerResponse>();
    response.writeHead.returns(response);

    const webhook = new Webhook(environmentVariables, publisher);

    //act
    webhook.requestHandler(request, response);

    //assert 
    assertRequestListeners(request);

    it('statusCode', function () {
        assert.equal(response.writeHead.callCount, 1);
        assert.equal(response.writeHead.getCall(0).firstArg, 200);
    });

    it('response body', function () {
        assert.equal(response.end.callCount, 1);
        assert.equal(response.end.getCall(0).firstArg, 'OK');
    });

});


describe('test default response when defined in the environment variables', function () {

    //arrange
    const defaultResponse = "[default response]";

    const environmentVariables = {
        "test": "123",
        "DEFAULT_RESPONSE": defaultResponse,
    };

    const request = sinon.stubInterface<IncomingMessage>();
    request.headers = {
        "content-type": "application/json"
    };
    const response = sinon.stubInterface<ServerResponse>();
    response.writeHead.returns(response);

    const webhook = new Webhook(environmentVariables, publisher);

    //act
    webhook.requestHandler(request, response);

    assertRequestListeners(request);

    //assert
    it('statusCode', function () {
        assert.equal(response.writeHead.callCount, 1);
        assert.equal(response.writeHead.getCall(0).firstArg, 200);
    });

    it('response body', function () {
        assert.equal(response.end.callCount, 1);
        assert.equal(response.end.getCall(0).firstArg, defaultResponse);
    });

});

function assertRequestListeners(request: sinon.StubbedInstance<IncomingMessage>) {
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
}

