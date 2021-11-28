import { describe } from "mocha";
import { Webhook } from "../src/webhook";
import { mockRequest, mockResponse } from "mock-req-res";
import { strict as assert } from 'assert';

describe('test default response when NOT defined in the environment variables', function () {

    //arrange
    const environmentVariables = {
        "test": "123",
    };

    const webhook = new Webhook(environmentVariables);

    const request = mockRequest({ body: "{ some dummy body }" })
    const response = mockResponse();

    //act
    webhook.handler(request, response);

    //assert
    it('statusCode', function () {
        assert.equal(response.status.calledOnce, true);
        assert.equal(response.status.calledOnceWith(200), true);
    });
    
    it('response body', function () {
        assert.equal(response.send.calledOnce, true);
        assert.equal(response.send.calledOnceWith("OK"), true);
    });

});


describe('test default response when defined in the environment variables', function () {

    //arrange
    const defaultResponse = "[default response]";

    const environmentVariables = {
        "test": "123",
        "DEFAULT_RESPONSE": defaultResponse,
    };

    const webhook = new Webhook(environmentVariables);

    const request = mockRequest({ body: "{ some dummy body }" })
    const response = mockResponse();

    //act
    webhook.handler(request, response);

    //assert
    it('statusCode', function () {
        assert.equal(response.status.calledOnce, true);
        assert.equal(response.status.calledOnceWith(200), true);
    });
    
    it('response body', function () {
        assert.equal(response.send.calledOnce, true);
        assert.equal(response.send.calledOnceWith(defaultResponse), true);
    });

});
