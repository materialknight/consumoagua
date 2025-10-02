import { useRef } from "react"
import { useLocalStorage } from "./custom-hooks"

export default function AppHeader({ children }) {
   const [titles, setTitles] = useLocalStorage("titles", { primary: null, secondary: null })
   const titlesModal = useRef(null)
   const open_titles_modal = () => {
      titlesModal.current.showModal()
   }
   const save_titles = submit_ev => {
      const new_titles = Object.fromEntries(new FormData(submit_ev.target))
      setTitles(new_titles)
   }
   const primary_title = titles.primary
      ? <h2 onClick={open_titles_modal}>{titles.primary}</h2>
      : (
         <button
            type="button"
            className="text-btn neutral-btn"
            onClick={open_titles_modal}
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
         <dialog ref={titlesModal}>
            <form method="dialog" className="titles-form" onSubmit={save_titles}>
               <h2 className="dialog-title">Editar títulos de los recibos</h2>
               <label className="control">
                  <span>Título primario de los recibos:</span>
                  <input type="text" name="primary" defaultValue={titles.primary} />
               </label>
               <label className="control">
                  <span>Título secundario de los recibos:</span>
                  <input type="text" name="secondary" defaultValue={titles.secondary} />
               </label>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Aceptar</button>
                  <button type="button" className="text-btn not-ok-btn" onClick={() => {
                     titlesModal.current.close()
                  }}>
                     Cancelar
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}