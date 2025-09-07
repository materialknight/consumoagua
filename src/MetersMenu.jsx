import { useRef } from "react"

export default function MetersMenu({ keys, tableNum, setTableNum, filter, setFilter }) {
   const options = keys?.toReversed()
      .map((key, i) => <option key={i} value={key}>{key}</option>)

   const dialogRef = useRef(null)
   return (
      <>
         <search className="meters-menu">
            <label className="control">
               Tabla
               <select
                  onChange={change => setTableNum(Number(change.target.value))}
                  value={tableNum ?? ""}
               >
                  {options}
               </select>
            </label>
            <label className="control">
               Filtrar:
               <input type="text" value={filter} onChange={change => setFilter(change.target.value)} />
            </label>

            <div className="switches">
               <label>Lecturas
                  <input type="checkbox" hidden name="tab" defaultChecked={true} onChange={() => setTab("meters")} />
               </label>
               <label>Tarifas
                  <input type="checkbox" hidden name="tab" onChange={() => setTab("fees")} />
               </label>
            </div>
            <button onClick={() => dialogRef.current.showModal()}>Tomar lectura</button>
         </search>
         <dialog ref={dialogRef}>
            <form method="dialog">
               <input
                  type="text"
                  pattern="\d+"
                  required
               // onInvalid={e => e.target.setCustomValidity("Por favor, introduce un número.")}
               // onInput={e => e.target.setCustomValidity("")}

               /><br />
               <button type="button" onClick={() => dialogRef.current.close()}>Cancelar</button>
               <button type="submit">Aceptar</button>
            </form>
         </dialog>
      </>
   )

}

