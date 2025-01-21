import { openDB, DBSchema, IDBPDatabase } from 'idb';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = "thisisencryptionkeyinproductionuseENV";  // In production, use environment variables

interface BookmarkDB extends DBSchema {
  folders: {
    key: string;
    value: {
      id: string;
      name: string;
      createdAt: number;
    };
  };
  bookmarks: {
    key: string;
    value: {
      id: string;
      folderId: string;
      title: string;
      url: string;
      description: string;
      createdAt: number;
    };
    indexes: { 'by-folder': string };
  };
}

// Encryption/Decryption helpers
const encrypt = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decrypt = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

let db: IDBPDatabase<BookmarkDB>;

export const initDB = async () => {
  db = await openDB<BookmarkDB>('bookmarks-db', 1, {
    upgrade(db) {
      const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
      const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
      bookmarkStore.createIndex('by-folder', 'folderId');
    },
  });
};

export const createFolder = async (name: string) => {
  const folder = {
    id: crypto.randomUUID(),
    name: encrypt(name),
    createdAt: Date.now(),
  };
  await db.add('folders', folder);
  return { ...folder, name: decrypt(folder.name) };
};

export const getFolders = async () => {
  const folders = await db.getAll('folders');
  return folders.map(folder => ({
    ...folder,
    name: decrypt(folder.name),
  }));
};

export const deleteFolder = async (id: string) => {
  const bookmarks = await db.getAllFromIndex('bookmarks', 'by-folder', id);
  if (bookmarks.length > 0) {
    throw new Error('Folder is not empty');
  }
  await db.delete('folders', id);
};

export const createBookmark = async (bookmark: {
  folderId: string;
  title: string;
  url: string;
  description: string;
}) => {
  const encryptedBookmark = {
    id: crypto.randomUUID(),
    folderId: bookmark.folderId,
    title: encrypt(bookmark.title),
    url: encrypt(bookmark.url),
    description: encrypt(bookmark.description),
    createdAt: Date.now(),
  };
  await db.add('bookmarks', encryptedBookmark);
  return {
    ...encryptedBookmark,
    title: decrypt(encryptedBookmark.title),
    url: decrypt(encryptedBookmark.url),
    description: decrypt(encryptedBookmark.description),
  };
};

export const getBookmarksByFolder = async (folderId: string) => {
  const bookmarks = await db.getAllFromIndex('bookmarks', 'by-folder', folderId);
  return bookmarks.map(bookmark => ({
    ...bookmark,
    title: decrypt(bookmark.title),
    url: decrypt(bookmark.url),
    description: decrypt(bookmark.description),
  }));
};

export const deleteBookmark = async (id: string) => {
  await db.delete('bookmarks', id);
};