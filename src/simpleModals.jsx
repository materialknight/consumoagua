export function InfoModal({ ref, text }) {
   return (
      <dialog ref={ref}>
         <form method="dialog" className="info-modal">
            <p>{text}</p>
            <button type="submit" className="text-btn ok-btn">Aceptar</button>
         </form>
      </dialog>
   )
}

export function ConfirmModal({ ref, text, submit_handler }) {
   return (
      <dialog ref={ref}>
         <form method="dialog" onSubmit={submit_handler}>
            <p>{text}</p>
            <div className="accept-cancel">
               <button type="submit" className="text-btn ok-btn">Sí</button>
               <button type="button" className="text-btn not-ok-btn" onClick={() => {
                  ref.current.close()
               }}>
                  No
               </button>
            </div>
         </form>
      </dialog>
   )
}
