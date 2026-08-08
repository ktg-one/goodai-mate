import * as dns from 'dns';
import * as net from 'net';

function isPrivateIPv4(address: string): boolean {
  if (!net.isIPv4(address)) return false;
  const parts = address.split('.').map(Number);
  if (parts[0] === 10) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 0) return true;
  return false;
}

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
      if (isPrivateIPv4(address)) return false;
    } else if (net.isIPv6(address)) {
      if (address === '::1') return false;
      const lowerAddr = address.toLowerCase();
      if (lowerAddr.startsWith('fc') || lowerAddr.startsWith('fd')) return false;
      if (lowerAddr.startsWith('fe80')) return false;

      if (lowerAddr.startsWith('::ffff:')) {
        const ipv4Part = lowerAddr.substring(7);
        let parsedIpv4 = ipv4Part;

        if (ipv4Part.includes(':')) {
          const parts = ipv4Part.split(':');
          if (parts.length === 2) {
            const p1 = parseInt(parts[0], 16);
            const p2 = parseInt(parts[1], 16);
            parsedIpv4 = `${(p1 >> 8) & 255}.${p1 & 255}.${(p2 >> 8) & 255}.${p2 & 255}`;
          }
        }

        if (isPrivateIPv4(parsedIpv4)) return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
