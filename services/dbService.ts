

const DB_NAME = 'AIWebsiteEditorDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let db: IDBDatabase;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error("Error opening IndexedDB."));
    request.onblocked = () => {
      console.warn('IndexedDB upgrade blocked. Please close other tabs with this app open.');
      reject(new Error("IndexedDB upgrade is blocked."));
    };
    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveImage = async (id: string, dataUrl: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, dataUrl });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Error saving image to IndexedDB."));
  });
};

export const getImage = async (id: string): Promise<string | undefined> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result?.dataUrl);
    };
    request.onerror = () => reject(new Error("Error getting image from IndexedDB."));
  });
};

export const getAllImages = async (): Promise<Map<string, string>> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        const imageMap = new Map<string, string>();

        request.onsuccess = () => {
            if (request.result) {
                request.result.forEach(item => {
                    imageMap.set(item.id, item.dataUrl);
                });
            }
            resolve(imageMap);
        };
        request.onerror = () => reject(new Error("Error fetching all images from IndexedDB."));
    });
}
