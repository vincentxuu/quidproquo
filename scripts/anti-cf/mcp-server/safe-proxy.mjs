import http from "node:http";
import net from "node:net";
import { resolveSafeNetworkUrl } from "./guards.mjs";

const SOCKET_TIMEOUT_MS = 15_000;

function parseConnectTarget(authority) {
  let url;
  try {
    url = new URL(`https://${authority}`);
  } catch {
    throw new Error("invalid CONNECT target");
  }
  const port = url.port ? Number(url.port) : 443;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("invalid CONNECT port");
  }
  return { url, port };
}

function sanitizedHeaders(headers, host) {
  const result = { ...headers, host };
  delete result["proxy-authorization"];
  delete result["proxy-connection"];
  return result;
}

export async function createSafeProxy(options = {}) {
  const lookup = options.lookup;
  const sockets = new Set();

  const server = http.createServer(async (request, response) => {
    try {
      const { url, addresses } = await resolveSafeNetworkUrl(request.url, { lookup });
      if (request.destroyed || response.destroyed) return;
      if (url.protocol !== "http:") throw new Error("HTTPS must use CONNECT");
      const target = addresses[0];
      const upstream = http.request({
        host: target.address,
        family: target.family,
        port: url.port ? Number(url.port) : 80,
        method: request.method,
        path: `${url.pathname}${url.search}`,
        headers: sanitizedHeaders(request.headers, url.host),
        timeout: SOCKET_TIMEOUT_MS,
      });
      upstream.on("response", (upstreamResponse) => {
        response.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
        upstreamResponse.pipe(response);
      });
      upstream.on("timeout", () => upstream.destroy(new Error("upstream timeout")));
      upstream.on("error", () => {
        if (!response.headersSent) response.writeHead(502);
        response.end("Bad Gateway");
      });
      response.once("close", () => upstream.destroy());
      request.pipe(upstream);
    } catch {
      response.writeHead(403, { "content-type": "text/plain", connection: "close" });
      response.end("Forbidden");
    }
  });

  server.on("connect", async (request, clientSocket, head) => {
    let clientClosed = clientSocket.destroyed;
    clientSocket.once("close", () => {
      clientClosed = true;
    });
    try {
      const { url, port } = parseConnectTarget(request.url);
      const { addresses } = await resolveSafeNetworkUrl(url.href, { lookup });
      if (clientClosed || clientSocket.destroyed) return;
      const target = addresses[0];
      const upstreamSocket = net.connect({
        host: target.address,
        family: target.family,
        port,
      });
      sockets.add(upstreamSocket);
      upstreamSocket.setTimeout(SOCKET_TIMEOUT_MS);
      upstreamSocket.once("connect", () => {
        clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
        if (head.length) upstreamSocket.write(head);
        upstreamSocket.pipe(clientSocket);
        clientSocket.pipe(upstreamSocket);
      });
      upstreamSocket.once("timeout", () => upstreamSocket.destroy());
      upstreamSocket.once("error", () => clientSocket.destroy());
      upstreamSocket.once("close", () => sockets.delete(upstreamSocket));
      clientSocket.once("close", () => upstreamSocket.destroy());
    } catch {
      clientSocket.end("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    }
  });

  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("proxy failed to bind");
  let closePromise;

  return {
    port: address.port,
    url: `http://127.0.0.1:${address.port}`,
    async close() {
      if (!closePromise) {
        for (const socket of sockets) socket.destroy();
        closePromise = new Promise((resolve) => server.close(() => resolve()));
      }
      await closePromise;
    },
  };
}
