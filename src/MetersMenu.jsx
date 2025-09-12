import { useContext, useRef } from "react"
import { MetersContext } from "./Meters.jsx"

export default function MetersMenu({ children }) {
   // const { meters } = useContext(MetersContext)
   // const meter_options = meters.map((row, i) => <option key={i} value={row.medidor}>{row.titular}</option>)
   const dialogRef = useRef(null)
   return (
      <>
         <search className="meters-menu">
            {children}
            <button onClick={() => dialogRef.current.showModal()}>Tomar lectura</button>
         </search>
         <dialog ref={dialogRef}>
            <form method="dialog">
               <datalist id="meter-options">
                  {/* {meter_options} */}
               </datalist>
               <input
                  type="text"
                  list="meter-options"
                  pattern="\d+"
                  placeholder="Ejemplo: 010101"
                  required
                  className="validated"
                  onInvalid={e => e.target.setCustomValidity("Por favor, introduzca un número.")}
                  onInput={e => e.target.setCustomValidity("")}
               /><br />
               <button type="button" onClick={() => dialogRef.current.close()}>Cancelar</button>
               <button type="submit">Aceptar</button>
            </form>
         </dialog>
      </>
   )
}

