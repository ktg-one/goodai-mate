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
    }

    return true;
  } catch (error) {
    return false;
  }
}
