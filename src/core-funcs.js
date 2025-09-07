import { useState, useEffect, useRef } from "react"

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
   }, [])
   return db
}

export function useKeys(db, db_name) {
   const [keys, setKeys] = useState(null)
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

export function useLocalStorage(key, val) {
   const [fees, setFees] = useState(null)
   const load = key => JSON.parse(localStorage.getItem(key))
   const save = (key, val) => localStorage.setItem(key, JSON.stringify(val))
   useEffect(() => {
      if (val === null || val === undefined)
      {
         setFees(load(key))
         return
      }
      save(key, val)
      setFees(load(key))
   }, [key, val])
   return fees
}

export function parse_date(date_str) {
   const date_args = date_str
      .split("-")
      .map((numerical_str, i) => {
         const num = parseInt(numerical_str, 10)
         return i === 1 ? num - 1 : num
      })

   return new Date(...date_args)
}

export function set_initial_data(upgrade_needed_ev) {

   localStorage.setItem("fees", JSON.stringify([
      { mínimo: 0, máximo: 6, fórmula: "2.61" },
      { mínimo: 7, máximo: 40, fórmula: "0.25 * consumo + 1.60" },
      { mínimo: 41, máximo: 50, fórmula: "0.40 * (consumo - 40) + 10 + 1.60" },
      { mínimo: 51, máximo: 100, fórmula: "0.75 * consumo + 1.60" },
      { mínimo: 101, máximo: 150, fórmula: "1.00 * consumo + 1.60" },
      { mínimo: 151, máximo: 200, fórmula: "1.25 * consumo + 1.60" },
      { mínimo: 201, máximo: null, fórmula: "1.50 * consumo + 1.60" }
   ]))

   const db = upgrade_needed_ev.target.result
   const meters_store = db.createObjectStore("meters", { autoIncrement: true })

   // Test data below. Only 1 empty array should be added in production.
   meters_store.add([
      {
         medidor: "010101",
         titular: "Tobías López",
         anterior: 10,
         desde: new Date(1726293600000),
         actual: 20,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: 1,
         caserío: "La Paz"
      },
      {
         medidor: "020202",
         titular: "Levi Menénez",
         anterior: 0,
         desde: new Date(1726293600000),
         actual: 15,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: 1,
         caserío: "La Paz"
      },
      {
         medidor: "030303",
         titular: "Baruc Hernández",
         anterior: 20,
         desde: new Date(1726293600000),
         actual: 30,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: 1,
         caserío: "La Paz"
      }
   ])

   meters_store.add([
      {
         medidor: "010101",
         titular: "Tobías López",
         anterior: 20,
         desde: new Date(1726293600000),
         actual: 30,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: 1,
         caserío: "La Paz"
      },
      {
         medidor: "020202",
         titular: "Levi Menénez",
         anterior: 15,
         desde: new Date(1726293600000),
         actual: 40,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: 1,
         caserío: "La Paz"
      },
      {
         medidor: "030303",
         titular: "Baruc Hernández",
         anterior: 30,
         desde: new Date(1726293600000),
         actual: 50,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: 1,
         caserío: "La Paz"
      }
   ])

   // todo: sync table with .json, new table from .json.
   // todo: create indexes(?)
}


// ! Functions to be deleted:

function prompt_refresh() {
   db.close()
   alert("La base de datos está desactualizada! Por favor recargue la app, o ciérrela y vuélvala a abrir.")
}
