import { setupCache } from 'axios-cache-adapter'
import localforage from 'localforage'
import memoryDriver from 'localforage-memoryStorageDriver'

const createCacheStore = () => {
  return localforage.createInstance({
    // List of drivers used
    driver: [
      localforage.INDEXEDDB,
      localforage.LOCALSTORAGE,
      memoryDriver
    ],
    // Prefix all storage keys to prevent conflicts
    name: 'qc-cache'
  })
}

export { createCacheStore }
