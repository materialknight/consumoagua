// Hooks:
// import { useEffect, useReducer, useState } from "react"
import { useLocalStorage } from "./custom-hooks.js"
import FeesMenu from "./FeesMenu.jsx"
import FeesTable from "./FeesTable.jsx"
// Buttons:
import EditFeesButton from "./EditFeesButton.jsx"

export default function Fees() {
   const [fees, setFees] = useLocalStorage("fees", [
      { mínimo: 0, máximo: 6, fórmula: "2.61" },
      { mínimo: 7, máximo: 40, fórmula: "0.25 * consumo + 1.60" },
      { mínimo: 41, máximo: 50, fórmula: "0.40 * (consumo - 40) + 10 + 1.60" },
      { mínimo: 51, máximo: 100, fórmula: "0.75 * consumo + 1.60" },
      { mínimo: 101, máximo: 150, fórmula: "1.00 * consumo + 1.60" },
      { mínimo: 151, máximo: 200, fórmula: "1.25 * consumo + 1.60" },
      { mínimo: 201, máximo: 999, fórmula: "1.50 * consumo + 1.60" }
   ])
   return (
      <>
         <FeesMenu>
            <EditFeesButton {...{ fees, setFees }} />
         </FeesMenu>
         <main>
            <FeesTable {...{ fees }} />
         </main>
      </>
   )
}