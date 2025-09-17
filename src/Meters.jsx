import { useEffect, useState } from "react"
import MetersMenu from "./MetersMenu.jsx"
import TableSelect from "./TableSelect.jsx"
import TableFilter from "./TableFilter.jsx"
import DownloadButton from "./DownloadButton.jsx"
import AddRowButton from "./AddRowButton.jsx"
import ColSwitches from "./ColSwitches.jsx"
import MetersTable from "./MetersTable.jsx"
import THead from "./THead.jsx"
import TBody from "./TBody.jsx"
import { filter_indexes } from "./core-funcs.js"
import { useLocalStorage } from "./custom-hooks.js"

export default function Meters({ keys, db_connection }) {
   const cols = [
      "fila",
      "medidor",
      "titular",
      "anterior",
      "desde",
      "actual",
      "hasta",
      "recibo",
      "pago",
      "zona",
      "caserío"
   ]
   const [shownCols, setShownCols] = useLocalStorage("shown_cols", {
      fila: true,
      medidor: true,
      titular: true,
      anterior: true,
      desde: true,
      actual: true,
      hasta: true,
      recibo: true,
      pago: true,
      zona: true,
      caserío: true
   })
   const [meters, setMeters] = useState([])
   const [tableNum, setTableNum] = useState(null)
   const [filter, setFilter] = useState("")
   const [lastTableMutable, setLastTableMutable] = useState(true)

   const filtered_cols = cols.filter(col => shownCols[col])
   const filtered_indexes = filter_indexes(meters, filtered_cols, filter)

   useEffect(() => {
      if (Array.isArray(keys) && keys.length > 0)
      {
         setTableNum(keys.at(-1))
      }
   }, [keys])

   useEffect(() => {
      if (tableNum === null) return

      const req_table = db_connection
         .transaction("meters", "readonly")
         .objectStore("meters")
         .get(tableNum)

      req_table.onerror = err => console.error(err)
      req_table.onsuccess = () => {
         setMeters(req_table.result)
      }
   }, [tableNum])

   return (
      <main>
         <MetersMenu>
            <TableSelect {...{ keys, tableNum, setTableNum }} />
            <TableFilter {...{ filter, setFilter }} />
            <DownloadButton {...{ keys, tableNum, meters, lastTableMutable }} />
            <AddRowButton {...{ keys, tableNum, meters, lastTableMutable }} />
            <ColSwitches {...{ cols, shownCols, setShownCols }} />
         </MetersMenu>
         <MetersTable {...{ keys, filtered_indexes, tableNum, filter }}>
            <THead {...{ filtered_cols }} />
            <TBody {...{ meters, filtered_indexes, filtered_cols }} />
         </MetersTable>
      </main>
   )
}
