import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import test from "node:test";
import { createSafeProxy } from "./safe-proxy.mjs";

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return server.address().port;
}

async function close(server) {
  await new Promise((resolve) => server.close(resolve));
}

test("HTTP proxy refuses loopback without contacting the target", async () => {
  let hits = 0;
  const target = http.createServer((_request, response) => {
    hits += 1;
    response.end("secret");
  });
  const targetPort = await listen(target);
  const proxy = await createSafeProxy();
  try {
    const result = await new Promise((resolve, reject) => {
      const request = http.get(
        {
          host: "127.0.0.1",
          port: proxy.port,
          path: `http://127.0.0.1:${targetPort}/secret`,
        },
        (response) => {
          response.resume();
          response.once("end", () => resolve(response.statusCode));
        }
      );
      request.once("error", reject);
    });
    assert.equal(result, 403);
    assert.equal(hits, 0);
  } finally {
    await proxy.close();
    await close(target);
  }
});

test("CONNECT proxy refuses loopback without opening a tunnel", async () => {
  let connections = 0;
  const target = net.createServer(() => {
    connections += 1;
  });
  const targetPort = await listen(target);
  const proxy = await createSafeProxy();
  try {
    const response = await new Promise((resolve, reject) => {
      const socket = net.connect({ host: "127.0.0.1", port: proxy.port }, () => {
        socket.write(`CONNECT 127.0.0.1:${targetPort} HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n`);
      });
      socket.setEncoding("utf8");
      socket.once("data", (data) => {
        resolve(data);
        socket.destroy();
      });
      socket.once("error", reject);
    });
    assert.match(response, /^HTTP\/1\.1 403/);
    assert.equal(connections, 0);
  } finally {
    await proxy.close();
    await close(target);
  }
});
