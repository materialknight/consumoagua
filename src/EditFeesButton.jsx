import { useRef, useState } from "react"

export default function EditFeesButton({ fees, setFees }) {
   const feesRef = useRef()
   return (
      <>
         <EditFeesModal {...{ feesRef, fees, setFees }} />
         <button type="button" title="Editar tarifas" className="neutral-btn icon-btn" onClick={() => {
            feesRef.current.showModal()
         }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="M200-440h240v-160H200v160Zm0-240h560v-80H200v80Zm0 560q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v252q-19-8-39.5-10.5t-40.5.5q-21 4-40.5 13.5T684-479l-39 39-205 204v116H200Zm0-80h240v-160H200v160Zm320-240h125l39-39q16-16 35.5-25.5T760-518v-82H520v160Zm0 360v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-300L643-80H520Zm300-263-37-37 37 37ZM580-140h38l121-122-37-37-122 121v38Zm141-141-19-18 37 37-18-19Z" />
            </svg>
         </button>
      </>
   )
}

function EditFeesModal({ feesRef, fees, setFees }) {
   const [feesCopy, setFeesCopy] = useState(structuredClone(fees))
   const [consumption, setConsumption] = useState("")
   const [result, setResult] = useState(null)
   const formula_valid = (formula) => {
      try
      {
         const consumo = 42;
         const result = eval(formula);

         if (typeof result !== "number" || !Number.isFinite(result))
         {
            return false
         }
         return true
      } catch
      {
         return false
      }
   }
   const apply_formula = change_ev => {
      let consumo = change_ev.target.value
      setConsumption(consumo)
      if (consumo === "")
      {
         setResult("")
         return
      }
      consumo = parseInt(consumo)
      const formula = feesCopy.find(row => consumo >= row["mínimo"] && consumo <= row["máximo"])?.["fórmula"]
      if (formula_valid(formula))
      {
         setResult(eval(formula).toFixed(2))
      }
   }
   const validate_formula = change_ev => {
      const text_input = change_ev.target
      const formula = change_ev.target.value
      const index = parseInt(change_ev.target.dataset.index)
      setFeesCopy(prev => {
         const copy = structuredClone(prev)
         copy[index]["fórmula"] = formula
         return copy
      })
      if (formula_valid(formula))
      {
         text_input.setCustomValidity("")
         return
      }
      text_input.setCustomValidity("Fórmula no válida")
   }
   const harmonize_ranges = change_ev => {
      const val = change_ev.target.value === "" ? "" : parseInt(change_ev.target.value, 10)
      const index = parseInt(change_ev.target.dataset.index, 10)
      const min = parseInt(change_ev.target.min)
      const max = parseInt(change_ev.target.max)
      setFeesCopy(prev => {
         const copy = structuredClone(prev)
         copy[index]["máximo"] = val
         const not_last_row = index !== copy.length - 1
         const val_valid = val >= min && val <= max
         if (not_last_row && val_valid)
         {
            copy[index + 1]["mínimo"] = val + 1
         }
         return copy
      })
   }
   const reset_form = reset_ev => {
      const formula_inputs = reset_ev.target.querySelectorAll("[type=text]")
      formula_inputs.forEach(text_input => {
         text_input.setCustomValidity("")
      })
      setFeesCopy(structuredClone(fees))
      feesRef.current.close()
   }
   const save_fees = () => {
      setFees(feesCopy)
   }
   const tbody_rows = feesCopy.map((row, i) => {
      const next_lower_lim = feesCopy[i + 1]?.["mínimo"]
      const next_upper_lim = feesCopy[i + 1]?.["máximo"]
      const next_upper_lim_valid = Number.isInteger(next_upper_lim) && next_upper_lim > next_lower_lim
      const max = next_upper_lim_valid ? next_upper_lim - 2 : ""
      let formula_applied = false
      if (consumption !== "")
      {
         const consumption_num = parseInt(consumption)
         formula_applied = consumption_num >= row["mínimo"] && consumption_num <= row["máximo"]
      }
      return (
         <tr key={i}>
            <td>{i + 1}</td>
            <td>
               <input
                  type="number"
                  value={row["mínimo"]}
                  className="short-num-input"
                  required
                  disabled
               />
               &nbsp;-&nbsp;
               <input
                  type="number"
                  value={row["máximo"]}
                  data-index={i}
                  onChange={harmonize_ranges}
                  className="short-num-input"
                  required
                  min={row["mínimo"] + 1}
                  max={max}
               />
            </td>
            <td className={formula_applied ? "applied-formula" : ""}>
               <input
                  type="text"
                  value={row["fórmula"]}
                  data-index={i}
                  onChange={validate_formula}
                  title="Solo se permiten números, paréntesis, espacios, la variable 'consumo' o los operadores: + - * /"
                  required
               />
            </td>
         </tr>
      )
   })
   return (
      <dialog ref={feesRef}>
         <form method="dialog" className="edit-fees-form" onSubmit={save_fees} onReset={reset_form}>
            <h2 className="dialog-title">Editar tarifas</h2>
            <div className="fees-form">
               <table className="fees-table">
                  <thead><tr><th>fila</th><th>rango</th><th>fórmula</th></tr></thead>
                  <tbody>
                     {tbody_rows}
                  </tbody>
               </table>
            </div>
            <h2 className="dialog-title">Muestra:</h2>
            <div className="sample">
               <div>
                  <span>consumo =</span>
                  &nbsp;
                  <input
                     type="number"
                     value={consumption}
                     onChange={apply_formula}
                     className="short-num-input"
                     min={0}
                     max={feesCopy.at(-1)["máximo"]}
                  />
               </div>
               <div>
                  <span>resultado:</span>
                  &nbsp;
                  <span>{result}</span>
               </div>
            </div>
            <div className="accept-cancel">
               <button type="submit" className="text-btn ok-btn">Guardar</button>
               <button type="reset" className="text-btn not-ok-btn">Cancelar</button>
            </div>
         </form>
      </dialog>
   )
}
