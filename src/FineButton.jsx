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
            text={"La tabla está sellada. La multa por pago atrasado ya no puede cambiarse."} />
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
            Multa por pago tardío: {meters.fine}
         </span>
      </>
   )
}

function FineModal({ fineRef, db_connection, meters, tableNum, dispatch }) {
   const set_fine = () => {

   }
   return (
      <dialog ref={fineRef}>
         <form method="dialog" onSubmit={set_fine} className="receipt-num">
            <h2 className="shortened dialog-title">Cambiar multa</h2>
            <p>Todos los usuarios cuyo pago esté "Acumulado con multa" cuando esta tabla se selle, recibirán esta multa en la siguiente tabla.</p>
            <label className="control">
               <span>Valor actual:</span>
               <span>{meters.fine}
               </span>
            </label>
            <label className="control">
               <span>Nuevo valor:</span>
               <input type="date" name="fine" required />
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