// Hooks:
import { useEffect, useReducer, useState, useRef } from "react"
import { useLocalStorage } from "./custom-hooks.js"
// Buttons:
import DownloadButton from "./DownloadButton.jsx"
import AddRowButton from "./AddRowButton.jsx"
import ReceiptButton from "./ReceiptButton.jsx"
import DateButton from "./DateButton.jsx"
import LastPayDayButton from "./LastPayDayButton.jsx"
// Modals:
import EditCellForm from "./EditCellForm.jsx"
import ReadingForm from "./ReadingForm.jsx"
// Other components:
import MetersMenu from "./MetersMenu.jsx"
import TableSelect from "./TableSelect.jsx"
import TableFilter from "./TableFilter.jsx"
import ColSwitches from "./ColSwitches.jsx"
import TableInfo from "./TableInfo.jsx"
import MetersTable from "./MetersTable.jsx"
import THead from "./THead.jsx"
import TBody from "./TBody.jsx"
import PrintButton from "./PrintButton.jsx"
import FineButton from "./FineButton.jsx"
import Receipt from "./Receipt.jsx"
import RowOptions from "./RowOptions.jsx"
// Utilities:
import reducer from "./reducer.js"
import { filter_indexes, display_date } from "./core-funcs.js"

export default function Meters({ db_connection, keys, fees, titles, logoURL }) {
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
   const [meters, dispatch] = useReducer(reducer, {
      fine: 0,
      last_pay_day: null,
      editable: false,
      table: []
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
   const [edited, setEdited] = useState(null) // { index, row, col }
   const readingForm = useRef()
   const data_cols = cols.filter(col => col.is_data)
   const rowOptionsRef = useRef()
   // Preparations for the receipts:
   const fees_grid_cells = fees.map((row, i) => {
      return [
         <div key={`${i}-A`} className="r-cell r-border">{row["mínimo"]} - {row["máximo"]}</div>,
         <div key={`${i}-B`} className="r-cell r-border">{row["fórmula"]}</div>
      ]
   })
   const last_pay_day = meters.last_pay_day
      ? display_date(meters.last_pay_day, dateFormat)
      : null
   const late_payment_fine = meters.fine.toFixed(2)
   const receipts = filtered_indexes.map(index => {
      const row = meters.table[index]
      const date_from = row["desde"]
      const date_until = row["hasta"]
      const days_span = date_from && date_until
         ? ((date_until - date_from) / (1000 * 60 * 60 * 24)) + 1
         : null
      const from = date_from
         ? display_date(date_from, dateFormat)
         : null
      const until = date_until
         ? display_date(date_until, dateFormat)
         : null
      const prev = row["anterior"]
      const next = row["actual"]
      const consumo = next !== null && prev !== null
         ? next - prev
         : null
      const formula = consumo
         ? fees.find(fee_row => consumo >= fee_row["mínimo"] && consumo <= fee_row["máximo"])?.["fórmula"]
         : null
      const consumption_fee = formula
         ? eval(formula)
         : 0
      const debt = row["deuda"]
      const fine = row["multa"]
      const others = row["otros"]
      const credit = row["crédito"]
      const total = consumption_fee + debt + fine + others - credit
      const receipt_args = {
         meter_num: row["medidor"],
         owner: row["titular"],
         prev,
         next,
         consumo,
         from,
         until,
         days_span,
         receipt_num: row["recibo"],
         consumption_fee,
         debt,
         fine,
         others,
         credit,
         total,
         zone: row["zona"],
         village: row["caserío"],
         last_pay_day,
         late_payment_fine,
         titles,
         logoURL,
         fees_grid_cells
      }
      return (
         <div key={index} className="couple">
            <Receipt {...receipt_args} />
            <Receipt {...receipt_args} />
         </div>
      )
   })

   return (
      <>
         <MetersMenu>
            <TableSelect {...{ keys, tableNum, setTableNum }} />
            <TableFilter {...{ filter, setFilter }} />
            <DownloadButton {...{ meters, btn_txt: "JSON" }} />
            <DownloadButton {...{ meters, btn_txt: "CSV", data_cols }} />
            <AddRowButton {...{ db_connection, meters, data_cols, tableNum, dispatch }} />
            <DateButton {...{ dateFormat, setDateFormat }} />
            <PrintButton />
            <ReceiptButton {...{ receiptNum, setReceiptNum }} />
            <ColSwitches {...{ cols, setCols }} />
         </MetersMenu>
         <main>
            <EditCellForm ref={editCellForm} {...{ edited, data_cols, dateFormat, db_connection, meters, tableNum, dispatch }} />
            <ReadingForm ref={readingForm} />
            <RowOptions {...{ rowOptionsRef, meters }} />
            <TableInfo {...{ meters, filtered_indexes, fees }}>
               <FineButton {...{ db_connection, meters, tableNum, dispatch }} />
               <LastPayDayButton {...{ db_connection, meters, tableNum, dateFormat, dispatch }} />
            </TableInfo>
            <MetersTable {...{ meters, filtered_indexes, filter, receiptNum }}>
               <THead {...{ visible_cols, setSorting }} />
               <TBody {...{ meters, filtered_indexes, visible_cols, dateFormat, editCellForm, setEdited, readingForm, rowOptionsRef }} />
            </MetersTable>
         </main>
         {/* ! For unknown reason, the receipts cause a forced reflow. */}
         {receipts}
      </>
   )
}
