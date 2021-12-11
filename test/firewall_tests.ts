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

        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, false);
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
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, false);
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
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:totally-diferent-ip'); } });

        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, false);
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
            "content-type": "application/json"
        };
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:totally-diferent-ip'); } });
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, false);
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
            "content-type": "application/json"
        };
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:whatever-ip'); } });
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
            "content-type": "application/json"
        };
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:whatever-ip1'); } });

        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
            "content-type": "application/json"
        };
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:whatever-ip'); } });
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
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
            "content-type": "application/json"
        };
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:whatever-ip'); } });
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
        });

    });

    describe('request accepted because whitelist is not specified', function () {

        //arrange
        const environmentVariables: Dict<string> = {
            "test": "123"
        };

        const request = sinon.stubInterface<IncomingMessage>();
        request.headers = {
            "content-type": "application/json"
        };
        Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return ('::ffff:whatever-ip'); } });
        
        const firewall = new Firewall(environmentVariables);

        //act
        const response = firewall.isRequestAllowed(request);

        //assert
        it('response', function () {
            assert.equal(response, true);
        });

    });

});

describe('exception when IP is not in the "x-forwarded-for" header nor in socket remoteAddress', function () {

    //arrange
    const environmentVariables: Dict<string> = {
        "test": "123",
        "IP_WHITELIST": "whatever-ip"
    };

    const request = sinon.stubInterface<IncomingMessage>();
    request.headers = {
        "content-type": "application/json"
    };
    const response = sinon.stubInterface<ServerResponse>();
    response.writeHead.returns(response);

    const firewall = new Firewall(environmentVariables);

    //act / assert
    assert.throws(() => { firewall.isRequestAllowed(request); });

});
