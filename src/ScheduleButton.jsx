export default function ScheduleButton({ meters, paymentSchedule }) {
   return (
      <div
         className={meters.editable
            ? "text-btn label-btn ok-btn"
            : "text-btn label-btn not-ok-btn"}
         onClick={() => {
            if (meters.editable)
            {
               fineRef.current.showModal()
               return
            }
            denialRef.current.showModal()
         }}>
         Horario de pago: {paymentSchedule}
      </div>
   )
}