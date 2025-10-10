declare module 'psl' {
  interface ParsedDomain {
    tld: string | null;
    domain: string | null;
    subdomain: string | null;
    listed: boolean;
    error?: boolean;
  }

  const parse: (domain: string) => ParsedDomain;
  const get: (domain: string) => string | null;
  export default { parse, get };
}