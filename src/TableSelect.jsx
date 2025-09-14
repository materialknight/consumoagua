export default function TableSelect({ keys, tableNum, setTableNum }) {
   const table_options = keys.toReversed().map((key, i) => <option key={i} value={key}>{key}</option>)
   return (
      <label className="control">
         <span className="label-span">Tabla</span>
         <select
            onChange={change => setTableNum(Number(change.target.value))}
            value={tableNum ?? ""}
         >
            {table_options}
         </select>
      </label>
   )
}