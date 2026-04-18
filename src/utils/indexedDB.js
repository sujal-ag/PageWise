import { openDB } from 'idb';

const DBNAME = 'pagewise';
const DBVERSION = 1;
const STORENAME = 'chunks';

const db = openDB(DBNAME, DBVERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORENAME)) {
            db.createObjectStore(STORENAME, { keyPath: 'id', autoIncrement: true });
        }
    }
});