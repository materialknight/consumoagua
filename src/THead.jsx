export default function THead({ filtered_cols }) {
   const THs = filtered_cols.map(col => <th key={col} data-col={col}>{col}</th>)
   return (
      <thead>
         <tr data-row="0">{THs}</tr>
      </thead>
   )
}