import { useState, useEffect } from "react"
import { set_initial_data } from "./core-funcs"

export function useDB(db_name, db_version) {
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
   }, [db_name, db_version])
   return db
}

export function useKeys(db, db_name) {
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

export function useLocalStorage(key, init_val = null) {
   const [store, setStore] = useState(() => {
      let saved = localStorage.getItem(key)
      if (saved === "undefined") return null
      saved = JSON.parse(saved)
      return saved === null && init_val !== undefined ? init_val : saved
   })
   useEffect(() => {
      if (store === undefined) throw new TypeError("Attempt to store undefined in localStorage!")
      localStorage.setItem(key, JSON.stringify(store))
   }, [key, store])
   return [store, setStore]
}
