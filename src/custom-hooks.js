import { useState, useEffect } from "react"
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

export function useLocalStorage(key, init_val = null) {
   const [val, setVal] = useState(() => {
      let saved = localStorage.getItem(key)
      if (saved === "undefined") return null
      saved = JSON.parse(saved)
      return saved === null && init_val !== undefined ? init_val : saved
   })
   useEffect(() => {
      if (val === undefined) throw new TypeError("Attempt to store undefined in localStorage!")
      localStorage.setItem(key, JSON.stringify(val))
   }, [key, val])
   return [val, setVal]
}
