import { display_date } from "./core-funcs"

export default function ReceiptPair({ meter_num, owner, prev, next, from, until, receipt_num, debt, fine, others, credit, zone, village, titles, fees_grid_cells, dateFormat, fees, logoURL }) {

   const days_span = from && until ? ((until - from) / (1000 * 60 * 60 * 24)) + 1 : null
   const display_from = from ? display_date(from, dateFormat) : null
   const display_until = until ? display_date(until, dateFormat) : null
   const consumo = next !== null && prev !== null ? next - prev : null
   const formula = consumo
      ? fees.find(row => consumo >= row["mínimo"] && consumo <= row["máximo"])?.["fórmula"]
      : null
   const consumption_fee = formula ? eval(formula) : 0
   const total = consumption_fee + debt + fine + others - credit
   const receipt_args = { titles, receipt_num, meter_num, zone, owner, village, prev, next, consumo, display_from, display_until, days_span, consumption_fee, debt, fine, others, credit, total, fees_grid_cells, logoURL }
   return (
      <div className="couple">
         <Receipt {...receipt_args} />
         <Receipt {...receipt_args} />
      </div>
   )
}

function Receipt({ titles, receipt_num, meter_num, zone, owner, village, prev, next, consumo, display_from, display_until, days_span, consumption_fee, debt, fine, others, credit, total, fees_grid_cells, logoURL }) {
   return (
      <div className="receipt">
         <div className="section-1">
            <h2>{titles.primary}</h2>
            <img src={logoURL} alt="logo" />
            {titles.secondary ? <h3>{titles.secondary}</h3> : null}
         </div>
         <div className="section-2">
            <div className="reading">
               <label className="r-cell r-border">
                  <span>Recibo:</span>
                  <span className="black-c">{receipt_num}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Medidor:</span>
                  <span className="black-c">{meter_num}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Zona:</span>
                  <span className="black-c">{zone}</span>
               </label>
               <label className="r-cell r-border long-cell">
                  <span>Titular:</span>
                  &nbsp;
                  <span className="black-c">{owner}</span>
               </label>
               <label className="r-cell r-border long-cell">
                  <span>Caserío:</span>
                  &nbsp;
                  <span className="black-c">{village}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Lectura anterior:</span>
                  <span className="black-c">{prev}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Lectura actual:</span>
                  <span className="black-c">{next}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Consumo M<sup>3</sup>:</span>
                  <span className="black-c">{consumo}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Desde:</span>
                  <span className="black-c">{display_from}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Hasta:</span>
                  <span className="black-c">{display_until}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Cubre:</span>
                  <span className="black-c">{days_span} días</span>
               </label>
            </div>
            <div className="fees-grid">
               <div className="fees-grid-title r-cell r-border">Cobro</div>
               <div className="r-cell r-border">Cargo por consumo</div>
               <div className="r-cell r-border black-c">{consumption_fee.toFixed(2)}</div>
               <div className="r-cell r-border">Deuda pendiente</div>
               <div className="r-cell r-border black-c">{debt.toFixed(2)}</div>
               <div className="r-cell r-border">Multa</div>
               <div className="r-cell r-border black-c">{fine.toFixed(2)}</div>
               <div className="r-cell r-border">Otros</div>
               <div className="r-cell r-border black-c">{others.toFixed(2)}</div>
               <div className="r-cell r-border">Subsidios o compensaciones</div>
               <div className="r-cell r-border black-c">- {credit.toFixed(2)}</div>
               <div className="r-cell r-border thick">Total a pagar</div>
               <div className="r-cell r-border thick black-c">{total.toFixed(2)}</div>
            </div>
            <div className="fees-grid">
               <div className="fees-grid-title r-cell r-border">Tarifas de cargo por consumo</div>
               <div className="r-cell r-border">Rango</div><div className="r-cell r-border">Fórmula</div>
               {fees_grid_cells}
            </div>
         </div>
         <p>Fecha de pago: { }</p>
         <p>Recuerde, después de vencido pagará $ { } de multa</p>
         <p>Horario de pago: PENDIENTE </p>
      </div>
   )
}