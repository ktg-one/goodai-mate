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
  const lowerAddr = address.toLowerCase();

  let cleanAddr = lowerAddr;
  if (cleanAddr.startsWith('[') && cleanAddr.endsWith(']')) {
    cleanAddr = cleanAddr.slice(1, -1);
  }

  let parts = cleanAddr.split(':');

  const hasIPv4 = parts[parts.length - 1].includes('.');
  const totalExpectedGroups = hasIPv4 ? 7 : 8;

  const doubleColonIdx = parts.indexOf('');
  if (doubleColonIdx !== -1) {
    let leftGroups = 0;
    for (let i = 0; i < doubleColonIdx; i++) {
      if (parts[i] !== '') leftGroups++;
    }

    let rightGroups = 0;
    let rightIdx = doubleColonIdx;
    while (rightIdx < parts.length && parts[rightIdx] === '') {
      rightIdx++;
    }
    for (let i = rightIdx; i < parts.length; i++) {
      if (parts[i] !== '') rightGroups++;
    }

    const missing = Math.max(0, totalExpectedGroups - (leftGroups + rightGroups));
    const zeros = Array(missing).fill('0');

    parts = [
      ...parts.slice(0, doubleColonIdx).filter(p => p !== ''),
      ...zeros,
      ...parts.slice(rightIdx).filter(p => p !== '')
    ];
  }

  if (parts.length !== totalExpectedGroups) return null;

  const isZero = (p: string) => {
    if (!p) return false;
    const val = parseInt(p, 16);
    return !isNaN(val) && val === 0;
  };

  const isFfff = (p: string) => {
    if (!p) return false;
    const val = parseInt(p, 16);
    return !isNaN(val) && val === 0xffff;
  };

  if (hasIPv4 && parts.length === 7) {
    if (parts.slice(0, 5).every(isZero) && isFfff(parts[5])) {
      return parts[6];
    }
  } else if (!hasIPv4 && parts.length === 8) {
    if (parts.slice(0, 5).every(isZero) && isFfff(parts[5])) {
      const p1 = parseInt(parts[6], 16);
      const p2 = parseInt(parts[7], 16);
      if (!isNaN(p1) && !isNaN(p2)) {
        return `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
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
