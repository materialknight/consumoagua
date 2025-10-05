import { display_date, parse_date } from "./core-funcs"

export default function EditCellForm({ ref, edited, data_cols, dateFormat, db_connection, meters }) {
   let row_info = null
   let edited_col = null
   let edited_val = null
   let edited_val_type = null
   let edited_index = null
   let new_val_input = null
   if (edited)
   {
      edited_index = edited.row_index
      edited_col = edited.col
      edited_val_type = data_cols.find(col => col.name === edited_col)?.type
      edited_val = edited_val_type === "Date"
         ? display_date(edited.row[edited_col], dateFormat)
         : edited.row[edited_col]
      row_info = create_row_grid(data_cols, edited, dateFormat)
      new_val_input = create_input(edited_col)
   }
   const update_val = submit_ev => {
      const input_data = Object.fromEntries(new FormData(submit_ev.target))
      let updated_val = null
      parse_input()

      const copy = structuredClone(meters)
      console.log(edited.row[edited_col])

      // const updated_val = edited_val_type === "Date"
      //    ? parse_date(input_data[edited_col])
      //    : input_data[edited_col]

      console.log(updated_val)
      // copy.meters[]

      // copy.last_pay_day = parse_date(last_pay_day)
      // db_connection.put("meters", tableNum, copy)
      // dispatch({ type: "SET_LAST_PAY_DAY", copy })
      // submit_ev.target.reset()
   }
   return (
      <dialog ref={ref}>
         <form method="dialog" className="edit-cell-form" onSubmit={update_val}>
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
               <button type="button" className="text-btn not-ok-btn" onClick={() => {
                  ref.current.close()
               }}>
                  Cancelar
               </button>
            </div>
         </form>
      </dialog>

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
//    if (edited_col === "pago")
//    {
//       return (
//          <label>
//             <span>Nuevo valor:</span>
//             <select required name="pago">
//                <option value="">-- Elija un estado de pago --</option>
//                <option value="exonerado">Exonerado</option>
//                <option value="pendiente">Pendiente</option>
//                <option value="efectuado">Efectuado</option>
//                <option value="acumulado sin multa">Acumulado sin multa</option>
//                <option value="acumulado con multa">Acumulado con multa</option>
//             </select>
//          </label>
//       )
//    }
//    const input_type = create_input_type(edited_val_type)
//    return (
//       <label>
//          <span>Nuevo valor:</span>
//          <input type={input_type} className="shortened" name={edited_col} required />
//       </label>
//    )
// }

// function create_input_type(edited_val_type) {
//    switch (edited_val_type)
//    {
//       case "Date": return "date"
//       case "Number": return "number"
//       case "String": return "text"
//       default: throw new TypeError(`Unexpected value type: ${edited_val_type}`)
//    }
// }

function create_row_grid(data_cols, edited, dateFormat) {
   return data_cols.map((col, i) => {
      let val = edited.row[col.name]
      if (col.type === "Date" && val)
      {
         val = display_date(val, dateFormat)
      }
      return (
         <div key={i} className={col.name === edited.col ? "highlighted" : ""}>
            <span>{col.name}:</span>
            <span>{val}</span>
         </div>
      )
   })
}

function parse_input(val, edited_col, dateFormat) {
   switch (edited_col)
   {
      case "medidor": return val
      case "titular": return val
      case "anterior": return parseInt(val)
      case "actual": return parseInt(val)
      case "desde": return parse_date(val, dateFormat)
      case "hasta": return parse_date(val, dateFormat)
      case "recibo": return parseInt(val)
      case "pago": return val
      case "deuda": return parseFloat(val)
      case "multa": return parseFloat(val)
      case "otros": return parseFloat(val)
      case "crédito": return parseFloat(val)
      case "zona": return val
      case "caserío": return val
      default: throw new TypeError(`Unexpected column type: ${edited_col}`)
   }
}

