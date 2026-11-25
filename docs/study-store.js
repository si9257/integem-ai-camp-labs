import { read, save } from "./common.js";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      "integem-study-" + new URL(".", import.meta.url).pathname,
      1
    );
    request.onupgradeneeded = () =>
      request.result.createObjectStore("workspaces");
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(Error("Storage is in use"));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}
function readSnapshot(db, key) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction("workspaces")
      .objectStore("workspaces")
      .get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function writeSnapshot(db, key, snapshot) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("workspaces", "readwrite");
    tx.objectStore("workspaces").put(snapshot, key);
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error || Error("Write interrupted"));
  });
}
export async function openStudyStore(key) {
  const local = read(key, null);
  let db, saved;
  try {
    db = await openDatabase();
    saved = await readSnapshot(db, key);
  } catch {
    db?.close();
    db = null;
  }
  let last = Math.max(local?._deskSavedAt || 0, saved?.at || 0);
  return {
    initial:
      saved && saved.at >= (local?._deskSavedAt || 0) ? saved.state : local,
    async write(state) {
      const at = Math.max(Date.now(), last + 1);
      last = at;
      if (db) {
        try {
          await writeSnapshot(db, key, { at, state });
          return true;
        } catch {
          /* A smaller emergency copy can still fit in Web Storage. */
        }
      }
      if (at < last) return false;
      return save(key, { ...state, _deskSavedAt: at });
    },
  };
}
