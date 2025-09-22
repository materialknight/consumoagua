export default function reducer(meters, action) {
   switch (action.type)
   {
      case "LOAD_TABLE": return action.table
      case "ADD_ROW": return action.copy
      default: throw new TypeError(`Unknown action type: ${action.type}`)
   }
}

