import { useEffect, useState } from "react"
import { useIDB, useKeys } from "./custom-hooks.js"
import { set_initial_data } from "./core-funcs.js"

import Meters from "./Meters.jsx"
import Fees from "./Fees.jsx"

export default function App() {
   const [tab, setTab] = useState("meters")
   const db_connection = useIDB("meters", 1, set_initial_data)
   const keys = useKeys(db_connection, "meters")
   const render_tab = (tab) => {
      switch (tab)
      {
         case "meters": return <Meters {...{ db_connection, keys }} />
         case "fees": return <Fees />
      }
   }
   const [logo, setLogo] = useState(null)
   useEffect(() => {
      if (db_connection)
      {
         db_connection.get("logo", 1).then(saved_logo => {
            setLogo(saved_logo.logo)
         })
      }
   }, [db_connection])
   return (
      <>
         <header>
            <h1>Registro de consumo de agua</h1>
            <img src={logo} alt="logo" title="logo" />
            {/* <img src="icons/favicon.png" alt="JAAP logo" style="max-width:8vw; padding-top: 1%;"> */}
         </header>
         <div className="tabs">
            <label>Lecturas
               <input type="radio" hidden name="tab" defaultChecked={true} onChange={() => setTab("meters")} />
            </label>
            <label>Tarifas
               <input type="radio" hidden name="tab" onChange={() => setTab("fees")} />
            </label>
         </div>
         {render_tab(tab)}
      </>
   )
}
