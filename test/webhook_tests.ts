import { describe } from "mocha";
import { Webhook } from "../src/webhook";
import { mockRequest, mockResponse } from "mock-req-res";
const assert = require('assert');

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

    console.info(response);

    //assert
    it('statusCode', function () {
        assert.equal(response.statusCode, 200);
    });

});
