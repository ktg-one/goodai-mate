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

    const isPrivateIPv4 = (ip: string) => {
      const parts = ip.split('.').map(Number);
      if (parts[0] === 10) return true;
      if (parts[0] === 127) return true;
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      if (parts[0] === 192 && parts[1] === 168) return true;
      if (parts[0] === 169 && parts[1] === 254) return true;
      if (parts[0] === 0) return true;
      return false;
    };

    if (net.isIPv4(address)) {
      if (isPrivateIPv4(address)) return false;
    } else if (net.isIPv6(address)) {
      if (address === '::1') return false;
      const lowerAddr = address.toLowerCase();
      if (lowerAddr.startsWith('fc') || lowerAddr.startsWith('fd')) return false;
      if (lowerAddr.startsWith('fe80')) return false;

      // Extract and check IPv4-mapped IPv6 addresses to prevent bypass
      const ipv4Match = lowerAddr.match(/(?:::ffff:|0:0:0:0:0:ffff:)(\d+\.\d+\.\d+\.\d+)/);
      if (ipv4Match && isPrivateIPv4(ipv4Match[1])) return false;

      const hexMatch = lowerAddr.match(/(?:::ffff:|0:0:0:0:0:ffff:)([0-9a-f]{1,4}):([0-9a-f]{1,4})/);
      if (hexMatch) {
        const p1 = parseInt(hexMatch[1], 16) >> 8;
        const p2 = parseInt(hexMatch[1], 16) & 0xff;
        const p3 = parseInt(hexMatch[2], 16) >> 8;
        const p4 = parseInt(hexMatch[2], 16) & 0xff;
        if (isPrivateIPv4(`${p1}.${p2}.${p3}.${p4}`)) return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
