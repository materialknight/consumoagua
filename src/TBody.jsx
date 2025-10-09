import { display_val } from "./core-funcs.js"

export default function TBody({ meters, filtered_indexes, visible_cols, dateFormat, editCellForm, setEdited, readingForm, rowOptionsRef }) {
   const TRs = filtered_indexes.map(index => {
      const row = meters.table[index]
      const TDs = visible_cols.map(col => {
         const val = display_val(index, row, col, dateFormat)
         return <td key={col} data-index={index} data-col={col} onClick={() => {
            if (!meters.editable && col !== "fila") return // Should I show a denial modal? Possibly not.
            setEdited({ index, row, col })
            if (col === "fila")
            {
               rowOptionsRef.current.showModal()
               return
            }
            if (val === null)
            {
               readingForm.current.showModal()
               return
            }
            // const row_index = click_ev.target.dataset.index
            // const row = meters.table[index]
            // const col = click_ev.target.dataset.col
            // setEdited({ index, row, col })
            editCellForm.current.showModal()
         }
         }>{val}</td>
      })
      return <tr key={row.medidor}>{TDs}</tr>
   })
   return <tbody>{TRs}</tbody>
}
