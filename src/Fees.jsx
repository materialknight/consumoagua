// Hooks:
// import { useEffect, useReducer, useState } from "react"
import { useLocalStorage } from "./custom-hooks.js"
import FeesMenu from "./FeesMenu.jsx"
import FeesTable from "./FeesTable.jsx"
// Buttons:
import EditFeesButton from "./EditFeesButton.jsx"

export default function Fees({ fees, setFees }) {
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