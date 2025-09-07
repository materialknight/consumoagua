export default function MetersTable({ meters, is_latest_table, filter }) {
   const cols = ["medidor", "titular", "anterior", "desde", "actual", "hasta", "recibo", "pago", "zona", "caserío"]
   const THs = cols.map(col => <th key={col} data-col={col}>{col}</th>)
   const date_str = (date) => {
      return date.toLocaleDateString("es", {
         weekday: "short",
         day: "numeric",
         year: "2-digit",
         month: "short",
         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
   }
   const match_filter = (val) => {
      const remove_diacritics = (char) => {
         switch (char)
         {
            case "á": return "a"
            case "é": return "e"
            case "í": return "i"
            case "ó": return "o"
            case "ú": return "u"
            case "ñ": return "n"
         }
      }
      let str_val = null
      switch (val.constructor.name)
      {
         case "String":
            str_val = val
            break
         case "Number":
            str_val = val.toString()
            break
         case "Date":
            str_val = date_str(val)
            break
         default:
            throw new TypeError(`Unexpected type: ${val.constructor.name}, value: ${val}`)

      }
      str_val = str_val.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritics)
      const normalized_filter = filter.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritics)
      return str_val.includes(normalized_filter)
   }

   const filtered_meters = filter.length < 2
      ? meters
      : meters.filter(meter => Object.values(meter).some(match_filter))

   const TRs = filtered_meters?.map((entry, i) => {
      const TDs = cols.map(col => {
         let val = null
         if (col === "desde" || col === "hasta")
         {
            val = date_str(entry[col])
         }
         else
         {
            val = entry[col]
         }
         return <td key={col} data-col={col}>{val}</td>
      })
      return (
         <tr data-row={i + 1} key={entry.medidor}>
            <td data-col="fila">{i + 1}</td>
            {TDs}
         </tr>
      )
   })

   return (
      <table className={is_latest_table ? "meters-table latest-table" : "meters-table old-table"}>
         <caption>Filas: {filtered_meters?.length}</caption>
         <thead><tr data-row="0"><th data-col="fila">fila</th>{THs}</tr></thead>
         <tbody>{TRs}</tbody>
      </table>
   )
}

// const cols = [
//    ["A", "medidor"],
//    ["B", "titular"],
//    ["C", "anterior"],
//    ["D", "desde"],
//    ["E", "actual"],
//    ["F", "hasta"],
//    ["G", "recibo"],
//    ["H", "pago"],
//    ["I", "zona"],
//    ["J", "caserío"]
// ]

// The app must save the penalty fee, which the user will be prompted to provide when attempting to print with no saved penalty fee, but with the posibility to change it at any time.

// The app must save the payment date, which the user must be prompted to provide, either when attempting to print with no saved payment date, or when attempting to print after the last saved payment date has passed.

// The payment date will be printed on the receipts, and when the app is opened on a day after that date, the user will be prompted to confirm that he wants all "-", "accumulated" and "penalty" to become "unpaid".

// The user is prompted to accept the above change instead of it being automatic, so that the user can decline it in case he provided a wrong earlier date by mistake.

// The user will also receive the just-mentioned prompt when he tries to make a new table. The user has the option to create a new table before the arrival of the payment date in case his computer clock is malfunctioning (stuck in a past date).

// When all payments are "exonerated", "deferred", "paid" or "unpaid", the table will be frozen forever, and the user can generate a new table for the next period. In the new table:

// - Every "exonerated" remains the same.
// - Every "deferred" becomes "accumulated (1)" (where "(1)" is the number of previous unpaid periods that will be charged in the next receipt in addition to the current period).
// - Every "paid" becomes "-".
// - Every "unpaid" becomes "penalty (1)" (where "(1)" is the number of previous unpaid periods that will be charged in the next receipt with a penalty, in addition to the current period).

// ! No table version:

// const header_cells = cols.map(col => {
//    const [letter, col_name] = col
//    return <div key={letter} data-col={letter}>{col_name}</div>
// })
// const rows = meters?.map((entry, i) => {
//    const cells = cols.map(col => {
//       const [letter, col_name] = col
//       return <div key={letter} data-col={letter}>{entry[col_name]}</div>
//    })
//    return (
//       <div data-row={i + 1} key={entry.medidor}>
//          <div data-col="fila">{i + 1}</div>
//          {cells}
//       </div>
//    )
// })
// return (
//    <div className="meters-table">
//       <div className="table-header" data-row="0">
//          <div data-col="fila">fila</div>
//          {header_cells}
//       </div>
//       {rows}
//    </div>
// )