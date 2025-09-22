export default function TableFilter({ filter, setFilter }) {
   return (
      <label className="control">
         <span>Filtrar:</span>
         <input
            type="search"
            value={filter}
            onChange={change => setFilter(change.target.value)}
            autoFocus
            className={filter.length > 0 ? "filter-applied" : ""}
         />
      </label>
   )
}