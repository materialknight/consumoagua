// Hooks:
import { useState, useEffect } from "react"
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
   const [fees, setFees] = useLocalStorage("fees", [
      { mínimo: 0, máximo: 6, fórmula: "2.61" },
      { mínimo: 7, máximo: 40, fórmula: "0.25 * consumo + 1.60" },
      { mínimo: 41, máximo: 50, fórmula: "0.40 * (consumo - 40) + 10 + 1.60" },
      { mínimo: 51, máximo: 100, fórmula: "0.75 * consumo + 1.60" },
      { mínimo: 101, máximo: 150, fórmula: "1.00 * consumo + 1.60" },
      { mínimo: 151, máximo: 200, fórmula: "1.25 * consumo + 1.60" },
      { mínimo: 201, máximo: 999, fórmula: "1.50 * consumo + 1.60" }
   ])
   const [titles, setTitles] = useLocalStorage("titles", { primary: null, secondary: null })
   const [logo, setLogo] = useState({ file: null })
   const [logoURL, setLogoURL] = useState(null)
   const render_tab = (tab) => {
      switch (tab)
      {
         case "meters": return <Meters {...{ db_connection, keys, fees, titles, logoURL }} />
         case "fees": return <Fees {...{ fees, setFees }} />
      }
   }
   useEffect(() => {
      if (db_connection)
      {
         db_connection.get("logo", 1).then(saved_logo => {
            setLogo(saved_logo)
         })
      }
   }, [db_connection])
   useEffect(() => {
      if (logo.file)
      {
         const logo_URL = URL.createObjectURL(logo.file)
         setLogoURL(logo_URL)
         return () => {
            URL.revokeObjectURL(logo_URL)
            setLogoURL(null)
         }
      }
   }, [logo])
   return (
      <>
         <AppHeader {...{ titles, setTitles }}>
            <Logo {...{ db_connection, setLogo, logoURL }} />
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
