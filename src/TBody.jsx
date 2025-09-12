import { useContext } from "react"
import { MetersContext } from "./Meters.jsx"
import { date_str } from "./core-funcs.js"

export default function TBody() {
   const { filtered_meters, filtered_cols } = useContext(MetersContext)
   const TRs = filtered_meters.map((entry, i) => {
      const TDs = filtered_cols.map(col => {
         let val = null
         if (col === "fila")
         {
            val = i + 1
         }
         else if (col === "desde" || col === "hasta")
         {
            val = date_str(entry[col])
         }
         else
         {
            val = entry[col]
         }
         return <td key={col} data-col={col}>{val}</td>
      })
      return <tr data-row={i + 1} key={entry.medidor}>{TDs}</tr>
   })
   return <tbody>{TRs}</tbody>
}