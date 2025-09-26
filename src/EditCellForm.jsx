import { display_date } from "./core-funcs"

export default function EditCellForm({ ref, editable, data_cols, dateFormat }) {
   let row_info = null
   let editable_col = null
   let current_val = null
   if (editable)
   {
      const editable_val = editable.row[editable.col]
      const editable_val_type = data_cols.find(col => col.name === editable.col)?.type
      row_info = data_cols.map((col, i) => {
         let val = editable.row[col.name]
         if (col.type === "Date" && val)
         {
            val = display_date(val, dateFormat)
         }
         if (col.name === editable.col)
         {
            return (
               <div key={i} className="highlighted">
                  <span>{col.name}:</span>
                  <span>{val}</span>
               </div>
            )
         }
         return (
            <div key={i}>
               <span>{col.name}:</span>
               <span>{val}</span>
            </div>
         )
      })
      editable_col = editable.col
      current_val = editable_val_type === "Date" ? display_date(editable_val, dateFormat) : editable_val
   }
   return (
      <dialog ref={ref}>
         <form method="dialog" className="edit-cell-form">
            <h2 className="dialog-title">Información de fila</h2>
            <div className="row-info">
               {row_info}
            </div>
            <h2 className="dialog-title" > Editar "{editable_col}":</h2>
            <div className="edit-grid">
               <div>
                  <span>Valor actual:</span>
                  <span>{current_val}</span>
               </div>
               <div>
                  <span>Nuevo valor:</span>
                  <input />
               </div>
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
