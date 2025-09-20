class IDB_connection {
   constructor(db) {
      this.db = db
   }
   close() {
      this.db.close()
   }
   get_all_keys(store) {
      return new Promise((resolve, reject) => {
         const tx = this.db.transaction(store, "readonly")
         tx.onerror = () => {
            reject(tx.error)
         }
         const req = tx.objectStore(store).getAllKeys()
         req.onsuccess = () => {
            resolve(req.result)
         }
      })
   }
   get(store, key) {
      return new Promise((resolve, reject) => {
         const tx = this.db.transaction(store, "readonly")
         tx.onerror = () => {
            reject(tx.error)
         }
         const req = tx.objectStore(store).get(key)
         req.onsuccess = () => {
            resolve(req.result)
         }
      })
   }
   put(store, key, value) {
      return new Promise((resolve, reject) => {
         const tx = this.db.transaction(store, "readwrite")
         tx.onerror = () => {
            reject(tx.error)
         }
         const req = tx.objectStore(store).put(value, key)
         req.onsuccess = () => {
            resolve(req.result)
         }
      })
   }
}

export default function open_IDB(db_name, db_version, upgrade_callback) {
   return new Promise((resolve, reject) => {
      const req = indexedDB.open(db_name, db_version)
      req.onerror = () => {
         reject(req.error)
      }
      req.onupgradeneeded = upgrade_need => {
         if (upgrade_callback)
         {
            const db = upgrade_need.target.result
            const old_version_num = upgrade_need.oldVersion
            const new_version_num = upgrade_need.newVersion
            upgrade_callback(db, old_version_num, new_version_num)
         }
         else
         {
            console.warn("No database upgrade function.")
         }
      }
      req.onsuccess = () => {
         const db = req.result
         db.onclose = () => {
            console.error("Connection to IndexedDB closed unexpectedly.")
         }
         db.onerror = err => {
            console.error(err)
         }
         db.onversionchange = () => {
            db.close()
            alert("The database on this tab is outdated, refresh the page to get the new version.")
         }
         console.log("Connection to IndexedDB open.")
         resolve(new IDB_connection(db))
      }
   })
}
