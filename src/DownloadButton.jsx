import { useContext, useEffect, useRef, useState } from "react"
import { DownloadIcon } from "./style/icons.jsx"
import { MetersContext } from "./Meters.jsx"
import { create_table_URL, name_file } from "./core-funcs.js"

export default function DownloadButton() {
   const { keys, tableNum, meters, last_table_is_sealed } = useContext(MetersContext)
   const table_is_downloadable = (keys.at(-1) !== tableNum) || last_table_is_sealed
   const [objURL, setObjURL] = useState(null)
   const [fileName, setFileName] = useState(null)

   useEffect(() => {
      if (table_is_downloadable && meters.length > 0)
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
   }, [table_is_downloadable, meters])

   const downloadLink = useRef()
   const denial_info = useRef()

   const download_table = () => {
      if (table_is_downloadable && objURL)
      {
         downloadLink.current.click()
      }
      else
      {
         denial_info.current.showModal()
      }
   }
   return (
      <>
         <a href={objURL} download={fileName} hidden ref={downloadLink}></a>
         <button
            type="button"
            title="descargar tabla"
            onClick={download_table}
            className={objURL ? "downloadable" : "non-downloadable"}>
            <DownloadIcon />
         </button>
         <dialog ref={denial_info}>
            <form method="dialog" className="denial-info">
               <p>No se puede descargar la tabla más reciente hasta que esté completa y sellada.</p>
               <button type="submit">Aceptar</button>
            </form>
         </dialog>
      </>
   )
}