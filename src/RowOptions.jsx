import { useRef } from "react"
import { ConfirmModal } from "./simpleModals"

export default function RowOptions({ rowOptionsRef, chosenReceipt, setChosenReceipt }) {
   const deleteRef = useRef()
   return (
      <>
         <ConfirmModal ref={deleteRef} text="¿Está seguro de que desea borrar la fila?" />
         <dialog ref={rowOptionsRef}>
            <form method="dialog">
               <h2>Opciones de fila</h2>
               <div className="accept-cancel">
                  <PrintReceiptButton {...{ chosenReceipt, setChosenReceipt }} />
                  <DeleteRowButton {...{ rowOptionsRef, deleteRef }} />
                  <button className="not-ok-btn text-btn" onClick={() => {
                     // setChosenReceipt({})
                     rowOptionsRef.current.close()
                  }}>Cancelar</button>
               </div>
            </form>
         </dialog >
      </>
   )
}

function DeleteRowButton({ rowOptionsRef, deleteRef }) {
   const delete_row = () => {

   }
   return (
      <button type="button" className="ok-btn icon-text-btn" onClick={() => {
         rowOptionsRef.current.close()
         deleteRef.current.showModal()
      }}>
         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
         </svg> Borrar fila
      </button>
   )
}

function PrintReceiptButton({ chosenReceipt, setChosenReceipt }) {
   return (
      <button className="neutral-btn icon-text-btn" onClick={() => {
         setChosenReceipt(prev => {
            const copy = { ...prev }
            copy.should_print = true
         })
      }}>
         &#128424; Imprimir recibo
      </button>
   )
}