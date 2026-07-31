import * as dns from 'dns';
import * as net from 'net';

export async function isSafeUrl(urlString: string): Promise<boolean> {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return false;
    }

    const { address } = await dns.promises.lookup(hostname);

    if (net.isIPv4(address)) {
      const parts = address.split('.').map(Number);
      if (parts[0] === 10) return false;
      if (parts[0] === 127) return false;
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
      if (parts[0] === 192 && parts[1] === 168) return false;
      if (parts[0] === 169 && parts[1] === 254) return false;
      if (parts[0] === 0) return false;
    } else if (net.isIPv6(address)) {
      if (address === '::1') return false;
      const lowerAddr = address.toLowerCase();
      if (lowerAddr.startsWith('fc') || lowerAddr.startsWith('fd')) return false;
      if (lowerAddr.startsWith('fe80')) return false;

      // 🛡️ Sentinel: Prevent SSRF bypass using IPv4-mapped IPv6 addresses (e.g., ::ffff:127.0.0.1 or ::ffff:7f00:1)
      if (lowerAddr.startsWith('::ffff:')) {
        const v4Str = lowerAddr.slice(7);
        let ip1 = -1, ip2 = -1;

        if (v4Str.includes('.')) {
          const parts = v4Str.split('.').map(Number);
          ip1 = parts[0]; ip2 = parts[1];
        } else {
          const match = v4Str.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
          if (match) {
            const p1 = parseInt(match[1], 16);
            ip1 = (p1 >> 8) & 0xff;
            ip2 = p1 & 0xff;
          }
        }

        if (
          ip1 === 10 || ip1 === 127 || ip1 === 0 ||
          (ip1 === 172 && ip2 >= 16 && ip2 <= 31) ||
          (ip1 === 192 && ip2 === 168) ||
          (ip1 === 169 && ip2 === 254)
        ) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
