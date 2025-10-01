import { display_date } from "./core-funcs.js"

export default function TBody({ meters, filtered_indexes, visible_cols, dateFormat, editCellForm, setEditable, readingForm }) {
   const TRs = filtered_indexes.map(index => {
      const row = meters.table[index]
      const TDs = visible_cols.map(col => {
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
         return <td key={col} data-index={index} data-col={col} onClick={click_ev => {

            //! to do: case for fila, and case for non-editable:
            if (!meters.editable) return
            if (val === null)
            {
               readingForm.current.showModal()
               return
            }
            else
            {
               const row_index = click_ev.target.dataset.index
               const row = meters.table[row_index]
               const col = click_ev.target.dataset.col
               setEditable({ row_index, row, col })
               editCellForm.current.showModal()
            }
         }
         }>{val}</td>
      })
      return <tr key={row.medidor}>{TDs}</tr>
   })
   return <tbody>{TRs}</tbody>
}
