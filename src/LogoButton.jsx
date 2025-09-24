export default function LogoButton({ db_connection }) {
   const load_logo = (change) => {
      // const logo = change.target.files[0]
      // if (!logo) return
      // db_connection.put("logo", 1, { logo })


   }
   return (
      <label title="Cargar logo" className="neutral-btn icon-btn label-btn">
         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm480-280v-167l-64 63-56-56 160-160 160 160-56 56-64-63v167h-80Z" />
         </svg>
         <input type="file" accept=".png, .jpg" hidden onChange={load_logo} />
      </label>
   )
}

"distintivs"