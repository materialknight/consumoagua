import { useEffect, useReducer, useState } from "react"
import MetersMenu from "./MetersMenu.jsx"
import TableSelect from "./TableSelect.jsx"
import TableFilter from "./TableFilter.jsx"
import DownloadButton from "./DownloadButton.jsx"
import AddRowButton from "./AddRowButton.jsx"
import ColSwitches from "./ColSwitches.jsx"
import MetersTable from "./MetersTable.jsx"
import THead from "./THead.jsx"
import TBody from "./TBody.jsx"
import reducer from "./reducer.js"
import { filter_indexes, set_initial_data } from "./core-funcs.js"
import { useIDB, useKeys, useLocalStorage } from "./custom-hooks.js"

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
   "deuda",
   "multa",
   "zona",
   "caserío"
]

export default function Meters() {
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
      deuda: true,
      multa: true,
      zona: true,
      caserío: true
   })

   const payment_states = ["exonerado", "pendiente", "efectuado", "acumulado sin multa", "acumulado con multa"]
   const [meters, dispatch] = useReducer(reducer, {
      table: [],
      editable: false,
      fine: null,
      last_pay_day: null
   })
   const [tableNum, setTableNum] = useState(null)
   const [filter, setFilter] = useState("")

   const filtered_cols = cols.filter(col => shownCols[col])
   const filtered_indexes = filter_indexes(meters.table, filtered_cols, filter)
   //! See if the 2 lines below leak memory by opening several connections, in which case, they should be in the parent component:
   const db_connection = useIDB("meters", 1, set_initial_data)
   const keys = useKeys(db_connection, "meters")

   useEffect(() => {
      if (keys.length > 0)
      {
         setTableNum(keys.at(-1))
      }
   }, [keys])

   useEffect(() => {
      if (tableNum)
      {
         db_connection.get("meters", tableNum).then(table => {
            dispatch({ type: "LOAD_TABLE", table })
         })
      }
   }, [tableNum])

   // useEffect(() => {
   //    if (db_connection)
   //    {
   //       db_connection.put("meters", meters)
   //    }
   // }, [db_connection, meters])

   return (
      <main>
         <MetersMenu>
            <TableSelect {...{ keys, tableNum, setTableNum }} />
            <TableFilter {...{ filter, setFilter }} />
            <DownloadButton {...{ meters }} />
            <AddRowButton {...{ db_connection, meters, tableNum, dispatch }} />
            <ColSwitches {...{ cols, shownCols, setShownCols }} />
         </MetersMenu>
         <MetersTable {...{ keys, filtered_indexes, tableNum, filter }}>
            <THead {...{ filtered_cols }} />
            <TBody {...{ meters, filtered_indexes, filtered_cols }} />
         </MetersTable>
      </main>
   )
}
