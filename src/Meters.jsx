// Hooks:
import { useEffect, useReducer, useState, useRef } from "react"
import { useLocalStorage } from "./custom-hooks.js"
// Buttons:
import DownloadButton from "./DownloadButton.jsx"
import AddRowButton from "./AddRowButton.jsx"
import ReceiptButton from "./ReceiptButton.jsx"
import DateButton from "./DateButton.jsx"
import LogoButton from "./LogoButton.jsx"
// Modals:
import EditCellForm from "./EditCellForm.jsx"
import ReadingForm from "./ReadingForm.jsx"
// Other components:
import MetersMenu from "./MetersMenu.jsx"
import TableSelect from "./TableSelect.jsx"
import TableFilter from "./TableFilter.jsx"
import ColSwitches from "./ColSwitches.jsx"
import MetersTable from "./MetersTable.jsx"
import THead from "./THead.jsx"
import TBody from "./TBody.jsx"
import reducer from "./reducer.js"
// Utilities:
import { filter_indexes } from "./core-funcs.js"

export default function Meters({ db_connection, keys }) {
   const [cols, setCols] = useLocalStorage("cols", [
      { name: "fila", visible: true, type: "Number", is_data: false },
      { name: "medidor", visible: true, type: "String", is_data: true },
      { name: "titular", visible: true, type: "String", is_data: true },
      { name: "anterior", visible: true, type: "Number", is_data: true },
      { name: "actual", visible: true, type: "Number", is_data: true, init: null },
      { name: "desde", visible: true, type: "Date", is_data: true },
      { name: "hasta", visible: true, type: "Date", is_data: true, init: null },
      { name: "recibo", visible: true, type: "Number", is_data: true, init: null },
      { name: "pago", visible: true, type: "Number", is_data: true, init: null },
      { name: "deuda", visible: true, type: "Number", is_data: true, init: 0 },
      { name: "multa", visible: true, type: "Number", is_data: true, init: 0 },
      { name: "otros", visible: true, type: "Number", is_data: true, init: 0 },
      { name: "crédito", visible: true, type: "Number", is_data: true, init: 0 },
      { name: "zona", visible: true, type: "String", is_data: true },
      { name: "caserío", visible: true, type: "String", is_data: true },
   ])
   const [receiptNum, setReceiptNum] = useLocalStorage("receipt_num", null)
   const [dateFormat, setDateFormat] = useLocalStorage("date_format", {
      day: "numeric",
      month: "short",
      year: "2-digit"
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
   const [sorting, setSorting] = useState({ col: "fila", asc: true })

   const sorting_col_type = cols.find(col => col.name === sorting.col).type
   const visible_cols = cols.filter(col => col.visible).map(col => col.name)
   const filtered_indexes = filter_indexes(meters.table, visible_cols, filter, dateFormat).toSorted((i_A, i_B) => {
      if (sorting.col === "fila")
      {
         return sorting.asc ? i_A - i_B : i_B - i_A
      }
      const elem_A = meters.table[i_A][sorting.col]
      const elem_B = meters.table[i_B][sorting.col]
      if (elem_A === null) return sorting.asc ? -1 : 1
      if (elem_B === null) return sorting.asc ? 1 : -1
      if (sorting_col_type === "String")
      {
         // Tal vez haga falta usar localeCompare().
         if (elem_A < elem_B) return sorting.asc ? -1 : 1
         if (elem_A > elem_B) return sorting.asc ? 1 : -1
         if (elem_A === elem_B) return 0
      }
      return sorting.asc ? elem_A - elem_B : elem_B - elem_A
   })

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

   const editCellForm = useRef()
   const [editable, setEditable] = useState(null)
   const readingForm = useRef()
   const data_cols = cols.filter(col => col.is_data)

   return (
      <>
         <MetersMenu>
            <TableSelect {...{ keys, tableNum, setTableNum }} />
            <TableFilter {...{ filter, setFilter }} />
            <DownloadButton {...{ meters }} />
            <AddRowButton {...{ db_connection, meters, data_cols, tableNum, dispatch }} />
            <DateButton {...{ dateFormat, setDateFormat }} />
            <ReceiptButton {...{ receiptNum, setReceiptNum }} />
            <LogoButton {...{ db_connection }} />
            <ColSwitches {...{ cols, setCols }} />
         </MetersMenu>
         <main>
            <EditCellForm ref={editCellForm} {...{ editable, data_cols, dateFormat, db_connection }} />
            <ReadingForm ref={readingForm} />
            <MetersTable {...{ meters, filtered_indexes, filter, receiptNum }}>
               <THead {...{ visible_cols, setSorting }} />
               <TBody {...{ meters, filtered_indexes, visible_cols, dateFormat, editCellForm, setEditable, readingForm }} />
            </MetersTable>
         </main>
      </>
   )
}
