import { openDB } from "idb";

const dbPromise = openDB("todo-db", 1, {
  upgrade(db) {
    db.createObjectStore("state");
  },
});

export async function saveState(state: any) {
  const db = await dbPromise;
  await db.put("state", state, "app");
  console.log("SAVESTATE ::", state);
}

export async function loadState() {
  const db = await dbPromise;
  return db.get("state", "app");
}

