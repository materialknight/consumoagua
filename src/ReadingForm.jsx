import { stringify_date } from "./core-funcs"

export default function ReadingForm({ ref }) {

   return (
      <dialog ref={ref}>
         <form method="dialog" className="new-reading">
            <h2 className="dialog-title">Tomar lectura</h2>
            <label className="control">
               <span>medidor:</span>
               <span>{null}</span>
            </label>
            <label className="control">
               <span>titular:</span>
               <span>{null}</span>
            </label>
            <label className="control">
               <span>Lectura:</span>
               <input type="number" className="shortened" required />
            </label>
            <label className="control">
               <span>Fecha de lectura:</span>
               <input type="date" defaultValue={stringify_date(new Date())} required />
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
   )
}