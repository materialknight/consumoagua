import { useRef, useState } from "react"
import { InfoModal } from "./simpleModals"
import { parse_date, display_val } from "./core-funcs"

export default function EditCellForm({ ref, edited, data_cols, dateFormat, db_connection, meters, tableNum, dispatch }) {
   const repetitionRef = useRef()
   const [repeatedMeter, setRepeatedMeter] = useState(null)
   let row_info = null
   let edited_col = null
   let edited_val = null
   let edited_index = null
   let new_val_input = null
   if (edited && edited.col !== "fila")
   {
      edited_index = edited.index
      edited_col = edited.col
      edited_val = display_val(edited_index, edited.row, edited_col, dateFormat)
      row_info = create_row_grid(data_cols, edited, dateFormat)
      new_val_input = create_input(edited_col)
   }
   const update_val = submit_ev => {
      const input_data = Object.fromEntries(new FormData(submit_ev.target))
      const updated_val = parse_input(input_data[edited_col], edited_col)
      const copy = structuredClone(meters)
      // Edition START
      if (edited_col === "medidor")
      {
         const meter_repeated = copy.table.some(row => row["medidor"] === updated_val)
         if (meter_repeated)
         {
            setRepeatedMeter(updated_val)
            repetitionRef.current.showModal()
            return
         }
      }
      // Edition END

      copy.table[edited_index][edited_col] = updated_val
      db_connection.put("meters", tableNum, copy)
      dispatch({ type: "EDIT_CELL", copy })
      submit_ev.target.reset()
   }
   return (
      <>
         <InfoModal
            ref={repetitionRef}
            text={`Error: No se modificó la fila porque cada fila debe tener un número de medidor diferente, y el medidor ${repeatedMeter} ya existe.`}
         />
         <dialog ref={ref}>
            <form method="dialog" className="edit-cell-form" onSubmit={update_val} onReset={() => {
               ref.current.close()
            }}>
               <h2 className="dialog-title">Información de fila</h2>
               <div className="row-info">
                  {row_info}
               </div>
               <h2 className="dialog-title"> Editar "{edited_col}":</h2>
               <div className="edit-grid">
                  <label>
                     <span>Valor actual:</span>
                     <span>{edited_val}</span>
                  </label>
                  <label>
                     <span>Nuevo valor:</span>
                     {new_val_input}
                  </label>
               </div>

               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button type="reset" className="text-btn not-ok-btn">Cancelar</button>
               </div>
            </form>
         </dialog>
      </>
   )
}

function create_input(edited_col) {
   switch (edited_col)
   {
      case "medidor": return <input type="text" className="shortened" name={edited_col} required />
      case "titular": return <input type="text" className="shortened" name={edited_col} required />
      case "anterior": return <input type="number" className="shortened" name={edited_col} min="0" required />
      case "actual": return <input type="number" className="shortened" name={edited_col} min="0" required />
      case "desde": return <input type="date" className="shortened" name={edited_col} required />
      case "hasta": return <input type="date" className="shortened" name={edited_col} required />
      case "recibo": return <input type="number" className="shortened" name={edited_col} min="0" required />
      case "pago": return (
         <select required name={edited_col}>
            <option value="">-- Elija un estado de pago --</option>
            <option value="exonerado">Exonerado</option>
            <option value="pendiente">Pendiente</option>
            <option value="efectuado">Efectuado</option>
            <option value="acumulado sin multa">Acumulado sin multa</option>
            <option value="acumulado con multa">Acumulado con multa</option>
         </select>
      )
      case "deuda": return <input type="number" className="shortened" name={edited_col} min="0" step="0.01" required />
      case "multa": return <input type="number" className="shortened" name={edited_col} min="0" step="0.01" required />
      case "otros": return <input type="number" className="shortened" name={edited_col} min="0" step="0.01" required />
      case "crédito": return <input type="number" className="shortened" name={edited_col} min="0" step="0.01" required />
      case "zona": return <input type="text" className="shortened" name={edited_col} required />
      case "caserío": return <input type="text" className="shortened" name={edited_col} required />
      default: throw new TypeError(`Unexpected column type: ${edited_col}`)

   }
}

function create_row_grid(data_cols, edited, dateFormat) {
   return data_cols.map((col, i) => {
      const val = display_val(null, edited.row, col.name, dateFormat)
      return (
         <div key={i} className={col.name === edited.col ? "highlighted" : ""}>
            <span>{col.name}:</span>
            <span>{val}</span>
         </div>
      )
   })
}

function parse_input(val, edited_col) {
   switch (edited_col)
   {
      case "medidor": return val.trim()
      case "titular": return val.trim()
      case "anterior": return parseInt(val)
      case "actual": return parseInt(val)
      case "desde": return parse_date(val)
      case "hasta": return parse_date(val)
      case "recibo": return parseInt(val)
      case "pago": return val
      case "deuda": return parseFloat(val)
      case "multa": return parseFloat(val)
      case "otros": return parseFloat(val)
      case "crédito": return parseFloat(val)
      case "zona": return val.trim()
      case "caserío": return val.trim()
      default: throw new TypeError(`Unexpected column type: ${edited_col}`)
   }
}
