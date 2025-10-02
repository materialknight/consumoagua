import { useState, useEffect, useRef } from "react"
import { useLocalStorage } from "./custom-hooks"


export default function AppHeader({ db_connection, children }) {
   const [titles, setTitles] = useLocalStorage("titles", { primary: null, secondary: null })
   const brandModal = useRef(null)

   const open_modal = () => {
      brandModal.current.showModal()
   }

   // const load_brand = submit_ev => {
   //    const brand_data = Object.fromEntries(new FormData(submit_ev.target))
   //    db_connection.put("brand", 1, brand_data)
   //    setBrand(brand_data)
   // }

   const primary_title = titles.primary
      ? <h2 onClick={open_modal}>{titles.primary}</h2>
      : (
         <button
            type="button"
            className="text-btn neutral-btn"
            onClick={open_modal}
         >
            Elegir título primario de los recibos
         </button>
      )
   return (
      <>
         <header className="app-header">
            <div className="titles">
               <h1>Registro de consumo de agua</h1>
               {primary_title}
               {titles.secondary && <h3>{titles.secondary}</h3>}
            </div>
            {children}
         </header>
         <dialog ref={brandModal}>
            <form method="dialog" className="brand-form"
            // onSubmit={load_brand}
            >
               <h2 className="dialog-title">Elegir distintivos</h2>
               {/* <label className="text-btn label-btn neutral-btn">
                  <span>Cargar logo</span>
                  <input type="file" accept=".png, .jpg" name="logo" hidden />
               </label> */}
               <label className="control">
                  <span>Título primario de los recibos:</span>
                  <input type="text" name="primary_title" />
               </label>
               <label className="control">
                  <span>Título secundario de los recibos:</span>
                  <input type="text" name="secondary_title" />
               </label>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button type="button" className="text-btn not-ok-btn" onClick={() => {
                     brandModal.current.close()
                  }}>
                     Cancelar
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}