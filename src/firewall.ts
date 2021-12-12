import { IncomingMessage } from 'node:http';
import { FirewallEnvironmentVariables } from './types/firewallEnvironmentVariables';
import { IFirewall } from './types/IFirewall';
const dns = require('dns');

export class Firewall implements IFirewall {

    private static readonly IpWhitelistEnvironmentKey: string = 'IP_WHITELIST';
    private static readonly DnsWhitelistEnvironmentKey: string = 'DNS_WHITELIST';
    private static readonly DnsWhitelistRefreshMinutesEnvironmentKey: string = 'DNS_WHITELIST_REFRESH_MINUTES';

    private ipWhitelist: string[];
    private firewallEnvironmentVariables: FirewallEnvironmentVariables;

    // in case that there's a DNS specified to whitelist, the associated IP's must be refreshed on a recurrent basis
    private dnsRefreshTimer: NodeJS.Timer | null;

    public static async getFirewallAsync(environmentVariables: Dict<string>): Promise<Firewall> {

        let firewallEnvironmentVariables: FirewallEnvironmentVariables = Firewall.getFirewallEnvironmentVariables(environmentVariables);
        let ipsToWhitelist: string[] = await Firewall.getIPsWhitelistAsync(firewallEnvironmentVariables);
        if (ipsToWhitelist.length == 0) {
            console.info("Firewall: no IP's are blocked");
        } else {
            console.info(`Firewall: IP's whitelisted: ${ipsToWhitelist}`);
        }

        return new Firewall(firewallEnvironmentVariables, ipsToWhitelist);
    }

    /**
     * private constructor. this class can only be instanciated from the static method getFirewallAsync
     */
    private constructor(firewallEnvironmentVariables: FirewallEnvironmentVariables, ipWhitelist: string[]) {
        this.firewallEnvironmentVariables = firewallEnvironmentVariables;
        this.ipWhitelist = ipWhitelist;

        if (firewallEnvironmentVariables.dnsWhitelist) {

            console.info(`Firewall: configured DNS to whitelist: ${firewallEnvironmentVariables.dnsWhitelist}, will be refreshed every ${firewallEnvironmentVariables.dnsWhitelistRefreshMinutes} minute(s)`);

            this.dnsRefreshTimer = setInterval(() => { this.refreshIpWhitelistAsync(this.firewallEnvironmentVariables); }, firewallEnvironmentVariables.dnsWhitelistRefreshMinutes * 60000);
        }
    }

    public isRequestAllowed(request: IncomingMessage): boolean {

        if (this.ipWhitelist.length == 0) { return true; }

        const requestorIp = this.getRequestorIp(request);

        if (!this.ipWhitelist.some(c => c == requestorIp)) {

            console.warn(`Firewall: requestorIp request was blocked: ${requestorIp}`);

            return false;
        }

        return true;
    }

    private getRequestorIp(request: IncomingMessage): string {

        const proxiedIp: string | string[] = request.headers['x-forwarded-for'] ?? '';

        if (typeof (proxiedIp) === 'string') {
            if (proxiedIp && proxiedIp.length > 0) {
                return proxiedIp;
            }
        } else {
            throw new Error('Unexpected value for request.headers["x-forwarded-for"]');
        }

        //example  ::ffff:169.254.8.129
        const remoteAddress = request.socket.remoteAddress?.replace(RegExp('^::ffff:'), '');
        if (remoteAddress && remoteAddress.length > 0) {
            return remoteAddress;
        }

        throw new Error('requestor ip not determined');
    }

    private static getFirewallEnvironmentVariables(environmentVariables: Dict<string>): FirewallEnvironmentVariables {

        const ipWhitelist = environmentVariables[Firewall.IpWhitelistEnvironmentKey]?.trim() ?? null;
        const dnsWhitelist = environmentVariables[Firewall.DnsWhitelistEnvironmentKey]?.trim() ?? null;
        const dnsWhitelistRefreshMinutesString = environmentVariables[Firewall.DnsWhitelistRefreshMinutesEnvironmentKey]?.trim() ?? null;

        let dnsWhitelistRefreshMinutes: number | null = dnsWhitelist ? 60 : null;
        if (dnsWhitelistRefreshMinutesString && dnsWhitelistRefreshMinutesString.length > 0) {
            dnsWhitelistRefreshMinutes = Number.parseInt(dnsWhitelistRefreshMinutesString) ?? 60;
            dnsWhitelistRefreshMinutes = Math.max(dnsWhitelistRefreshMinutes, 1);
        }

        return { ipWhitelist, dnsWhitelist, dnsWhitelistRefreshMinutes } as FirewallEnvironmentVariables;
    }

    private static async getIPsWhitelistAsync(firewallEnvironmentVariables: FirewallEnvironmentVariables): Promise<string[]> {

        let ipsToWhitelist: string[] = [];

        if (firewallEnvironmentVariables.ipWhitelist) {
            ipsToWhitelist =
                firewallEnvironmentVariables.ipWhitelist
                    .split(';')
                    .filter(c => c != '*')
                    .map(c => c.trim());
        }

        if (firewallEnvironmentVariables.dnsWhitelist) {
            try {
                const dnsIps = await dns.promises.resolve4(firewallEnvironmentVariables.dnsWhitelist);
                ipsToWhitelist.push(...dnsIps);
            } catch (error: any) {
                console.error(`Firewall: problem while resolving the DNS hostname: ${firewallEnvironmentVariables.dnsWhitelist}. ${error}`);
                throw error;
            }
        }

        return ipsToWhitelist;
    }

    private async refreshIpWhitelistAsync(firewallEnvironmentVariables: FirewallEnvironmentVariables) {

        const newIpsToWhitelist = await Firewall.getIPsWhitelistAsync(firewallEnvironmentVariables); //.catch((error:Error)=>{})

        if (this.ipWhitelist.length === newIpsToWhitelist.length && this.ipWhitelist.every(i => newIpsToWhitelist.indexOf(i) >= 0)) {
            console.info('Firewall: checked dns for IP\'s, but there\'s no changes from the already configured list');
        } else {
            console.warn(`Firewall: checked dns for IP's, and there's changes to report. The list was \n${this.ipWhitelist}\n and now \n${newIpsToWhitelist}`);
            this.ipWhitelist = newIpsToWhitelist;
        }

    }

}