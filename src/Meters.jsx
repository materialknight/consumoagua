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
import ReceiptButton from "./ReceiptButton.jsx"

export default function Meters() {
   const [cols, setCols] = useLocalStorage("cols", [
      { name: "fila", visible: true, type: "Number", is_data: false },
      { name: "medidor", visible: true, type: "String", is_data: true },
      { name: "titular", visible: true, type: "String", is_data: true },
      { name: "anterior", visible: true, type: "Number", is_data: true },
      { name: "desde", visible: true, type: "Date", is_data: true },
      { name: "actual", visible: true, type: "Number", is_data: true },
      { name: "hasta", visible: true, type: "Date", is_data: true },
      { name: "recibo", visible: true, type: "Number", is_data: true },
      { name: "pago", visible: true, type: "Number", is_data: true },
      { name: "deuda", visible: true, type: "Number", is_data: true },
      { name: "multa", visible: true, type: "Number", is_data: true },
      { name: "zona", visible: true, type: "String", is_data: true },
      { name: "caserío", visible: true, type: "String", is_data: true },
   ])
   const [receiptNum, setReceiptNum] = useLocalStorage("receipt_num", null)

   const payment_states = ["exonerado", "pendiente", "efectuado", "acumulado sin multa", "acumulado con multa"]
   const [meters, dispatch] = useReducer(reducer, {
      table: [],
      editable: false,
      fine: null,
      last_pay_day: null
   })
   const [tableNum, setTableNum] = useState(null)
   const [filter, setFilter] = useState("")

   const filtered_cols = cols.filter(col => col.visible).map(col => col.name)
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

   return (
      <main>
         <MetersMenu>
            <TableSelect {...{ keys, tableNum, setTableNum }} />
            <TableFilter {...{ filter, setFilter }} />
            <DownloadButton {...{ meters }} />
            <AddRowButton {...{ db_connection, meters, cols, tableNum, dispatch }} />
            <ReceiptButton {...{ receiptNum, setReceiptNum }} />
            <ColSwitches {...{ cols, setCols }} />
         </MetersMenu>
         <MetersTable {...{ meters, filtered_indexes, filter, receiptNum }}>
            <THead {...{ filtered_cols }} />
            <TBody {...{ meters, filtered_indexes, filtered_cols }} />
         </MetersTable>
      </main>
   )
}
