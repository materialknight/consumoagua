import { useEffect, useRef, useState } from "react"
import { create_table_URL, name_file } from "./core-funcs.js"

export default function DownloadButton({ keys, tableNum, meters, lastTableMutable }) {
   const table_loaded = meters.length > 0
   const not_last_table = tableNum !== keys.at(-1)
   const table_downloadable = table_loaded && (!lastTableMutable || not_last_table)

   const [objURL, setObjURL] = useState(null)
   const [fileName, setFileName] = useState(null)

   useEffect(() => {
      if (table_downloadable)
      {
         const table_URL = create_table_URL(meters)
         setObjURL(table_URL)
         setFileName(name_file(meters))
         return () => {
            URL.revokeObjectURL(table_URL)
         }
      }
      else
      {
         setObjURL(null)
      }
   }, [table_downloadable, meters])

   const downloadLink = useRef()
   const denialInfo = useRef()

   const download_table = () => {
      if (table_downloadable && objURL)
      {
         downloadLink.current.click()
      }
      else
      {
         denialInfo.current.showModal()
      }
   }
   // Icon info: Weight 400, Grade 0, Optical Size 24px, Material Symbols Outlined, size 24dp.
   return (
      <>
         <a href={objURL} download={fileName} hidden ref={downloadLink}></a>
         <button
            type="button"
            title="Descargar tabla"
            onClick={download_table}
            className={objURL ? "ok-btn icon-btn" : "not-ok-btn icon-btn"}
         >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
         </button>
         <dialog ref={denialInfo}>
            <form method="dialog" className="denial-info">
               <p>No se puede descargar la tabla más reciente hasta que esté completa y sellada.</p>
               <button type="submit" className="text-btn ok-btn">Aceptar</button>
            </form>
         </dialog>
      </>
   )
}