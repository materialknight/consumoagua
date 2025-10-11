export default function PrintButton() {
   return (
      <button className="neutral-btn icon-btn" title="Imprimir recibos de filas visibles" onClick={() => {
         print()
      }}>
         &#128424;
      </button>
   )
}