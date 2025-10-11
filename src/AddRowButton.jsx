import { useRef, useState, useEffect } from "react"
import { InfoModal } from "./simpleModals"
import { parse_date } from "./core-funcs"

export default function AddRowButton({ db_connection, meters, data_cols, tableNum, dispatch }) {
   const denialRef = useRef()
   const newEntryRef = useRef()
   const repetitionRef = useRef()
   const [repeatedMeter, setRepeatedMeter] = useState(null)
   const [zones, setZones] = useState(new Set())
   const [villages, setVillages] = useState(new Set())
   useEffect(() => {
      const unique_zones = new Set(meters.table.map(row => row.zona))
      const unique_villages = new Set(meters.table.map(row => row["caserío"]))
      setZones(unique_zones)
      setVillages(unique_villages)
   }, [meters])
   const attempt_new_entry = () => {
      if (meters.editable)
      {
         newEntryRef.current.showModal()
         return
      }
      denialRef.current.showModal()
   }
   const add_row = (submit_ev) => {
      const row_data = Object.fromEntries(new FormData(submit_ev.target))
      const copy = structuredClone(meters)
      const new_row = create_row(row_data)
      const meter_repeated = copy.table.some(row => row.medidor === new_row.medidor)
      if (meter_repeated)
      {
         setRepeatedMeter(new_row.medidor)
         repetitionRef.current.showModal()
         return
      }
      copy.table.push(new_row)
      db_connection.put("meters", tableNum, copy)
      dispatch({ type: "ADD_ROW", copy })
      submit_ev.target.reset()
   }
   return (
      <>
         <InfoModal
            ref={denialRef}
            text={"No se puede agregar una fila a una tabla sellada."}
         />
         <InfoModal
            ref={repetitionRef}
            text={`Error: No se agregó la fila porque cada fila debe tener un número de medidor diferente, y el medidor ${repeatedMeter} ya existe.`}
         />
         <button
            type="button"
            title="Agregar fila"
            className={meters.editable ? "ok-btn icon-btn" : "not-ok-btn icon-btn"}
            onClick={attempt_new_entry}
         >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
            </svg>
         </button>
         <dialog ref={newEntryRef}>
            <form method="dialog" className="new-entry" onSubmit={add_row}>
               <h2 className="dialog-title">Agregar fila</h2>
               <label className="control">
                  <span>Medidor:</span>
                  <input type="text" name="medidor" required />
               </label>
               <label className="control">
                  <span>Titular:</span>
                  <input type="text" name="titular" required />
               </label>
               <label className="control">
                  <span>Pimera lectura:</span>
                  <input type="number" min="0" name="anterior" required />
               </label>
               <label className="control">
                  <span>Fecha de primera lectura:</span>
                  <input type="date" name="desde" required />
               </label>
               <label className="control">
                  <span>Zona:</span>
                  <input type="text" name="zona" list="zones" required />
               </label>
               <datalist id="zones">
                  {Array.from(zones).map((zone, i) => <option key={i} value={zone}></option>)}
               </datalist>
               <label className="control">
                  <span>Caserío:</span>
                  <input type="text" name="caserío" list="villages" required />
               </label>
               <datalist id="villages">
                  {Array.from(villages).map((village, i) => <option key={i} value={village}></option>)}
               </datalist>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button type="button" className="text-btn not-ok-btn" onClick={() => {
                     newEntryRef.current.close()
                  }}>
                     Cancelar
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}

function create_row(form_data) {
   return {
      "medidor": form_data["medidor"].trim(),
      "titular": form_data["titular"].trim(),
      "anterior": parseInt(form_data["anterior"]),
      "actual": null,
      "desde": parse_date(form_data["desde"]),
      "hasta": null,
      "recibo": null,
      "pago": null,
      "deuda": 0,
      "multa": 0,
      "otros": 0,
      "crédito": 0,
      "zona": form_data["zona"].trim(),
      "caserío": form_data["caserío"].trim()
   }
}