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

    const isLocalIPv4 = (ip: string) => {
      const parts = ip.split('.').map(Number);
      return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 ||
             (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
             (parts[0] === 192 && parts[1] === 168) ||
             (parts[0] === 169 && parts[1] === 254);
    };

    if (net.isIPv4(address)) {
      if (isLocalIPv4(address)) return false;
    } else if (net.isIPv6(address)) {
      if (address === '::1') return false;
      const lowerAddr = address.toLowerCase();

      // 🛡️ Sentinel: Mitigate IPv4-mapped IPv6 SSRF bypasses (e.g. ::ffff:127.0.0.1)
      if (lowerAddr.startsWith('::ffff:')) {
        const v4Part = lowerAddr.substring(7);
        if (net.isIPv4(v4Part)) {
          if (isLocalIPv4(v4Part)) return false;
        } else {
          // Reject hex-encoded mapped IPv4 addresses (e.g., ::ffff:7f00:1) to prevent obfuscation bypasses
          return false;
        }
      }

      if (lowerAddr.startsWith('fc') || lowerAddr.startsWith('fd')) return false;
      if (lowerAddr.startsWith('fe80')) return false;
    }

    return true;
  } catch (_error) {
    return false;
  }
}
