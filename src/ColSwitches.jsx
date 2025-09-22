export default function ColSwitches({ cols, setCols }) {
   const toggle = i => {
      setCols(prev_cols => {
         const next_cols = structuredClone(prev_cols)
         next_cols[i].visible = !next_cols[i].visible
         return next_cols
      })
   }
   const switches = cols.map((col, i) => {
      return (
         <label key={col.name}>
            {col.name}
            <input type="checkbox" hidden checked={col.visible} onChange={() => toggle(i)} />
         </label>
      )
   })
   return (
      <div className="switches">
         {switches}
      </div>
   )
}