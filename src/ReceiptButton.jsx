import { useRef } from "react"

export default function ReceiptButton({ receiptNum, setReceiptNum }) {
   const modalRef = useRef()
   return (
      <>
         <ReceiptModal {...{ modalRef, receiptNum, setReceiptNum }} />
         <div className="text-btn neutral-btn receipt-num-btn" onClick={() => {
            modalRef.current.showModal()
         }}>
            <span>Siguiente recibo:</span>
            <span>{receiptNum ?? "Indefinido"}</span>
         </div>
      </>
   )
}

function ReceiptModal({ modalRef, receiptNum, setReceiptNum }) {
   const change_next_receipt = submit_ev => {
      const { next_receipt } = Object.fromEntries(new FormData(submit_ev.target))
      setReceiptNum(next_receipt)
      submit_ev.target.reset()
   }
   return (
      <dialog ref={modalRef}>
         <form method="dialog" onSubmit={change_next_receipt} className="receipt-num">
            <h2 className="shortened dialog-title">Cambiar número del siguiente recibo</h2>
            <label className="control">
               <span>Valor actual:</span>
               <span>{receiptNum}</span>
            </label>
            <label className="control">
               <span>Nuevo valor:</span>
               <input type="number" min="0" name="next_receipt" required />
            </label>
            <div className="accept-cancel">
               <button type="submit" className="text-btn ok-btn">Aceptar</button>
               <button type="button" className="text-btn not-ok-btn" onClick={() => {
                  modalRef.current.close()
               }}>
                  Cancelar
               </button>
            </div>
         </form>
      </dialog>
   )
}