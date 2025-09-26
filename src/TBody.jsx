import { display_date } from "./core-funcs.js"

export default function TBody({ meters, filtered_indexes, visible_cols, dateFormat, editCellForm, setEditable, readingForm }) {
   const open_right_modal = click_ev => {

   }
   const open_editor = click_ev => {
      const row = meters.table[click_ev.target.dataset.index]
      const col = click_ev.target.dataset.col
      setEditable({ row, col })
      editCellForm.current.showModal()
   }
   const open_reading = () => {
      readingForm.current.showModal()
   }
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
         // to do: case for fila:
         return <td key={col} data-index={index} data-col={col} onClick={val === null ? open_reading : open_editor}>{val}</td>
      })
      return <tr key={row.medidor}>{TDs}</tr>
   })
   return <tbody>{TRs}</tbody>
}
