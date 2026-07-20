import dns from 'dns';
import net from 'net';

export async function isSafeUrl(urlStr: string): Promise<boolean> {
  try {
    const parsedUrl = new URL(urlStr);

    // 1. Enforce safe protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // 2. Reject obvious internal hostnames immediately
    if (['localhost', '127.0.0.1'].includes(parsedUrl.hostname) || parsedUrl.hostname.endsWith('.local')) {
      return false;
    }

    // 3. Resolve the hostname to an IP address (mitigates DNS rebinding and A-record spoofing)
    const { address } = await dns.promises.lookup(parsedUrl.hostname);

    // 4. Validate the resolved IP address is not in private/reserved ranges
    if (!net.isIP(address)) {
      return false;
    }

    if (net.isIPv4(address)) {
      const parts = address.split('.').map(Number);
      if (
        parts[0] === 10 || // 10.0.0.0/8
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || // 172.16.0.0/12
        (parts[0] === 192 && parts[1] === 168) || // 192.168.0.0/16
        parts[0] === 127 || // 127.0.0.0/8 (loopback)
        parts[0] === 0 || // 0.0.0.0/8
        parts[0] === 169 // 169.254.0.0/16 (link-local)
      ) {
        return false;
      }
    } else if (net.isIPv6(address)) {
      const lower = address.toLowerCase();
      // Check for loopback and common private/local IPv6 prefixes
      if (
        lower === '::1' ||
        lower.startsWith('fc') || // Unique Local Address (fc00::/7)
        lower.startsWith('fd') ||
        lower.startsWith('fe8') || // Link-local (fe80::/10)
        lower.startsWith('fe9') ||
        lower.startsWith('fea') ||
        lower.startsWith('feb')
      ) {
        return false;
      }
    }

    return true;
  } catch (e) {
    // If URL parsing or DNS resolution fails, consider it unsafe
    return false;
  }
}
