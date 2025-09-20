export default function reducer(meters, action) {
   const types = {
      // "fila",
      medidor: "String", // added from the start.
      titular: "String", // added from the start.
      anterior: "Number", // added from the start.
      desde: "Date", // added from the start.
      actual: "Number", // added later, can be null.
      hasta: "Date", // added later, can be null.
      recibo: "Number", // added later, can be null.
      pago: "String", // added from the start
      deuda: "Number", // added from the start
      multa: "Number", // added from the start
      zona: "String", // added from the start
      caserío: "String" // added from the start
   }
   switch (action.type)
   {
      case "LOAD_TABLE": return action.table
      case "ADD_ROW": return action.copy
      default: throw new TypeError(`Unknown action type: ${action.type}`)
   }
}

//* En un posible rediseño futuro, el estado de las columnas puede ser así:
// [
//    { name: "fila", visible: true, type: "Number", is_data: false },
//    { name: "medidor", visible: true, type: "String", is_data: true },
//    { name: "titular", visible: true, type: "String", is_data: true }
// ]
