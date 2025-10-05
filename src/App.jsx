// Hooks:
import { useEffect, useState } from "react"
import { useIDB, useKeys, useLocalStorage } from "./custom-hooks.js"
// Components:
import AppHeader from "./AppHeader.jsx"
import Logo from "./Logo.jsx"
import Meters from "./Meters.jsx"
import Fees from "./Fees.jsx"
// Utils:
import { set_initial_data } from "./core-funcs.js"

export default function App() {
   const [tab, setTab] = useLocalStorage("tab", "meters")
   const db_connection = useIDB("meters", 1, set_initial_data)
   const keys = useKeys(db_connection, "meters")
   const render_tab = (tab) => {
      switch (tab)
      {
         case "meters": return <Meters {...{ db_connection, keys }} />
         case "fees": return <Fees />
      }
   }
   return (
      <>
         <AppHeader>
            <Logo db_connection={db_connection} />
         </AppHeader>
         <div className="tabs">
            <label>
               <span>Lecturas</span>
               <input type="radio" name="tab" checked={tab === "meters" ? true : false} hidden onChange={() => {
                  setTab("meters")
               }} />
            </label>
            <label>
               <span>Tarifas</span>
               <input type="radio" name="tab" checked={tab === "fees" ? true : false} hidden onChange={() => {
                  setTab("fees")
               }} />
            </label>
         </div>
         {render_tab(tab)}
      </>
   )
}
