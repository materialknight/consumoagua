export function name_file(table) {
   const { desde, hasta } = table[0]
   return [desde, hasta]
      .map(date => stringify_date(date, { month: "short" }))
      .join("-")
      .concat("-")
      .concat(stringify_date(hasta, { year: "numeric" }))
}

export function create_table_URL(table) {
   let exportable_table = table.map(obj => {
      const row_copy = { ...obj }
      row_copy.desde = export_date(row_copy.desde)
      row_copy.hasta = export_date(row_copy.hasta)
      return row_copy
   })
   exportable_table = JSON.stringify(exportable_table, null, 2)
   const blob = new Blob([exportable_table], { type: "application/json" })
   return URL.createObjectURL(blob)
}

function export_date(date) {
   return stringify_date(date, { year: "numeric" })
      .concat("-")
      .concat(stringify_date(date, { month: "2-digit" }))
      .concat("-")
      .concat(stringify_date(date, { day: "2-digit" }))
}

export function filter_indexes(meters, filtered_cols, filter) {
   if (filter.length < 2) return Object.keys(meters)

   const find_match = val => {
      let str_val = null
      switch (val.constructor.name)
      {
         case "String":
            str_val = val
            break
         case "Number":
            str_val = val.toString()
            break
         case "Date":
            str_val = stringify_date(val)
            break
         default:
            throw new TypeError(`Unexpected type: ${val.constructor.name}, value: ${val}`)

      }
      str_val = str_val.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritic)
      const normalized_filter = filter.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritic)
      return str_val.includes(normalized_filter)

   }
   return meters.reduce((indexes, row, i) => {
      const shown_vals = filtered_cols.filter(col => col !== "fila").map(col => row[col])
      if (shown_vals.some(find_match))
      {
         indexes.push(i)
      }
      return indexes
   }, [])
}

function remove_diacritic(char) {
   switch (char)
   {
      case "á": return "a"
      case "é": return "e"
      case "í": return "i"
      case "ó": return "o"
      case "ú": return "u"
      case "ñ": return "n"
   }
}

export function stringify_date(date, options = {
   weekday: "short",
   day: "numeric",
   year: "2-digit",
   month: "short"
}) {
   return date.toLocaleDateString("es", {
      ...options,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
   })
}

export function parse_date(date_str) {
   const date_args = date_str
      .split("-")
      .map((numerical_str, i) => {
         const num = parseInt(numerical_str, 10)
         return i === 1 ? num - 1 : num
      })

   return new Date(...date_args)
}

export function set_initial_data(upgrade_needed_ev) {

   localStorage.setItem("fees", JSON.stringify([
      { mínimo: 0, máximo: 6, fórmula: "2.61" },
      { mínimo: 7, máximo: 40, fórmula: "0.25 * consumo + 1.60" },
      { mínimo: 41, máximo: 50, fórmula: "0.40 * (consumo - 40) + 10 + 1.60" },
      { mínimo: 51, máximo: 100, fórmula: "0.75 * consumo + 1.60" },
      { mínimo: 101, máximo: 150, fórmula: "1.00 * consumo + 1.60" },
      { mínimo: 151, máximo: 200, fórmula: "1.25 * consumo + 1.60" },
      { mínimo: 201, máximo: null, fórmula: "1.50 * consumo + 1.60" }
   ]))

   const db = upgrade_needed_ev.target.result
   const meters_store = db.createObjectStore("meters", { autoIncrement: true })

   // Test data below. Only 1 empty array should be added in production.
   meters_store.add([
      {
         medidor: "010101",
         titular: "Tobías López",
         anterior: 10,
         desde: new Date(1726293600000),
         actual: 20,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: "1",
         caserío: "La Paz"
      },
      {
         medidor: "020202",
         titular: "Levi Menénez",
         anterior: 0,
         desde: new Date(1726293600000),
         actual: 15,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: "2",
         caserío: "La Paz"
      },
      {
         medidor: "030303",
         titular: "Baruc Hernández",
         anterior: 20,
         desde: new Date(1726293600000),
         actual: 30,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: "3",
         caserío: "La Paz"
      }
   ])

   meters_store.add([
      {
         medidor: "010101",
         titular: "Tobías López",
         anterior: 20,
         desde: new Date(1726293600000),
         actual: 30,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: "1",
         caserío: "La Paz"
      },
      {
         medidor: "020202",
         titular: "Levi Menénez",
         anterior: 15,
         desde: new Date(1726293600000),
         actual: 40,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: "2",
         caserío: "La Paz"
      },
      {
         medidor: "030303",
         titular: "Baruc Hernández",
         anterior: 30,
         desde: new Date(1726293600000),
         actual: 50,
         hasta: new Date(1727848800000),
         recibo: 12607,
         pago: "-",
         zona: "3",
         caserío: "La Paz"
      }
   ])

   // todo: sync table with .json, new table from .json.
   // todo: create indexes(?)
}


// ! Functions to be deleted:

function prompt_refresh() {
   db.close()
   alert("La base de datos está desactualizada! Por favor recargue la app, o ciérrela y vuélvala a abrir.")
}
