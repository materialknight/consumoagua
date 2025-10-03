import { useState, useRef, useEffect } from "react"

export default function Logo({ db_connection }) {
   const [logo, setLogo] = useState({ file: null })
   const [logoURL, setLogoURL] = useState(null)
   const removeLogoModal = useRef(null)

   const remove_logo = () => {
      const deleted_logo = { file: null }
      db_connection.put("logo", 1, deleted_logo)
      setLogo(deleted_logo)
   }
   const load_logo = change_ev => {
      const file = change_ev.target.files[0]
      if (file)
      {
         const new_logo = { file }
         db_connection.put("logo", 1, new_logo)
         setLogo(new_logo)
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
         {logoURL
            ? (
               <img
                  src={logoURL}
                  alt="Click para cambiar el logo"
                  title="Click para cambiar el logo"
                  className="logo"
                  onClick={() => {
                     removeLogoModal.current.showModal()
                  }}
               />
            )
            : (
               <label className="label-btn neutral-btn logo" title="Click para cambiar el logo">
                  <span className="centered-text">Cargar logo. Tamaño ideal: 100x100px</span>
                  <input type="file" accept=".png, .jpg" name="logo" onChange={load_logo} hidden />
               </label>
            )
         }
         <dialog ref={removeLogoModal}>
            <form method="dialog" onSubmit={remove_logo}>
               <p>¿Desea quitar el logo?</p>
               <div className="accept-cancel">
                  <button type="submit" className="text-btn ok-btn">Sí</button>
                  <button type="button" className="text-btn not-ok-btn" onClick={() => {
                     removeLogoModal.current.close()
                  }}>
                     No
                  </button>
               </div>
            </form>
         </dialog>
      </>
   )
}