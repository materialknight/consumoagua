import { useRef } from "react"

export default function ReceiptButton({ receiptNum, setReceiptNum }) {
   const next_receipt_modal = useRef()
   const open_modal = () => {
      next_receipt_modal.current.showModal()
   }
   const close_modal = () => {
      next_receipt_modal.current.close()
   }
   const change_next_receipt = submit_ev => {
      const { next_receipt } = Object.fromEntries(new FormData(submit_ev.target))
      setReceiptNum(next_receipt)
      submit_ev.target.reset()
   }
   return (
      <>
         <button type="button" title="Cambiar número del siguiente recibo" className="neutral-btn icon-btn" onClick={open_modal}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="m240-160 40-160H120l20-80h160l40-160H180l20-80h160l40-160h80l-40 160h160l40-160h80l-40 160h160l-20 80H660l-40 160h160l-20 80H600l-40 160h-80l40-160H360l-40 160h-80Zm140-240h160l40-160H420l-40 160Z" />
            </svg>
         </button>
         <dialog ref={next_receipt_modal}>
            <form method="dialog" onSubmit={change_next_receipt} className="receipt-num">
               <h2 className="shortened dialog-title">Cambiar número del siguiente recibo</h2>
               <label className="control">
                  <span>Valor actual:</span>
                  {receiptNum
                     ? <input type="number" disabled value={receiptNum} className="shortened" />
                     : <input type="text" disabled value="Indefinido" className="shortened" />}
               </label>
               <label className="control">
                  <span>Nuevo valor:</span>
                  <input type="number" min="0" name="next_receipt" required />
               </label>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button type="button" className="text-btn not-ok-btn" onClick={close_modal}>
                     Cancelar
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}