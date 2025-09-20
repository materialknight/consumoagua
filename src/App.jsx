import { useState } from "react"
import Meters from "./Meters.jsx"
import Fees from "./Fees.jsx"

export default function App() {
   const [tab, setTab] = useState("meters")
   const render_tab = (tab) => {
      switch (tab)
      {
         case "meters": return <Meters />
         case "fees": return <Fees />
      }
   }
   return (
      <>
         <header>
            <h1>Registro de consumo de agua</h1>
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
