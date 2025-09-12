import { useContext } from "react"
import { MetersContext } from "./Meters.jsx"

export default function TableSelect() {
   const { keys, tableNum, setTableNum } = useContext(MetersContext)
   const table_options = keys.toReversed().map((key, i) => <option key={i} value={key}>{key}</option>)
   return (
      <label className="control">
         Tabla
         <select
            onChange={change => setTableNum(Number(change.target.value))}
            value={tableNum ?? ""}
         >
            {table_options}
         </select>
      </label>
   )
}