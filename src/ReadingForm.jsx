import { useRef } from "react"
import { InfoModal } from "./simpleModals"
import { stringify_date, parse_input } from "./core-funcs"

export default function ReadingForm({ ref, edited, meters, tableNum, db_connection, dispatch }) {
   const denialRef = useRef()

   const add_reading = (submit_ev) => {
      const input_data = Object.fromEntries(new FormData(submit_ev.target))
      input_data["actual"] = parse_input(input_data["actual"], "actual")
      input_data["hasta"] = parse_input(input_data["hasta"], "hasta")
      // const updated_val = parse_input(input_data[edited.col], edited.col)
      const copy = structuredClone(meters)
      //! ME HE QUEDADO AQUÍ
      const prev_reading = copy.table[edited_index]["anterior"]
      if (updated_val < prev_reading)
      {
         setErrorText(`Error: No se modificó la fila porque la lectura actual (${updated_val}) no puede ser menor que la anterior (${prev_reading}).`)
         validationErrorRef.current.showModal()
         return
      }
      copy.table[edited.index][edited.col] = updated_val
      db_connection.put("meters", tableNum, copy)
      dispatch({ type: "TAKE_READING", copy })
      submit_ev.target.reset()
   }
   return (
      <>
         <InfoModal
            ref={denialRef}
            text={`Error: La lectura actual ()`}
         />
         <dialog ref={ref}>
            <form method="dialog" className="new-reading" onSubmit={add_reading}>
               <h2 className="dialog-title">Tomar lectura</h2>
               <label className="control">
                  <span>Medidor:</span>
                  <span>{edited?.row.medidor}</span>
               </label>
               <label className="control">
                  <span>Titular:</span>
                  <span>{edited?.row.titular}</span>
               </label>
               <label className="control">
                  <span>Lectura:</span>
                  <input name="actual" type="number" className="shortened" required />
               </label>
               <label className="control">
                  <span>Fecha de lectura:</span>
                  <input name="hasta" type="date" defaultValue={stringify_date(new Date())} required />
               </label>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button type="reset" className="text-btn not-ok-btn" onClick={() => {
                     ref.current.close()
                  }}>
                     Cancelar
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}