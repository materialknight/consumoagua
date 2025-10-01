export default function FeesForm({ ref, fees }) {
   const close_modal = click_ev => {
      click_ev.target.
   }
   return (
      <dialog ref={ref}>
         <form method="dialog">

            <div className="accept-cancel">
               <button type="submit" className="text-btn ok-btn">Aceptar</button>
               <button type="button" className="text-btn not-ok-btn" onClick={() => ref.current.close()}>
                  Cancelar
               </button>
            </div>
         </form>
      </dialog>
   )
}