export default function TableInfo({ meters, filtered_indexes, children }) {
   return (
      <div className="table-info">
         <span>Filas visibles: {filtered_indexes.length} / {meters.table.length}</span>
         {children}
      </div>
   )
}