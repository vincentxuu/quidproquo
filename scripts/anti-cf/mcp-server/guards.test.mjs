import assert from "node:assert/strict";
import test from "node:test";
import {
  Deadline,
  FetchError,
  Semaphore,
  assertSafeNetworkUrl,
  isBlockedAddress,
  parseHttpUrl,
  resolveSafeNetworkUrl,
  truncateText,
  withinDeadline,
} from "./guards.mjs";

const publicLookup = async () => [{ address: "93.184.216.34", family: 4 }];

test("parseHttpUrl allows ordinary HTTP(S) URLs", () => {
  assert.equal(parseHttpUrl("https://example.com/path").hostname, "example.com");
  assert.equal(parseHttpUrl("http://example.com").protocol, "http:");
});

test("parseHttpUrl rejects local files and embedded credentials", () => {
  assert.throws(() => parseHttpUrl("file:///etc/hosts"), { code: "UNSAFE_URL" });
  assert.throws(() => parseHttpUrl("https://user:secret@example.com"), { code: "UNSAFE_URL" });
});

test("address policy blocks local, private, reserved, and IPv4-mapped addresses", () => {
  for (const address of [
    "127.0.0.1",
    "10.1.2.3",
    "169.254.169.254",
    "192.168.1.2",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
    "::127.0.0.1",
    "64:ff9b::7f00:1",
    "64:ff9b:1::7f00:1",
    "2001:0000:4136:e378:8000:63bf:3fff:fdd2",
    "2002:7f00:1::",
  ]) {
    assert.equal(isBlockedAddress(address), true, address);
  }
  assert.equal(isBlockedAddress("93.184.216.34"), false);
  assert.equal(isBlockedAddress("2606:4700:4700::1111"), false);
});

test("URL policy rejects localhost aliases and canonicalized numeric IPv4", async () => {
  await assert.rejects(assertSafeNetworkUrl("http://localhost", { lookup: publicLookup }), {
    code: "BLOCKED_DESTINATION",
  });
  await assert.rejects(assertSafeNetworkUrl("http://2130706433", { lookup: publicLookup }), {
    code: "BLOCKED_DESTINATION",
  });
});

test("URL policy rejects hostnames resolving to a private address", async () => {
  const lookup = async () => [{ address: "10.0.0.8", family: 4 }];
  await assert.rejects(assertSafeNetworkUrl("https://internal.example", { lookup }), {
    code: "BLOCKED_DESTINATION",
  });
});

test("URL policy rejects mixed public and private DNS answers", async () => {
  const lookup = async () => [
    { address: "93.184.216.34", family: 4 },
    { address: "192.168.1.10", family: 4 },
  ];
  await assert.rejects(assertSafeNetworkUrl("https://mixed.example", { lookup }), {
    code: "BLOCKED_DESTINATION",
  });
});

test("URL policy accepts a hostname only when all resolved addresses are public", async () => {
  const result = await assertSafeNetworkUrl("https://example.com/path", { lookup: publicLookup });
  assert.equal(result.href, "https://example.com/path");
});

test("safe resolution returns the exact public address to pin at connect time", async () => {
  const result = await resolveSafeNetworkUrl("https://example.com", { lookup: publicLookup });
  assert.equal(result.url.hostname, "example.com");
  assert.deepEqual(result.addresses, [{ address: "93.184.216.34", family: 4 }]);
});

test("truncateText reports bounded output metadata", () => {
  assert.deepEqual(truncateText("abcdef", 4), {
    value: "abcd",
    originalLength: 6,
    returnedLength: 4,
    truncated: true,
  });
});

test("Deadline rejects expired work", async () => {
  const deadline = new Deadline(0.001);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.throws(() => deadline.remainingMs("test"), {
    code: "TIMEOUT",
    stage: "test",
  });
});

test("withinDeadline bounds an operation that does not settle", async () => {
  const deadline = new Deadline(0.01);
  await assert.rejects(withinDeadline(new Promise(() => {}), deadline, undefined, "operation"), {
    code: "TIMEOUT",
    stage: "operation",
  });
});

test("withinDeadline propagates cancellation", async () => {
  const controller = new AbortController();
  const operation = withinDeadline(
    new Promise(() => {}),
    new Deadline(1),
    controller.signal,
    "operation"
  );
  controller.abort();
  await assert.rejects(operation, { code: "CANCELLED", stage: "operation" });
});

test("Semaphore bounds concurrency and wakes one queued caller", async () => {
  const semaphore = new Semaphore(1, 1);
  const deadline = new Deadline(1);
  const releaseFirst = await semaphore.acquire(deadline);
  const second = semaphore.acquire(deadline);
  await assert.rejects(semaphore.acquire(deadline), { code: "BUSY" });
  releaseFirst();
  const releaseSecond = await second;
  assert.equal(semaphore.active, 1);
  releaseSecond();
  assert.equal(semaphore.active, 0);
});

test("Semaphore rejects a request that was already cancelled", async () => {
  const controller = new AbortController();
  controller.abort();
  const semaphore = new Semaphore(1, 1);
  await assert.rejects(semaphore.acquire(new Deadline(1), controller.signal), {
    code: "CANCELLED",
  });
  assert.equal(semaphore.active, 0);
});

test("FetchError exposes stable code and stage", () => {
  const error = new FetchError("TEST", "unit", "safe message");
  assert.equal(error.code, "TEST");
  assert.equal(error.stage, "unit");
});
