import * as dns from 'dns';
import * as net from 'net';

function isPrivateIPv4(ip: string): boolean {
  if (!net.isIPv4(ip)) return false;
  const parts = ip.split('.').map(Number);
  if (parts[0] === 10) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 0) return true;
  return false;
}

function parseIPv4MappedIPv6(address: string): string | null {
  let lowerAddr = address.toLowerCase();

  if (lowerAddr.startsWith('[') && lowerAddr.endsWith(']')) {
      lowerAddr = lowerAddr.slice(1, -1);
  }

  if (!net.isIPv6(lowerAddr)) return null;

  let parts = lowerAddr.split(':');
  let ipv4Str: string | null = null;

  const lastPart = parts[parts.length - 1];
  if (lastPart.includes('.')) {
      if (!net.isIPv4(lastPart)) return null;
      ipv4Str = lastPart;
      parts.pop();
  }

  let hexSegments = parts.filter(p => p !== '');

  const hasDoubleColon = parts.includes('');
  const expectedLength = ipv4Str ? 6 : 8;

  if (hasDoubleColon) {
      const missing = expectedLength - hexSegments.length;
      const zeros = new Array(Math.max(0, missing)).fill('0');

      let insertIndex = 0;
      for (let i = 0; i < parts.length; i++) {
          if (parts[i] === '') {
              let countBefore = 0;
              for (let j = 0; j < i; j++) {
                  if (parts[j] !== '') countBefore++;
              }
              insertIndex = countBefore;
              break;
          }
      }

      hexSegments.splice(insertIndex, 0, ...zeros);
  } else {
      hexSegments = hexSegments.map(p => p || '0');
  }

  if (ipv4Str) {
      if (hexSegments.length !== 6) return null;
      for (let i = 0; i < 5; i++) {
          if (parseInt(hexSegments[i], 16) !== 0) return null;
      }
      if (parseInt(hexSegments[5], 16) !== 0xffff) return null;
      return ipv4Str;
  } else {
      if (hexSegments.length !== 8) return null;
      for (let i = 0; i < 5; i++) {
          if (parseInt(hexSegments[i], 16) !== 0) return null;
      }
      if (parseInt(hexSegments[5], 16) !== 0xffff) return null;

      const p1 = parseInt(hexSegments[6], 16);
      const p2 = parseInt(hexSegments[7], 16);
      if (!isNaN(p1) && !isNaN(p2)) {
          return `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
      }
  }

  return null;
}

export async function isSafeUrl(urlString: string): Promise<boolean> {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    let hostname = url.hostname.toLowerCase();

    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1);
    }

    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return false;
    }

    if (net.isIPv4(hostname)) {
        if (isPrivateIPv4(hostname)) return false;
    } else if (net.isIPv6(hostname)) {
        if (hostname === '::1') return false;
        const lowerAddr = hostname;
        if (lowerAddr.startsWith('fc') || lowerAddr.startsWith('fd')) return false;
        if (lowerAddr.startsWith('fe80')) return false;

        const mappedIPv4 = parseIPv4MappedIPv6(hostname);
        if (mappedIPv4 && isPrivateIPv4(mappedIPv4)) return false;
    }

    if (!net.isIP(hostname)) {
        const { address } = await dns.promises.lookup(hostname);

        if (net.isIPv4(address)) {
          if (isPrivateIPv4(address)) return false;
        } else if (net.isIPv6(address)) {
          if (address === '::1') return false;
          const lowerAddr = address.toLowerCase();
          if (lowerAddr.startsWith('fc') || lowerAddr.startsWith('fd')) return false;
          if (lowerAddr.startsWith('fe80')) return false;

          const mappedIPv4 = parseIPv4MappedIPv6(address);
          if (mappedIPv4 && isPrivateIPv4(mappedIPv4)) return false;
        }
    }

    return true;
  } catch (error) {
    return false;
  }
}
