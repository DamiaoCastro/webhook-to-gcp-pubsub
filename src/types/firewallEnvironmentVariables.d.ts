export interface FirewallEnvironmentVariables {
    ipWhitelist : string | null;
    dnsWhitelist : string | null;
    dnsWhitelistRefreshMinutes : number | null;
}