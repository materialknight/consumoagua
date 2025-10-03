import { useEffect, useRef, useState } from "react"
import { InfoModal, ConfirmModal } from "./simpleModals.jsx"
import { create_table_URL, csv_table_URL, name_file } from "./core-funcs.js"

export default function DownloadButton({ meters, btn_txt, data_cols = null }) {
   const [objURL, setObjURL] = useState(null)
   const [fileName, setFileName] = useState(null)
   useEffect(() => {
      if (meters.table.length > 0)
      {
         const headers = data_cols?.map(col => col.name)
         const table_URL = btn_txt.toUpperCase() === "JSON"
            ? create_table_URL(meters)
            : csv_table_URL(meters, headers)
         setObjURL(table_URL)
         setFileName(name_file(meters.table))
         return () => {
            URL.revokeObjectURL(table_URL)
            setObjURL(null)
         }
      }
   }, [meters, data_cols])
   const tableEmptyRef = useRef()
   const tableEditableRef = useRef()
   const linkRef = useRef()
   const attempt_download = () => {
      if (!objURL)
      {
         tableEmptyRef.current.showModal()
         return
      }
      if (meters.editable)
      {
         tableEditableRef.current.showModal()
         return
      }
      linkRef.current.click()
   }
   return (
      <>
         <InfoModal
            ref={tableEmptyRef}
            text={"La tabla no puede descargarse porque está vacía"}
         />
         <ConfirmModal
            ref={tableEditableRef}
            text={"La tabla no está sellada, su contenido podría cambiar, ¿desea descargarla de todas formas?"}
            submit_handler={() => {
               linkRef.current.click()
            }}
         />
         <a href={objURL} download={fileName} hidden ref={linkRef}></a>
         <button
            type="button"
            title="Descargar tabla"
            onClick={attempt_download}
            // className="not-ok-btn icon-text-btn"
            className={!meters.editable ? "ok-btn icon-text-btn" : "not-ok-btn icon-text-btn"}
         >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg> {btn_txt}
         </button>
      </>
   )
}