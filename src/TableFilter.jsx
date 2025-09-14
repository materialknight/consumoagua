export default function TableFilter({ filter, setFilter }) {
   return (
      <label className="control">
         <span className="label-span">Filtrar:</span>
         <input
            type="text"
            value={filter}
            onChange={change => setFilter(change.target.value)}
            autoFocus
            className={filter.length > 1 ? "filter-applied" : ""}
         />
      </label>
   )
}