import { parse_date, display_date } from "./core-funcs.js"

export default function TBody({ meters, filtered_indexes, filtered_cols, dateFormat }) {
   const TRs = filtered_indexes.map((index, i) => {
      const row = meters.table[index]
      const TDs = filtered_cols.map(col => {
         let val = null
         if (col === "fila")
         {
            val = parseInt(index) + 1
         }
         else if (col === "desde" || col === "hasta")
         {
            val = row[col] ? display_date(row[col], dateFormat) : null
         }
         else
         {
            val = row[col]
         }
         return <td key={col} data-index={i} data-col={col}>{val}</td>
      })
      return <tr key={row.medidor}>{TDs}</tr>
   })
   return <tbody>{TRs}</tbody>
}