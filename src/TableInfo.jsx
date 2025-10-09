export default function TableInfo({ meters, filtered_indexes, fees, children }) {
   const expected_income = meters.table.reduce((total, row) => {
      // case "deuda": return row[col].toFixed(2)
      // case "multa": return row[col].toFixed(2)
      // case "otros": return row[col].toFixed(2)
      // case "crédito": return row[col].toFixed()
      const consumo = (row["actual"] ?? 0) - row["anterior"]
      const formula = fees.find(row => consumo >= row["mínimo"] && consumo <= row["máximo"])?.["fórmula"]
      // row[]
   }, 0)
   return (
      <div className="table-info">
         <span>Filas visibles: {filtered_indexes.length} / {meters.table.length}</span>
         {/* <span>Ingreso esperado: {expected_income}</span> */}
         {children}
      </div>
   )
}