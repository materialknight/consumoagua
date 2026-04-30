import { useRef, useState } from "react"
import { InfoModal } from "./simpleModals"
import { parse_date, parse_input, display_val, display_date } from "./core-funcs"

export default function EditCellForm({ ref, edited, data_cols, dateFormat, db_connection, meters, tableNum, dispatch }) {
   const validationErrorRef = useRef()
   // const [repeatedMeter, setRepeatedMeter] = useState(null)
   const [errorText, setErrorText] = useState("")
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
      switch (edited_col)
      {
         case "medidor":
            const meter_repeated = copy.table.some(row => row["medidor"] === updated_val)
            if (meter_repeated)
            {
               // setRepeatedMeter(updated_val)
               setErrorText(`Error: No se modificó la fila porque cada fila debe tener un número de medidor diferente, y el medidor ${updated_val} ya existe.`)
               validationErrorRef.current.showModal()
               return
            }
            break
         case "titular": break
         case "anterior":
            const cur_reading = copy.table[edited_index]["actual"]
            if (updated_val > cur_reading)
            {
               setErrorText(`Error: No se modificó la fila porque la lectura anterior (${updated_val}) no puede ser mayor que la actual (${cur_reading}).`)
               validationErrorRef.current.showModal()
               return
            }
            break
         case "actual":
            const prev_reading = copy.table[edited_index]["anterior"]
            if (updated_val < prev_reading)
            {
               setErrorText(`Error: No se modificó la fila porque la lectura actual (${updated_val}) no puede ser menor que la anterior (${prev_reading}).`)
               validationErrorRef.current.showModal()
               return
            }
            break
         case "desde":
            const cur_reading_date = copy.table[edited_index]["hasta"]
            if (updated_val > cur_reading_date)
            {
               setErrorText(`Error: No se modificó la fila porque la fecha de la lectura anterior (${display_date(updated_val, dateFormat)}) no puede ser posterior a la fecha de la lectura actual (${display_date(cur_reading_date, dateFormat)}).`)
               validationErrorRef.current.showModal()
               return
            }
            break
         case "hasta":
            const prev_reading_date = copy.table[edited_index]["desde"]
            if (updated_val < prev_reading_date)
            {
               setErrorText(`Error: No se modificó la fila porque la fecha de la lectura actual (${display_date(updated_val, dateFormat)}) no puede ser anterior a la fecha de la lectura anterior (${display_date(prev_reading_date, dateFormat)}).`)
               validationErrorRef.current.showModal()
               return
            }
            break
         case "recibo":
            const receipt_repeated = copy.table.some(row => row["recibo"] === updated_val)
            if (receipt_repeated)
            {
               setErrorText(`Error: No se modificó la fila porque cada fila debe tener un número de recibo diferente, y el recibo ${updated_val} ya existe.`)
               validationErrorRef.current.showModal()
               return
            }
            break
         case "pago": break
         case "deuda": break
         case "multa": break
         case "otros": break
         case "crédito": break
         case "zona": break
         case "caserío": break
         default: throw new TypeError(`Unknown column name: ${edited_col}`)
      }
      copy.table[edited_index][edited_col] = updated_val
      db_connection.put("meters", tableNum, copy)
      dispatch({ type: "EDIT_CELL", copy })
      submit_ev.target.reset()
   }
   return (
      <>
         <InfoModal
            ref={validationErrorRef}
            text={errorText}
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
