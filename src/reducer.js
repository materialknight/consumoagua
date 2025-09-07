export default function reducer(metersTable, action) {

   const updated_meters_table = { ...metersTable }

   switch (action.type)
   {
      case "SET_TABLE": return action.meters_table


      default: console.error(`Unknown action type: ${action.type}`)
   }
}