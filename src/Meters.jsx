import { useEffect, useState, createContext } from "react"
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

export const MetersContext = createContext()

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
      <MetersContext.Provider value={{ keys, meters, filtered_indexes, tableNum, setTableNum, filter, setFilter, cols, shownCols, setShownCols, filtered_cols }}>
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
      </MetersContext.Provider>
   )
}

{/* <nav>


   <search id='meter-search'>

      <div>
         <label for='history'>Tabla</label>
         <select id='history'></select>
      </div>

      <div>
         <span style='padding: 0.3rem 0.4rem;'>medidores:</span>
         <span id='total-medidores'></span>
      </div>

      <div>
         <label for='meter-filter'>Filtrar</label>
         <input id='meter-filter' type='search' spellcheck='false' size='18'>
      </div>

      <button type='button' id='meter-add-btn' title='agregar medidor'>
         +<img src='./icons/speed.png' height='24' width='24'>
      </button>
      <button type='button' id='reading-btn' title='tomar lectura'>
         <img src='./icons/task_alt.png' height='24' width='24'>
      </button>
      <button type='button' id='print-all-btn' title='imprimir recibos'>
         <img src='./icons/print.png' height='24' width='24'>
      </button>
      <button type='button' id='export-meters-csv' title='descargar .csv'>
         <img src='./icons/download.png' height='24' width='24'>&nbsp;.csv
      </button>
      <button type='button' id='export-meters-json' title='descargar .json'>
         <img src='./icons/download.png' height='24' width='24'>&nbsp;.json
      </button>

      <!-- <input type='button' id='meter-add-btn' value='+ medidor'> -->
         <!-- <input type='button' id='reading-btn' value='&check; lectura'> -->
            <!-- <input type='button' value='&#128424; imprimir' id='print-all-btn'> -->
               <!-- <input type='button' value='&#8628; .csv' id='export-meters-csv'> -->
                  <!-- <input type='button' value='&#8628; .json' id='export-meters-json'> -->

                     <div class='switch-box' id='meters-switches'></div>

                  </search>

                  <!-- <search id='fees-search' hidden>

                     <input type='button' value='&#8628; .csv' id='export-fees-csv'>
                        <input type='button' value='&#8628; .json' id='export-fees-json'>

                        </search>

                        <search id='csv-search' hidden>

                           <label for='csv-btn'>abrir .csv</label>
                           <input type='file' id='csv-btn' accept='.csv' hidden>

                              <div>
                                 <label for='csv-filter'>Filtrar</label>
                                 <input id='csv-filter' type='search' spellcheck='false' size='18' disabled>
                              </div>

                              <div class='switch-box' id='csv-switches'></div>

                        </search>

                        <search id='help-search' hidden>
                           <div>
                              <p>n° del 1er recibo: <span id='num-first-receipt'></span></p>
                              <input type='button' id='set-receipt-btn' value='cambiar'>
                                 <p>siguiente n° de recibo: <span id='num-next-receipt'></span></p>
                           </div>

                        </search> -->

                     </nav> */}