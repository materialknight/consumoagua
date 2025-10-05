export default function MetersTable({ meters, filtered_indexes, filter, receiptNum, children }) {
   const table_classes = ["meters-table"]
   table_classes.push(meters.editable ? "latest-table" : "old-table")
   if (filter.length > 0) table_classes.push("filter-applied")
   return (
      <table className={table_classes.join(" ")}>
         {children}
      </table>
   )
}

//? La tabla más reciente solo puede cerrarse si hay fecha de pago, y solo hasta después de esa fecha.
//? Guardar en state: multa, fecha de pago, número del siguiente recibo.
//? "exonerado", "pendiente", "efectuado", "acumulado sin multa", "acumulado con multa"

// The app must save the penalty fee, which the user will be prompted to provide when attempting to print with no saved penalty fee, but with the posibility to change it at any time.

// The app must save the payment date, which the user must be prompted to provide, either when attempting to print with no saved payment date, or when attempting to print after the last saved payment date has passed.

// The payment date will be printed on the receipts, and when the app is opened on a day after that date, the user will be prompted to confirm that he wants all "-", "accumulated" and "penalty" to become "unpaid".

// The user is prompted to accept the above change instead of it being automatic, so that the user can decline it in case he provided a wrong earlier date by mistake.

// The user will also receive the just-mentioned prompt when he tries to make a new table. The user has the option to create a new table before the arrival of the payment date in case his computer clock is malfunctioning (stuck in a past date).

// When all payments are "exonerated", "deferred", "paid" or "unpaid", the table will be frozen forever, and the user can generate a new table for the next period. In the new table:

// - Every "exonerated" remains the same.
// - Every "deferred" becomes "accumulated (1)" (where "(1)" is the number of previous unpaid periods that will be charged in the next receipt in addition to the current period).
// - Every "paid" becomes "-".
// - Every "unpaid" becomes "penalty (1)" (where "(1)" is the number of previous unpaid periods that will be charged in the next receipt with a penalty, in addition to the current period).