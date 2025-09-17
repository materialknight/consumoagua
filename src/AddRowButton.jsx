import { useRef } from "react"

export default function AddRowButton({ keys, tableNum, meters, lastTableMutable }) {
   const table_loaded = meters.length > 0
   const table_last = tableNum === keys.at(-1)
   const table_editable = table_loaded && table_last && lastTableMutable

   const denialInfo = useRef()
   const newEntry = useRef()

   const add_row = () => {
      if (table_editable)
      {
         newEntry.current.showModal()
      }
      else
      {
         denialInfo.current.showModal()
      }
   }
   return (
      <>
         <button
            type="button"
            title="Agregar fila"
            className={table_editable ? "ok-btn icon-btn" : "not-ok-btn icon-btn"}
            onClick={add_row}
         >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
            </svg>
         </button>
         <dialog ref={denialInfo}>
            <form method="dialog" className="denial-info">
               <p>No se puede agregar una fila a una tabla sellada.</p>
               <button type="submit" className="text-btn ok-btn">Aceptar</button>
            </form>
         </dialog>
         <dialog ref={newEntry}>
            <form method="dialog" className="new-entry">
               <label className="control">
                  <span className="label-span">Medidor:</span>
                  <input type="text" />
               </label>
               <label className="control">
                  <span className="label-span">Titular:</span>
                  <input type="text" />
               </label>
               <label className="control">
                  <span className="label-span">Pimera lectura:</span>
                  <input type="number" min="0" />
               </label>
               <label className="control">
                  <span className="label-span">Fecha de primera lectura:</span>
                  <input type="date" />
               </label>
               <label className="control">
                  <span className="label-span">Zona:</span>
                  <input type="text" />
               </label>
               <label className="control">
                  <span className="label-span">Caserío:</span>
                  <input type="text" />
               </label>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button
                     type="button"
                     className="text-btn not-ok-btn"
                     onClick={() => newEntry.current.close()}
                  >
                     Cancelar
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}

