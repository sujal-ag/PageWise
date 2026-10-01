import { openDB } from 'idb';

const DBNAME = 'pagewise';
const DBVERSION = 1;
const STORENAME = 'chunks';

const getDB = async () => {
    return await openDB(DBNAME, DBVERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORENAME)) {
            db.createObjectStore(STORENAME, { keyPath: 'chunkIndex' });
        }
    }
})};

const saveChunks = async (chunks) => {
    const db = await getDB();
    const tx = db.transaction(STORENAME, 'readwrite');

    for (const chunk of chunks) {
        tx.store.put(chunk);
    }

    await tx.done;
}

const clearChunks = async() => {
    const db = await getDB();
    await db.clear(STORENAME);
}

const getAllChunks = async () => {
    const db = await getDB();
    return await db.getAll(STORENAME);
}

export {
    saveChunks,
    clearChunks,
    getAllChunks,
}