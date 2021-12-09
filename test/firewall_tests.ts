import { Firewall } from "../src/firewall";
import * as sinon from "ts-sinon";
import { IncomingMessage, ServerResponse } from "node:http";
import { strict as assert } from 'assert';

describe('proxy', function () {

    describe('request blocked because whitelisted IP is different than provided', function () {

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

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 1);
            assert.equal(response.writeHead.getCall(0).firstArg, 404);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 1);
            assert.equal(response.end.getCall(0).firstArg, 'not found');
        });

    });

    describe('request blocked because requestor IP is different than the many whitelisted', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123",
            "IP_WHITELIST": "whatever-ip1;whatever-ip2;whatever-ip3"
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

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 1);
            assert.equal(response.writeHead.getCall(0).firstArg, 404);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 1);
            assert.equal(response.end.getCall(0).firstArg, 'not found');
        });

    });

    describe('request accepted by match in whitelist', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123",
            "IP_WHITELIST": "whatever-ip"
        };

        const request = sinon.stubInterface<IncomingMessage>();
        request.headers = {
            "x-forwarded-for": "whatever-ip",
            "content-type": "application/json"
        };
        const response = sinon.stubInterface<ServerResponse>();
        response.writeHead.returns(response);

        const firewall = new Firewall(environmentVariables);

        //act
        firewall.requestHandler(request, response);

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 0);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 0);
        });

    });

    describe('request accepted by match in whitelist with multiple IP\'s specified', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123",
            "IP_WHITELIST": "whatever-ip1;whatever-ip2"
        };

        const request = sinon.stubInterface<IncomingMessage>();
        request.headers = {
            "x-forwarded-for": "whatever-ip1",
            "content-type": "application/json"
        };
        const response = sinon.stubInterface<ServerResponse>();
        response.writeHead.returns(response);

        const firewall = new Firewall(environmentVariables);

        //act
        firewall.requestHandler(request, response);

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 0);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 0);
        });

    });

    describe('request accepted because whitelist is *', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123",
            "IP_WHITELIST": "*"
        };

        const request = sinon.stubInterface<IncomingMessage>();
        request.headers = {
            "x-forwarded-for": "whatever-ip",
            "content-type": "application/json"
        };
        const response = sinon.stubInterface<ServerResponse>();
        response.writeHead.returns(response);

        const firewall = new Firewall(environmentVariables);

        //act
        firewall.requestHandler(request, response);

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 0);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 0);
        });

    });

    describe('request accepted because whitelist is <empty>', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123",
            "IP_WHITELIST": ""
        };

        const request = sinon.stubInterface<IncomingMessage>();
        request.headers = {
            "x-forwarded-for": "whatever-ip",
            "content-type": "application/json"
        };
        const response = sinon.stubInterface<ServerResponse>();
        response.writeHead.returns(response);

        const firewall = new Firewall(environmentVariables);

        //act
        firewall.requestHandler(request, response);

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 0);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 0);
        });

    });

    describe('request accepted because whitelist is not specified', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123"
        };

        const request = sinon.stubInterface<IncomingMessage>();
        request.headers = {
            "x-forwarded-for": "whatever-ip",
            "content-type": "application/json"
        };
        const response = sinon.stubInterface<ServerResponse>();
        response.writeHead.returns(response);

        const firewall = new Firewall(environmentVariables);

        //act
        firewall.requestHandler(request, response);

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 0);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 0);
        });

    });

});


describe('direct', function () {

    describe('request blocked because whitelisted IP is different than provided', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123",
            "IP_WHITELIST": "whatever-ip"
        };

        const request = sinon.stubInterface<IncomingMessage>();
        request.headers = {
            "content-type": "application/json"
        };
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:169.254.8.129'); } });

        const response = sinon.stubInterface<ServerResponse>();
        response.writeHead.returns(response);

        const firewall = new Firewall(environmentVariables);

        //act
        firewall.requestHandler(request, response);

        it('statusCode', function () {
            assert.equal(response.writeHead.callCount, 1);
            assert.equal(response.writeHead.getCall(0).firstArg, 404);
        });

        it('response body', function () {
            assert.equal(response.end.callCount, 1);
            assert.equal(response.end.getCall(0).firstArg, 'not found');
        });

    });

    // describe('request blocked because requestor IP is different than the many whitelisted', function () {

    //     //arrange
    //     const environmentVariables: Dict<string> = {
    //         "test": "123",
    //         "IP_WHITELIST": "whatever-ip1;whatever-ip2;whatever-ip3"
    //     };

    //     const request = sinon.stubInterface<IncomingMessage>();
    //     request.headers = {
    //         "x-forwarded-for": "totally-diferent-ip",
    //         "content-type": "application/json"
    //     };
    //     const response = sinon.stubInterface<ServerResponse>();
    //     response.writeHead.returns(response);

    //     const firewall = new Firewall(environmentVariables);

    //     //act
    //     firewall.requestHandler(request, response);

    //     it('statusCode', function () {
    //         assert.equal(response.writeHead.callCount, 1);
    //         assert.equal(response.writeHead.getCall(0).firstArg, 404);
    //     });

    //     it('response body', function () {
    //         assert.equal(response.end.callCount, 1);
    //         assert.equal(response.end.getCall(0).firstArg, 'not found');
    //     });

    // });

    // describe('request accepted by match in whitelist', function () {

    //     //arrange
    //     const environmentVariables: Dict<string> = {
    //         "test": "123",
    //         "IP_WHITELIST": "whatever-ip"
    //     };

    //     const request = sinon.stubInterface<IncomingMessage>();
    //     request.headers = {
    //         "x-forwarded-for": "whatever-ip",
    //         "content-type": "application/json"
    //     };
    //     const response = sinon.stubInterface<ServerResponse>();
    //     response.writeHead.returns(response);

    //     const firewall = new Firewall(environmentVariables);

    //     //act
    //     firewall.requestHandler(request, response);

    //     it('statusCode', function () {
    //         assert.equal(response.writeHead.callCount, 0);
    //     });

    //     it('response body', function () {
    //         assert.equal(response.end.callCount, 0);
    //     });

    // });

    // describe('request accepted by match in whitelist with multiple IP\'s specified', function () {

    //     //arrange
    //     const environmentVariables: Dict<string> = {
    //         "test": "123",
    //         "IP_WHITELIST": "whatever-ip1;whatever-ip2"
    //     };

    //     const request = sinon.stubInterface<IncomingMessage>();
    //     request.headers = {
    //         "x-forwarded-for": "whatever-ip1",
    //         "content-type": "application/json"
    //     };
    //     const response = sinon.stubInterface<ServerResponse>();
    //     response.writeHead.returns(response);

    //     const firewall = new Firewall(environmentVariables);

    //     //act
    //     firewall.requestHandler(request, response);

    //     it('statusCode', function () {
    //         assert.equal(response.writeHead.callCount, 0);
    //     });

    //     it('response body', function () {
    //         assert.equal(response.end.callCount, 0);
    //     });

    // });

    // describe('request accepted because whitelist is *', function () {

    //     //arrange
    //     const environmentVariables: Dict<string> = {
    //         "test": "123",
    //         "IP_WHITELIST": "*"
    //     };

    //     const request = sinon.stubInterface<IncomingMessage>();
    //     request.headers = {
    //         "x-forwarded-for": "whatever-ip",
    //         "content-type": "application/json"
    //     };
    //     const response = sinon.stubInterface<ServerResponse>();
    //     response.writeHead.returns(response);

    //     const firewall = new Firewall(environmentVariables);

    //     //act
    //     firewall.requestHandler(request, response);

    //     it('statusCode', function () {
    //         assert.equal(response.writeHead.callCount, 0);
    //     });

    //     it('response body', function () {
    //         assert.equal(response.end.callCount, 0);
    //     });

    // });

    // describe('request accepted because whitelist is <empty>', function () {

    //     //arrange
    //     const environmentVariables: Dict<string> = {
    //         "test": "123",
    //         "IP_WHITELIST": ""
    //     };

    //     const request = sinon.stubInterface<IncomingMessage>();
    //     request.headers = {
    //         "x-forwarded-for": "whatever-ip",
    //         "content-type": "application/json"
    //     };
    //     const response = sinon.stubInterface<ServerResponse>();
    //     response.writeHead.returns(response);

    //     const firewall = new Firewall(environmentVariables);

    //     //act
    //     firewall.requestHandler(request, response);

    //     it('statusCode', function () {
    //         assert.equal(response.writeHead.callCount, 0);
    //     });

    //     it('response body', function () {
    //         assert.equal(response.end.callCount, 0);
    //     });

    // });

    // describe('request accepted because whitelist is not specified', function () {

    //     //arrange
    //     const environmentVariables: Dict<string> = {
    //         "test": "123"
    //     };

    //     const request = sinon.stubInterface<IncomingMessage>();
    //     request.headers = {
    //         "x-forwarded-for": "whatever-ip",
    //         "content-type": "application/json"
    //     };
    //     const response = sinon.stubInterface<ServerResponse>();
    //     response.writeHead.returns(response);

    //     const firewall = new Firewall(environmentVariables);

    //     //act
    //     firewall.requestHandler(request, response);

    //     it('statusCode', function () {
    //         assert.equal(response.writeHead.callCount, 0);
    //     });

    //     it('response body', function () {
    //         assert.equal(response.end.callCount, 0);
    //     });

    // });

});