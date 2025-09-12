import { useContext, useEffect, useRef, useState } from "react"
import { DownloadIcon } from "./style/icons.jsx"
import { MetersContext } from "./Meters.jsx"

export default function DownloadButton() {
   // If I'm not on the last one, download.
   // If I'm in the last one: if sealed, download, else: show modal.

   // I need keys, meters.

   const { keys, tableNum, meters, last_table_is_sealed } = useContext(MetersContext)
   const table_is_downloadable = (keys.at(-1) !== tableNum) || last_table_is_sealed
   const [objURL, setObjURL] = useState(null)

   useEffect(() => {
      if (table_is_downloadable && meters)
      {
         const blob = new Blob([JSON.stringify(meters, null, 3)], { type: "application/json" })
         const table_URL = URL.createObjectURL(blob)
         setObjURL(table_URL)
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

   const download_table = () => {
      if (table_is_downloadable && objURL)
      {
         downloadLink.current.click()
      }
   }
   return (
      <>
         <a href={objURL} download="file" hidden ref={downloadLink}></a>
         <button title="descargar tabla" onClick={download_table}>
            <DownloadIcon fill="lightgreen" />
         </button>
      </>
   )
}