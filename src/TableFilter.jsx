import { useContext } from "react"
import { MetersContext } from "./Meters.jsx"

export default function TableFilter() {
   const { filter, setFilter } = useContext(MetersContext)
   return (
      <label className="control">
         Filtrar:
         <input type="text" value={filter} onChange={change => setFilter(change.target.value)} autoFocus />
      </label>
   )
}