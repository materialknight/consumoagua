
export function filter_table(meters, filtered_cols, filter) {
   const reduce_row = make_row_reducer(filtered_cols)
   const reduced_rows = meters.map(reduce_row)
   if (filter.length < 2)
   {
      return reduced_rows
   }
   const find_match = make_match_finder(filter)
   return reduced_rows.filter(row => Object.values(row).some(find_match))
}

function make_row_reducer(filtered_cols) {
   return function (row) {
      const reduced_row = {}
      for (const col of filtered_cols)
      {
         if (col === "fila") continue
         reduced_row[col] = row[col]
      }
      return reduced_row
   }
}

function make_match_finder(filter) {
   return function (val) {
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
            str_val = date_str(val)
            break
         default:
            throw new TypeError(`Unexpected type: ${val.constructor.name}, value: ${val}`)

      }
      str_val = str_val.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritic)
      const normalized_filter = filter.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritic)
      return str_val.includes(normalized_filter)
   }
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

export function date_str(date) {
   return date.toLocaleDateString("es", {
      weekday: "short",
      day: "numeric",
      year: "2-digit",
      month: "short",
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
         zona: 1,
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
         zona: 1,
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
         zona: 1,
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
         zona: 1,
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
         zona: 1,
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
         zona: 1,
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
