import { useRef } from "react";
import { InfoModal } from "./simpleModals";

export default function FineButton({ db_connection, meters, tableNum, dispatch }) {
   const fineRef = useRef()
   const denialRef = useRef()

   return (
      <>
         <FineModal {...{ fineRef, db_connection, meters, tableNum, dispatch }} />
         <InfoModal
            ref={denialRef}
            text={"La tabla ya está sellada. La multa por pago atrasado no puede cambiarse."} />
         <span
            className={meters.editable
               ? "text-btn label-btn ok-btn"
               : "text-btn label-btn not-ok-btn"}
            onClick={() => {
               if (meters.editable)
               {
                  fineRef.current.showModal()
                  return
               }
               denialRef.current.showModal()
            }}>
            Multa por pago tardío: {meters.fine.toFixed(2)}
         </span>
      </>
   )
}

function FineModal({ fineRef, db_connection, meters, tableNum, dispatch }) {
   const set_fine = submit_ev => {
      const input_data = Object.fromEntries(new FormData(submit_ev.target))
      const fine = parseFloat(input_data["fine"])
      const copy = structuredClone(meters)
      copy.fine = fine
      db_connection.put("meters", tableNum, copy)
      dispatch({ type: "SET_FINE", copy })
      submit_ev.target.reset()
   }
   return (
      <dialog ref={fineRef}>
         <form method="dialog" onSubmit={set_fine} className="edit-cell-form">
            <h2 className="shortened dialog-title">Cambiar multa</h2>
            <p className="modal-p">Todos los usuarios cuyo pago esté "Acumulado con multa" cuando esta tabla se selle, recibirán esta multa en la siguiente tabla.</p>
            <label className="control">
               <span>Valor actual:</span>
               <span>{meters.fine.toFixed(2)}
               </span>
            </label>
            <label className="control">
               <span>Nuevo valor:</span>
               <input type="number" name="fine" min="0" step="0.01" required />
            </label>
            <div className="accept-cancel">
               <button type="submit" className="text-btn ok-btn">Aceptar</button>
               <button type="button" className="text-btn not-ok-btn" onClick={() => {
                  fineRef.current.close()
               }}>
                  Cancelar
               </button>
            </div>
         </form>
      </dialog>
   )
}