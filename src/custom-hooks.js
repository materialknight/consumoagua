import { useState, useEffect } from "react"
import { set_initial_data } from "./core-funcs"
import open_IDB from "./idb-wrapper"

export function useIDB(db_name, db_version, upgrade_callback) {
   const [db, setDB] = useState(null)
   useEffect(() => {
      let db_connection = null
      open_IDB(db_name, db_version, upgrade_callback).then(db_con => {
         db_connection = db_con
         setDB(db_connection)
      })
   }, [db_name, db_version, upgrade_callback])
   return db
}

export function useIDBX2(db_name, db_version, upgrade_callback) {
   const [db, setDB] = useState(null)
   useEffect(() => {
      let db_connection = null
      open_IDB(db_name, db_version, upgrade_callback).then(db_con => {
         db_connection = db_con
         setDB(db_connection)
      })
      return () => {
         if (db_connection)
         {
            db_connection.close()
            console.log("Connection to IndexedDB closed.")
            setDB(null)
         }
      }
   }, [db_name, db_version, upgrade_callback])
   return db
}

export function useKeys(idb_connection, store) {
   const [keys, setKeys] = useState([])
   useEffect(() => {
      if (idb_connection)
      {
         idb_connection.get_all_keys(store).then(requested_keys => {
            setKeys(requested_keys)
         })
      }
   }, [idb_connection, store])
   return keys
}

export function useKeysX(db, db_name) {
   const [keys, setKeys] = useState([])
   useEffect(() => {
      if (!db) return

      const req_keys = db
         .transaction(db_name, "readonly")
         .objectStore(db_name)
         .getAllKeys()

      req_keys.onsuccess = () => {
         const retrieved_keys = req_keys.result
         setKeys(retrieved_keys)
      }
   }, [db, db_name])
   return keys
}
export function useDBX(db_name, db_version) {
   const [db, setDB] = useState(null)
   const setup_db = success => {
      const db_connection = success.target.result
      db_connection.onclose = () => console.error("Connection to IndexedDB closed unexpectedly.")
      db_connection.onerror = err => console.error(err)
      db_connection.onversionchange = () => {
         db_connection.close()
         alert("The database on this tab is outdated, refresh the page to get the new version.")
         console.warn("The database on this tab is outdated, refresh the page to get the new version.")
      }
      console.log('Connection to IndexedDB open.')
      setDB(db_connection)
   }
   useEffect(() => {
      const req = indexedDB.open(db_name, db_version)
      req.onerror = err => console.error(err)
      req.onupgradeneeded = set_initial_data
      req.onsuccess = setup_db
      return () => {
         if (req.result)
         {

         }
      }
   }, [db_name, db_version])
   return db
}

export function useLocalStorage(key, init_val = null) {
   const [val, setVal] = useState(() => {
      let saved = localStorage.getItem(key)
      if (saved === "undefined") return null
      saved = JSON.parse(saved)
      return saved === null && init_val !== undefined ? init_val : saved
   })
   useEffect(() => {
      console.log("Hit local storage!")
      if (val === undefined) throw new TypeError("Attempt to store undefined in localStorage!")
      localStorage.setItem(key, JSON.stringify(val))
   }, [key, val])
   return [val, setVal]
}
