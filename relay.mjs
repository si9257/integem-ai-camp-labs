// Node 22+; run from this repository: node --env-file=.env relay.mjs
import http from "node:http";
import { readFile } from "node:fs/promises";
import { timingSafeEqual, createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const env = process.env;
const port = Number(env.PORT || 8787);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw Error("PORT must be 1–65535");
const model = (env.UPSTREAM_MODEL || "gpt-4o-mini").trim();
const providerKey = env.UPSTREAM_API_KEY || "";
const token = env.CLASS_TOKEN || "";
const expiry = Date.parse(env.CLASS_TOKEN_EXPIRES || "");
const origins = new Set(
  ["localhost", "127.0.0.1"].map((host) => "http://" + host + ":" + port)
);
const school = (env.ALLOWED_ORIGIN || "").trim();
if (school) {
  const u = new URL(school);
  if (u.protocol !== "https:" || u.origin !== school)
    throw Error(
      "ALLOWED_ORIGIN must be a single HTTPS origin without a path or trailing slash"
    );
  origins.add(school);
}
const schoolMode = Boolean(school || token);
if (
  schoolMode &&
  (token.length < 20 || !Number.isFinite(expiry) || expiry <= Date.now())
)
  throw Error(
    "Configure a random CLASS_TOKEN (20+ characters) and future UTC CLASS_TOKEN_EXPIRES"
  );
const base = new URL(env.UPSTREAM_BASE_URL || "https://api.openai.com/v1");
if (
  (base.protocol !== "https:" &&
    !(
      base.protocol === "http:" &&
      ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname)
    )) ||
  base.username ||
  base.password ||
  base.search ||
  base.hash
)
  throw Error(
    "Use an HTTPS upstream base or local HTTP endpoint without embedded credentials"
  );
const path = base.pathname.replace(/\/+$/, "");
if (!path.endsWith("/chat/completions"))
  base.pathname = (path || "/v1") + "/chat/completions";
const positive = (v, otherwise) => {
  const n = Number(v || otherwise);
  if (!Number.isSafeInteger(n) || n < 1)
    throw Error("Limits must be positive integers");
  return n;
};
const hourlyCap = positive(env.REQUESTS_PER_HOUR, 60),
  maxOutput = positive(env.MAX_OUTPUT_TOKENS, 2500);
const contentTypes = {
  html: "text/html",
  css: "text/css",
  webp: "image/webp",
  png: "image/png",
  webmanifest: "application/manifest+json",
  js: "text/javascript",
};
const files = new Set([
  "index.html",
  "study/index.html",
  "travel/index.html",
  "camp.css",
  "common.js",
  "home.js",
  "ai.js",
  "sample.js",
  "study.js",
  "places.js",
  "city-map.js",
  "mobile.css",
  "app-ui.js",
  "family.js",
  "round.js",
  "decks.js",
  "study-deck.webp",
  "app-glyphs.png",
  "study.webmanifest",
  "travel.webmanifest",
  "study-icon-192.png",
  "study-icon-512.png",
  "travel-icon-192.png",
  "travel-icon-512.png",
  "place-exploratorium.webp",
  "place-academy.webp",
  "place-tunnel-tops.webp",
  "place-golden-gate.webp",
  "place-flight.webp",
  "place-pacsci.webp",
  "place-sculpture.webp",
  "place-aquarium.webp",
  "place-natural-history.webp",
  "place-air-space.webp",
  "place-conservatory.webp",
  "place-lincoln.webp",
  "cover-study.webp",
  "cover-sf.webp",
  "cover-sea.webp",
  "cover-dc.webp",
  "weather.js",
  "travel.js",
]);
const prefix = "/integem-ai-camp-labs/";
const json = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
};
function sameToken(a, b) {
  const digest = (s) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(a), digest(b));
}
let usage = [],
  inFlight = 0;
async function readBody(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 128 * 1024) throw Error("too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function upstreamReply(req, res) {
  const origin = req.headers.origin;
  if (!origins.has(origin))
    return json(res, 403, { error: "Origin is not allowed" });
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "600",
    });
    return res.end();
  }
  if (req.method !== "POST") return json(res, 405, { error: "Use POST" });
  if (
    schoolMode &&
    (Date.now() >= expiry ||
      !sameToken(req.headers.authorization || "", "Bearer " + token))
  )
    return json(res, 401, { error: "Invalid or expired class credential" });
  if (!providerKey)
    return json(res, 503, {
      error: "The teacher has not configured the upstream key",
    });
  if (
    !String(req.headers["content-type"] || "")
      .toLowerCase()
      .startsWith("application/json")
  )
    return json(res, 415, { error: "Expected JSON" });
  let data;
  try {
    data = await readBody(req);
  } catch {
    return json(res, 400, { error: "Invalid or oversized JSON" });
  }
  const msgs = data?.messages;
  if (
    data?.model !== model ||
    !Array.isArray(msgs) ||
    msgs.length < 1 ||
    msgs.length > 16 ||
    msgs.some(
      (m) =>
        !m ||
        !["system", "user", "assistant"].includes(m.role) ||
        typeof m.content !== "string" ||
        !m.content.trim()
    ) ||
    msgs.reduce((n, m) => n + m.content.length, 0) > 64000
  )
    return json(res, 400, {
      error: "Check the configured model, message count and length",
    });
  usage = usage.filter((time) => time > Date.now() - 3600000);
  if (inFlight >= 4 || usage.length >= hourlyCap)
    return json(res, 429, { error: "Class limit reached" });
  usage.push(Date.now());
  inFlight++;
  try {
    const outgoing = {
      model,
      messages: msgs.map(({ role, content }) => ({ role, content })),
      stream: false,
    };
    // Some compatible servers accept only the older max_tokens spelling.
    outgoing[
      env.TOKEN_LIMIT_FIELD === "max_tokens"
        ? "max_tokens"
        : "max_completion_tokens"
    ] = maxOutput;
    const upstream = await fetch(base, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(55000),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + providerKey,
      },
      body: JSON.stringify(outgoing),
    });
    if (!upstream.ok)
      return json(
        res,
        [400, 401, 403, 429].includes(upstream.status) ? upstream.status : 502,
        { error: "Upstream request failed" }
      );
    const reader = upstream.body.getReader();
    let size = 0;
    const pieces = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 512 * 1024) {
        await reader.cancel();
        throw Error("Response too large");
      }
      pieces.push(value);
    }
    const answer = JSON.parse(Buffer.concat(pieces).toString("utf8"))
      .choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim())
      throw Error("Missing reply");
    json(res, 200, {
      choices: [{ message: { role: "assistant", content: answer } }],
    });
  } catch {
    json(res, 502, {
      error: "Upstream unavailable, timed out, or returned an unreadable reply",
    });
  } finally {
    inFlight--;
  }
}
export async function handleRequest(req, res) {
  try {
    res.setHeader("X-Content-Type-Options", "nosniff");
    const host = req.headers.host;
    const validHost =
      host === "127.0.0.1:" + port ||
      host === "localhost:" + port ||
      (schoolMode && school && host === new URL(school).host);
    if (!validHost) return json(res, 403, { error: "Unexpected host" });
    const p = new URL(req.url, "http://127.0.0.1").pathname;
    if (p === "/v1/chat/completions") return await upstreamReply(req, res);
    if (req.method !== "GET" && req.method !== "HEAD")
      return json(res, 405, { error: "Use GET or HEAD" });
    if (p === "/" || p === prefix.slice(0, -1)) {
      res.writeHead(302, { Location: prefix });
      return res.end();
    }
    if (!p.startsWith(prefix)) return json(res, 404, { error: "Not found" });
    let file = p.slice(prefix.length);
    if (!file || file.endsWith("/")) file += "index.html";
    if (file === "config.js") {
      res.writeHead(200, {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      });
      return res.end(
        req.method === "HEAD"
          ? ""
          : 'window.CAMP_CONFIG=Object.freeze({apiBase:location.origin+"/v1",model:' +
              JSON.stringify(model) +
              "});"
      );
    }
    if (!files.has(file)) return json(res, 404, { error: "Not found" });
    const body = await readFile(new URL("./docs/" + file, import.meta.url));
    res.writeHead(200, {
      "Content-Type":
        contentTypes[file.split(".").pop()] +
        (/\.(webp|png)$/.test(file) ? "" : "; charset=utf-8"),
      "Cache-Control": "no-cache",
    });
    res.end(req.method === "HEAD" ? "" : body);
  } catch {
    if (!res.headersSent) json(res, 500, { error: "Unable to serve request" });
    else res.end();
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const server = http.createServer(handleRequest);
  server.headersTimeout = 12000;
  server.requestTimeout = 20000;
  server.listen(port, "127.0.0.1", () =>
    console.log("Integem Camp Labs: http://127.0.0.1:" + port + prefix)
  );
}
