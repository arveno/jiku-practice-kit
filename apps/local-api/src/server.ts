import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { LocalDatabaseStore } from "./store";

export function createLocalApiServer(store: LocalDatabaseStore) {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");

      if (request.method === "GET" && url.pathname === "/health") {
        sendJson(response, 200, { ok: true });
        return;
      }

      if (request.method === "GET" && url.pathname === "/database/status") {
        sendJson(response, 200, await store.ensureReady());
        return;
      }

      if (request.method === "GET" && url.pathname === "/sessions/active") {
        const session = await store.readActiveSession();
        sendJson(
          response,
          session === null ? 404 : 200,
          session ?? { error: "not found" }
        );
        return;
      }

      const sessionMatch = url.pathname.match(/^\/sessions\/([^/]+)$/);
      if (sessionMatch?.[1] && request.method === "GET") {
        const session = await store.readSession(decodeURIComponent(sessionMatch[1]));
        sendJson(
          response,
          session === null ? 404 : 200,
          session ?? { error: "not found" }
        );
        return;
      }
      if (sessionMatch?.[1] && request.method === "PUT") {
        await store.writeSession(await readJsonBody(request));
        sendJson(response, 200, { ok: true });
        return;
      }

      if (request.method === "POST" && url.pathname === "/attempts") {
        await store.appendAttempt(await readJsonBody(request));
        sendJson(response, 200, { ok: true });
        return;
      }

      const progressMatch = url.pathname.match(/^\/question-progress\/([^/]+)$/);
      if (progressMatch?.[1] && request.method === "GET") {
        const progress = await store.readQuestionProgress(
          decodeURIComponent(progressMatch[1])
        );
        sendJson(
          response,
          progress === null ? 404 : 200,
          progress ?? { error: "not found" }
        );
        return;
      }
      if (progressMatch?.[1] && request.method === "PUT") {
        await store.writeQuestionProgress(await readJsonBody(request));
        sendJson(response, 200, { ok: true });
        return;
      }

      sendJson(response, 404, { error: "not found" });
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : "bad request"
      });
    }
  });
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
