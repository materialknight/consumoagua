import { useRef } from "react"
import { InfoModal } from "./simpleModals"
import { parse_date, display_date } from "./core-funcs"

export default function LastPayDayButton({ db_connection, meters, tableNum, dateFormat, dispatch }) {
   const payDayRef = useRef()
   const denialRef = useRef()
   return (
      <>
         <LastPayDayModal {...{ payDayRef, db_connection, meters, tableNum, dateFormat, dispatch }} />
         <InfoModal
            ref={denialRef}
            text={"La tabla ya está sellada. La última fecha de pago ya no puede cambiarse."} />
         <span
            className={meters.editable
               ? "text-btn label-btn ok-btn"
               : "text-btn label-btn not-ok-btn"}
            onClick={() => {
               if (meters.editable)
               {
                  payDayRef.current.showModal()
                  return
               }
               denialRef.current.showModal()
            }}>
            Último día de pago: {meters.last_pay_day
               ? display_date(meters.last_pay_day, dateFormat)
               : "Indefinido"}
         </span>
      </>
   )
}

function LastPayDayModal({ payDayRef, db_connection, meters, tableNum, dateFormat, dispatch }) {
   const set_last_pay_day = submit_ev => {
      const { last_pay_day } = Object.fromEntries(new FormData(submit_ev.target))
      const copy = structuredClone(meters)
      copy.last_pay_day = parse_date(last_pay_day)
      db_connection.put("meters", tableNum, copy)
      dispatch({ type: "SET_LAST_PAY_DAY", copy })
      submit_ev.target.reset()
   }
   return (
      <dialog ref={payDayRef}>
         <form method="dialog" onSubmit={set_last_pay_day} className="receipt-num">
            <h2 className="shortened dialog-title">Cambiar último día de pago</h2>
            <label className="control">
               <span>Valor actual:</span>
               <span>{meters.last_pay_day
                  ? display_date(meters.last_pay_day, dateFormat)
                  : "Indefinido"}
               </span>
            </label>
            <label className="control">
               <span>Nuevo valor:</span>
               <input type="date" name="last_pay_day" required />
            </label>
            <div className="accept-cancel">
               <button type="submit" className="text-btn ok-btn">Aceptar</button>
               <button type="button" className="text-btn not-ok-btn" onClick={() => {
                  payDayRef.current.close()
               }}>
                  Cancelar
               </button>
            </div>
         </form>
      </dialog>
   )
}