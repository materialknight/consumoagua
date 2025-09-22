export default function TableSelect({ keys, tableNum, setTableNum }) {
   const table_options = keys.toReversed().map((key, i) => <option key={i} value={key}>{key}</option>)
   const last_table_selected = tableNum === keys.at(-1)
   return (
      <label className="control">
         <span>Tabla</span>
         <select
            value={tableNum ?? ""}
            title="Elegir tabla"
            onChange={change => setTableNum(Number(change.target.value))}
            className={last_table_selected ? "latest-selection" : "old-selection"}
         >
            {table_options}
         </select>
      </label>
   )
}