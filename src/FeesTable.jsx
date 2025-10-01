export default function FeesTable({ fees }) {
   const tbody_rows = fees.map((row, i) => {
      return (
         <tr key={i}>
            <td>{i + 1}</td><td>{row["mínimo"]} - {row["máximo"]}</td><td>{row["fórmula"]}</td>
         </tr>
      )
   })
   return (
      <table className="fees-table latest-table">
         <thead><tr><th>fila</th><th>rango</th><th>fórmula</th></tr></thead>
         <tbody>
            {tbody_rows}
         </tbody>
      </table>
   )
}