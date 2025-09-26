export default function THead({ visible_cols, setSorting }) {
   const change_sorting = click_ev => {
      setSorting(prev => {
         const col = click_ev.target.dataset.col
         const asc = !prev.asc
         return { col, asc }
      })
   }
   const THs = visible_cols.map(col => <th key={col} data-col={col} onClick={change_sorting}>{col}</th>)
   return (
      <thead>
         <tr data-row="0">{THs}</tr>
      </thead>
   )
}