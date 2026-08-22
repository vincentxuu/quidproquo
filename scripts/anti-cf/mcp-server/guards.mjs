import { promises as dns } from "node:dns";
import { BlockList, isIP } from "node:net";

const blockedAddresses = new BlockList();

for (const [address, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
]) {
  blockedAddresses.addSubnet(address, prefix, "ipv4");
}

for (const [address, prefix] of [
  ["::", 96],
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96],
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["2001::", 32],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
]) {
  blockedAddresses.addSubnet(address, prefix, "ipv6");
}

export class FetchError extends Error {
  constructor(code, stage, message) {
    super(message);
    this.name = "FetchError";
    this.code = code;
    this.stage = stage;
  }
}

export function parseHttpUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new FetchError("INVALID_URL", "validate", "URL must be valid");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new FetchError("UNSAFE_URL", "validate", "Only HTTP and HTTPS URLs are allowed");
  }
  if (parsed.username || parsed.password) {
    throw new FetchError("UNSAFE_URL", "validate", "URLs containing credentials are not allowed");
  }

  return parsed;
}

function normalizedHostname(parsed) {
  return parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
}

export function isBlockedAddress(address) {
  const family = isIP(address);
  if (family === 0) return true;
  return blockedAddresses.check(address, family === 4 ? "ipv4" : "ipv6");
}

export async function resolveSafeNetworkUrl(value, options = {}) {
  const parsed = parseHttpUrl(value);
  const hostname = normalizedHostname(parsed);
  const lookup = options.lookup ?? dns.lookup;
  const cache = options.cache;

  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new FetchError("BLOCKED_DESTINATION", "validate", "Local destinations are not allowed");
  }

  let addresses = cache?.get(hostname);
  if (!addresses) {
    if (isIP(hostname)) {
      addresses = [{ address: hostname }];
    } else {
      try {
        addresses = await lookup(hostname, { all: true, verbatim: true });
      } catch {
        throw new FetchError("DNS_FAILED", "validate", "Destination hostname could not be resolved");
      }
    }
    cache?.set(hostname, addresses);
  }

  if (!addresses.length || addresses.some(({ address }) => isBlockedAddress(address))) {
    throw new FetchError("BLOCKED_DESTINATION", "validate", "Private or reserved destinations are not allowed");
  }

  return { url: parsed, addresses };
}

export async function assertSafeNetworkUrl(value, options = {}) {
  return (await resolveSafeNetworkUrl(value, options)).url;
}

export class Deadline {
  constructor(timeoutSeconds) {
    this.expiresAt = performance.now() + timeoutSeconds * 1000;
  }

  remainingMs(stage = "request") {
    const remaining = Math.floor(this.expiresAt - performance.now());
    if (remaining <= 0) {
      throw new FetchError("TIMEOUT", stage, "The request deadline was exceeded");
    }
    return remaining;
  }
}

export function raceWithAbort(promise, signal, stage) {
  if (!signal) return promise;
  if (signal.aborted) {
    return Promise.reject(new FetchError("CANCELLED", stage, "The request was cancelled"));
  }

  return new Promise((resolve, reject) => {
    const onAbort = () => reject(new FetchError("CANCELLED", stage, "The request was cancelled"));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", onAbort));
  });
}

export function withinDeadline(promise, deadline, signal, stage) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new FetchError("TIMEOUT", stage, "The request deadline was exceeded")),
      deadline.remainingMs(stage)
    );
  });
  return raceWithAbort(Promise.race([promise, timeout]), signal, stage).finally(() => clearTimeout(timer));
}

export function delay(ms, deadline, signal, stage = "wait") {
  const duration = Math.min(ms, deadline.remainingMs(stage));
  return withinDeadline(new Promise((resolve) => setTimeout(resolve, duration)), deadline, signal, stage);
}

export class Semaphore {
  constructor(limit, maxQueue) {
    this.limit = limit;
    this.maxQueue = maxQueue;
    this.active = 0;
    this.queue = [];
  }

  async acquire(deadline, signal) {
    if (signal?.aborted) {
      throw new FetchError("CANCELLED", "queue", "The request was cancelled before it was queued");
    }
    if (this.active < this.limit) {
      this.active += 1;
      return this.#releaseFactory();
    }
    if (this.queue.length >= this.maxQueue) {
      throw new FetchError("BUSY", "queue", "The fetch queue is full");
    }

    let timer;
    let abortListener;
    const release = await new Promise((resolve, reject) => {
      const entry = {
        resolve,
        reject,
        remove: () => {
          const index = this.queue.indexOf(entry);
          if (index >= 0) this.queue.splice(index, 1);
        },
      };
      timer = setTimeout(() => {
        entry.remove();
        reject(new FetchError("TIMEOUT", "queue", "The request deadline was exceeded while queued"));
      }, deadline.remainingMs("queue"));
      abortListener = () => {
        entry.remove();
        reject(new FetchError("CANCELLED", "queue", "The request was cancelled while queued"));
      };
      signal?.addEventListener("abort", abortListener, { once: true });
      this.queue.push(entry);
    }).finally(() => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abortListener);
    });

    return release;
  }

  #releaseFactory() {
    let released = false;
    return () => {
      if (released) return;
      released = true;
      const next = this.queue.shift();
      if (next) {
        next.resolve(this.#releaseFactory());
      } else {
        this.active -= 1;
      }
    };
  }
}

export function truncateText(value, maxChars) {
  const text = value ?? "";
  return {
    value: text.slice(0, maxChars),
    originalLength: text.length,
    returnedLength: Math.min(text.length, maxChars),
    truncated: text.length > maxChars,
  };
}

export function publicError(error, fallbackStage = "unknown") {
  if (error instanceof FetchError) return error;
  return new FetchError("FETCH_FAILED", fallbackStage, "The page could not be fetched");
}
