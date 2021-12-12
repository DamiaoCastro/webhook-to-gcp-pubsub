import { Firewall } from "../src/firewall";
import { suite, test } from "mocha";
import * as sinon from "ts-sinon";
import { IncomingMessage, ServerResponse } from "node:http";
import { strict as assert } from 'assert';


suite('IP_WHITELIST - checks', function () {

    for (var i = 0; i <= 1; i++) {

        const proxy = i == 1;

        TestIsRequestAllowedResponse('request blocked because whitelisted IP is different than provided', proxy, 'whatever-ip', 'totally-diferent-ip', false);
        TestIsRequestAllowedResponse('request blocked because requestor IP is different than the many whitelisted', proxy, 'whatever-ip1;whatever-ip2;whatever-ip3', 'totally-diferent-ip', false);
        TestIsRequestAllowedResponse('request accepted by match in whitelist', proxy, 'whatever-ip', 'whatever-ip', true);
        TestIsRequestAllowedResponse('request accepted by match in whitelist with multiple IP\'s specified', proxy, 'whatever-ip1;whatever-ip2', 'whatever-ip1', true);
        TestIsRequestAllowedResponse('request accepted because whitelist is *', proxy, '*', 'whatever-ip', true);
        TestIsRequestAllowedResponse('request accepted because whitelist is <empty>', proxy, '', 'whatever-ip', true);
        TestIsRequestAllowedResponse('request accepted because whitelist is not specified', proxy, null, 'whatever-ip', true);

    }

    //TODO: implement IoC in order to enable better unit tests.
    // blocked implementation of unit tests for DNS configuration.

});

async function TestIsRequestAllowedResponse(message: string, proxy: boolean, ipWhitelist: string | null, ipRequest: string, expectedResult: boolean) {

    test(`${proxy ? 'proxy' : 'direct'} - ${message}`, async () => {

        //arrange
        let environmentVariables: Dict<string> = {
            "test": "123"
        };
        if (ipWhitelist) {
            environmentVariables = {
                "test": "123",
                "IP_WHITELIST": ipWhitelist
            };
        }

        const request = sinon.stubInterface<IncomingMessage>();
        if (proxy) {
            request.headers = {
                "x-forwarded-for": ipRequest,
                "content-type": "application/json"
            };
        } else {
            Object.defineProperty(request.socket, 'remoteAddress', { get: () => { return (`::ffff:${ipRequest}`); } });
        }

        const firewall = await Firewall.getFirewallAsync(environmentVariables);

        //act
        const response: boolean = firewall.isRequestAllowed(request);

        //assert
        assert.equal(response, expectedResult);

    });

}

describe('exception when IP is not in the "x-forwarded-for" header nor in socket remoteAddress', async function () {

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

    const firewall = await Firewall.getFirewallAsync(environmentVariables);

    //act / assert
    assert.throws(() => { firewall.isRequestAllowed(request); });

});
