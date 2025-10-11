export default function TableInfo({ meters, filtered_indexes, fees, children }) {
   const expected_income = meters.table.reduce((total, row) => {
      const consumo = row["actual"] !== null && row["anterior"] !== null
         ? row["actual"] - row["anterior"]
         : null
      const formula = consumo
         ? fees.find(row => consumo >= row["mínimo"] && consumo <= row["máximo"])?.["fórmula"]
         : null
      const consumption_fee = formula
         ? eval(formula)
         : 0
      return total + consumption_fee + row["deuda"] + row["multa"] + row["otros"] - row["crédito"]
   }, 0)
   return (
      <div className="table-info">
         <span>Filas visibles: {filtered_indexes.length} / {meters.table.length}</span>
         <span>Ingreso esperado: {expected_income.toFixed(2)}</span>
         {children}
      </div>
   )
}