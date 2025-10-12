export default function Receipt({ meter_num, owner, prev, next, consumo, from, until, days_span, receipt_num, consumption_fee, debt, fine, others, credit, total, zone, village, last_pay_day, late_payment_fine, titles, logoURL, fees_grid_cells
}) {
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
                  <span className="black-c">{from}</span>
               </label>
               <label className="r-cell r-border">
                  <span>Hasta:</span>
                  <span className="black-c">{until}</span>
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
         <div>Fecha de pago: {last_pay_day}</div>
         <div>Recuerde, después de vencido pagará una multa de $ {late_payment_fine}</div>
         <div>Horario de pago: PENDIENTE </div>
      </div>
   )
}