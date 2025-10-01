export default function DownloadCSVButton(meters) {

   return (
      <>
         <a href={objURL} download={fileName} hidden ref={downloadLink}></a>
         <button
            type="button"
            title="Descargar tabla"
            onClick={download_table}
            className={objURL ? "ok-btn icon-text-btn" : "not-ok-btn icon-text-btn"}
         >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
               <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg> CSV
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