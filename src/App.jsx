import { useState } from "react"
import Meters from "./Meters.jsx"
import Fees from "./Fees.jsx"
import { useDB, useKeys, useLocalStorage } from "./custom-hooks.js"
// import reducer from "./reducer.js"

export default function App() {

   const [tab, setTab] = useState("meters")
   const db_connection = useDB("meters", 1)
   const keys = useKeys(db_connection, "meters")
   const fees = useLocalStorage("fees")

   return (
      <>
         <header>
            <h1>Registro de consumo de Agua</h1>
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
         {
            tab === "meters" && <Meters keys={keys} db_connection={db_connection} />
            ||
            tab === "fees" && <Fees fees={fees} />
         }
      </>
   )
}
