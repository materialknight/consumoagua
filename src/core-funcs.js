export function name_file(table) {
   const row = table[0]
   const month_1 = display_date(row.desde, { month: "short" })
   const month_2 = display_date(row.hasta, { month: "short" })
   const year = row.hasta.getFullYear().toString()
   return month_1.concat("-", month_2, "-", year)
}

export function add_floats(a, b) {
   const cents_A = Math.round(a * 100)
   const cents_B = Math.round(b * 100)
   const sum_cents = cents_A + cents_B
   return sum_cents / 100
}

export function subtract_floats(a, b) {
   const cents_A = Math.round(a * 100)
   const cents_B = Math.round(b * 100)
   const subtraction_cents = cents_A - cents_B
   return subtraction_cents / 100
}

export function create_table_URL(meters) {
   const meters_clone = structuredClone(meters)
   for (const row of meters_clone.table)
   {
      row.desde = stringify_date(row.desde)
      row.hasta = stringify_date(row.hasta)
   }
   const meters_str = JSON.stringify(meters_clone, null, 2)
   const blob = new Blob([meters_str], { type: "application/json" })
   return URL.createObjectURL(blob)
}

export function stringify_date(date) {
   // For exporting dates in a JSON file in human-readable format, with create_table_URL().
   const year = date.getFullYear().toString()
   const month = (date.getMonth() + 1).toString().padStart(2, "0")
   const day = date.getDate().toString().padStart(2, "0")
   return year.concat("-", month, "-", day)
}

export function filter_indexes(table, visible_cols, filter, dateFormat) {
   if (filter.length < 1) return Object.keys(table)

   const find_match = val => {
      let str_val = null
      let val_type = val === null ? null : val.constructor.name
      switch (val_type)
      {
         case "String":
            str_val = val
            break
         case "Number":
            str_val = val.toString()
            break
         case "Date":
            str_val = display_date(val, dateFormat)
            break
         case null:
            str_val = ""
            break
         default:
            throw new TypeError(`Unexpected type: ${val_type}, value: ${val}`)
      }
      str_val = str_val.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritic)
      const normalized_filter = filter.toLowerCase().replaceAll(/[áéíóúñ]/g, remove_diacritic)
      return str_val.includes(normalized_filter)

   }
   return table.reduce((indexes, row, i) => {
      const shown_vals = visible_cols.filter(col => col !== "fila").map(col => row[col])
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

export function display_date(date, options = {
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

export function set_initial_data(db, old_version_num = null, new_version_num = null) {

   localStorage.setItem("fees", JSON.stringify([
      { mínimo: 0, máximo: 6, fórmula: "2.61" },
      { mínimo: 7, máximo: 40, fórmula: "0.25 * consumo + 1.60" },
      { mínimo: 41, máximo: 50, fórmula: "0.40 * (consumo - 40) + 10 + 1.60" },
      { mínimo: 51, máximo: 100, fórmula: "0.75 * consumo + 1.60" },
      { mínimo: 101, máximo: 150, fórmula: "1.00 * consumo + 1.60" },
      { mínimo: 151, máximo: 200, fórmula: "1.25 * consumo + 1.60" },
      { mínimo: 201, máximo: null, fórmula: "1.50 * consumo + 1.60" }
   ]))

   const meters_store = db.createObjectStore("meters", { autoIncrement: true })
   const brand_store = db.createObjectStore("logo", { autoIncrement: true })
   brand_store.add({ file: null })

   // Test data below. Only 1 empty array should be added in production.
   meters_store.add({
      last_pay_day: null,
      editable: false,
      table: [
         {
            medidor: "010101",
            titular: "Tobías López",
            anterior: 10,
            actual: 20,
            desde: new Date(2025, 0, 15),
            hasta: new Date(2025, 1, 15),
            recibo: 12607,
            pago: "efectuado",
            deuda: 0,
            multa: 0,
            otros: 0,
            crédito: 0,
            zona: "1",
            caserío: "La Paz"
         },
         {
            medidor: "020202",
            titular: "Levi Menénez",
            anterior: 0,
            actual: 15,
            desde: new Date(2025, 0, 15),
            hasta: new Date(2025, 1, 15),
            recibo: 12607,
            pago: "efectuado",
            deuda: 0,
            multa: 0,
            otros: 0,
            crédito: 0,
            zona: "2",
            caserío: "El Progreso"
         },
         {
            medidor: "030303",
            titular: "Baruc Hernández",
            anterior: 20,
            actual: 30,
            desde: new Date(2025, 0, 15),
            hasta: new Date(2025, 1, 15),
            recibo: 12607,
            pago: "efectuado",
            deuda: 0,
            multa: 0,
            otros: 0,
            crédito: 0,
            zona: "3",
            caserío: "La Libertad"
         }
      ]
   })

   meters_store.add({
      last_pay_day: null,
      editable: true,
      table: [
         {
            medidor: "010101",
            titular: "Tobías López",
            anterior: 20,
            actual: 30,
            desde: new Date(2025, 1, 15),
            hasta: new Date(2025, 2, 15),
            recibo: 12607,
            pago: "pendiente",
            deuda: 0,
            multa: 0,
            otros: 0,
            crédito: 0,
            zona: "1",
            caserío: "La Paz"
         },
         {
            medidor: "020202",
            titular: "Levi Menénez",
            anterior: 15,
            actual: 40,
            desde: new Date(2025, 1, 15),
            hasta: new Date(2025, 2, 15),
            recibo: 12607,
            pago: "pendiente",
            deuda: 0,
            multa: 0,
            otros: 0,
            crédito: 0,
            zona: "2",
            caserío: "El Progreso"
         },
         {
            medidor: "030303",
            titular: "Baruc Hernández",
            anterior: 30,
            actual: null,
            desde: new Date(2025, 1, 15),
            hasta: null,
            recibo: null,
            pago: null,
            deuda: 0,
            multa: 0,
            otros: 0,
            crédito: 0,
            zona: "3",
            caserío: "La Libertad"
         }
      ]
   })

   // todo: sync table with .json, new table from .json.
   // todo: create indexes(?)
}


// ! Functions to be deleted:

function prompt_refresh() {
   db.close()
   alert("La base de datos está desactualizada! Por favor recargue la app, o ciérrela y vuélvala a abrir.")
}
