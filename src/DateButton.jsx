import { useRef, useState } from "react"
import { display_date } from "./core-funcs"

export default function DateButton({ dateFormat, setDateFormat }) {
   const sample_date = new Date(1756792800000)
   const change_date_format = submit_ev => {
      const date_format = Object.fromEntries(new FormData(submit_ev.target))
      if (date_format.weekday === "")
      {
         delete date_format.weekday
      }
      setDateFormat(date_format)
   }
   const [sampleFormat, setSampleFormat] = useState({ ...dateFormat })
   const change_sample_date = change_ev => {
      setSampleFormat(prev => {
         const next = { ...prev }
         const key = change_ev.target.name
         const val = change_ev.target.value ? change_ev.target.value : undefined
         next[key] = val
         return next
      })
   }
   const date_form = useRef()
   return (
      <>
         <button
            type="button"
            title="Formato de fechas"
            className="neutral-btn icon-btn"
            onClick={() => {
               date_form.current.showModal()
            }}
         >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
            </svg>
         </button>
         <dialog ref={date_form}>
            <form method="dialog" className="date-form" onSubmit={change_date_format}>
               <h2 className="dialog-title">Formato de fechas</h2>
               <h3 className="dialog-title">Muestra:</h3>
               <div>{display_date(sample_date, sampleFormat)}</div>
               <label className="control">
                  <span>Nombre del día:</span>
                  <select name="weekday" onChange={change_sample_date} value={sampleFormat.weekday}>
                     <option value="">No mostrar</option>
                     <option value="short">Abreviado</option>
                     <option value="long">Completo</option>
                  </select>
               </label>
               <label className="control">
                  <span>Número del día:</span>
                  <select name="day" onChange={change_sample_date} value={sampleFormat.day}>
                     <option value="numeric">Sin 0 a la izquierda si es &lt; 10</option>
                     <option value="2-digit">Con 0 a la izquierda si es &lt; 10</option>
                  </select>
               </label>
               <label className="control">
                  <span>Mes:</span>
                  <select name="month" onChange={change_sample_date} value={sampleFormat.month}>
                     <option value="numeric">Sin 0 a la izquierda si es &lt; 10</option>
                     <option value="2-digit">Con 0 a la izquierda si es &lt; 10</option>
                     <option value="short">Abreviado</option>
                     <option value="long">Completo</option>
                  </select>
               </label>
               <label className="control">
                  <span>Año:</span>
                  <select name="year" onChange={change_sample_date} value={sampleFormat.year}>
                     <option value="2-digit">Abreviado</option>
                     <option value="numeric">Completo</option>
                  </select>
               </label>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button type="button" className="text-btn not-ok-btn" onClick={() => {
                     date_form.current.close()
                  }}>
                     Cancelar
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}