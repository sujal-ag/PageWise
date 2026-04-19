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
    for (const chunk of chunks) {
        await db.put(STORENAME, chunk);
    };
}

const clearChunks = async() => {
    const db = await getDB();
    await db.clear(STORENAME);
}

export {
    saveChunks,
    clearChunks
}