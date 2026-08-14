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
  if (!net.isIPv6(address)) return null;

  const lowerAddr = address.toLowerCase();
  let expanded = lowerAddr;

  if (expanded.includes('::')) {
    const parts = expanded.split('::');
    const isIPv4Embedded = expanded.includes('.');
    const expectedGroups = isIPv4Embedded ? 7 : 8;

    const leftGroups = parts[0] ? parts[0].split(':').length : 0;
    const rightGroups = parts[1] ? parts[1].split(':').length : 0;

    const missingGroups = expectedGroups - (leftGroups + rightGroups);
    const zeroes = new Array(missingGroups).fill('0').join(':');

    expanded = (parts[0] ? parts[0] + ':' : '') + zeroes + (parts[1] ? ':' + parts[1] : '');
  }

  const parts = expanded.split(':');

  if (parts.length >= 7) {
    const isMapped = parts.slice(0, 5).every(p => p === '' || parseInt(p, 16) === 0) && parts[5] === 'ffff';
    if (isMapped) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) {
        return lastPart;
      } else {
        const secondToLast = parts[parts.length - 2];
        const p1 = parseInt(secondToLast, 16);
        const p2 = parseInt(lastPart, 16);

        if (!isNaN(p1) && !isNaN(p2)) {
            return `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
        }
      }
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
