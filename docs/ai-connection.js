// One browser profile, one connection for both labs. Only a class credential belongs here.
import { read, save } from "./common.js";

export const defaultModel = "openai/gpt-6-luna";
const prefix = new URL(".", import.meta.url).pathname;
const defaults = globalThis.window?.CAMP_CONFIG || {};
const startingModel = defaults.model || defaultModel;
function publicSettings() {
  const legacy = read("ai", {}) || {};
  return {
    apiBase: legacy.apiBase ?? defaults.apiBase ?? "",
    model:
      !legacy.model || legacy.model === "gpt-4o-mini"
        ? startingModel
        : legacy.model,
  };
}
let current = publicSettings();
let memoryOnly = false;
let database;
const channel =
  typeof window !== "undefined" && typeof BroadcastChannel === "function"
    ? new BroadcastChannel("integem-ai:" + prefix)
    : null;
function open() {
  if (database) return database;
  database = new Promise((resolve, reject) => {
    const request = indexedDB.open("integem-connection:" + prefix, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("connection");
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        database = undefined;
      };
      resolve(db);
    };
    request.onerror = request.onblocked = () =>
      reject(Error("Connection storage unavailable"));
  }).catch((e) => {
    database = undefined;
    throw e;
  });
  return database;
}
async function readRecord() {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = db
      .transaction("connection")
      .objectStore("connection")
      .get("class");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function latestConnection() {
  if (!memoryOnly) {
    try {
      current = (await readRecord()) || publicSettings();
    } catch {
      /* The current visit still works when storage is disabled. */
    }
  }
  return current;
}
await latestConnection();
if (channel)
  channel.onmessage = () => {
    memoryOnly = false;
    void latestConnection();
  };
export const isConfigured = () => Boolean(current.apiBase && current.model);
export const hasCredential = (record) =>
  Boolean(record?.sealed || record?.temporary);
export async function saveConnection(
  apiBase,
  model,
  entered,
  endpoint = apiBase
) {
  const previous = await latestConnection();
  const next = { apiBase, model, endpoint };
  const keep =
    endpoint &&
    endpoint === (previous.endpoint || previous.apiBase) &&
    !entered;
  const token = entered || (keep ? previous.temporary : "");
  if (keep && previous.sealed && !token) next.sealed = previous.sealed;
  try {
    if (token) {
      const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const data = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
          additionalData: new TextEncoder().encode(endpoint),
        },
        key,
        new TextEncoder().encode(token)
      );
      next.sealed = { key, iv, data };
    }
    const db = await open();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("connection", "readwrite");
      tx.objectStore("connection").put(next, "class");
      tx.oncomplete = resolve;
      tx.onabort = tx.onerror = () => reject(tx.error);
    });
    current = next;
    memoryOnly = false;
    save("ai", { apiBase, model });
    channel?.postMessage("changed");
    return true;
  } catch {
    if (token) next.temporary = token;
    current = next;
    memoryOnly = true;
    return false;
  }
}
export async function authorization(record) {
  if (record.temporary) return record.temporary;
  if (!record.sealed) return "";
  const { key, iv, data } = record.sealed;
  const plain = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      additionalData: new TextEncoder().encode(
        record.endpoint || record.apiBase
      ),
    },
    key,
    data
  );
  return new TextDecoder().decode(plain);
}
export const resetModel = startingModel;
