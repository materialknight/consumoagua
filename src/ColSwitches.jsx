export default function ColSwitches({ cols, shownCols, setShownCols }) {
   const toggle = col => {
      setShownCols(prev_shown_cols => {
         const next_shown_cols = { ...prev_shown_cols }
         next_shown_cols[col] = !next_shown_cols[col]
         return next_shown_cols
      })
   }
   const switches = cols.map((col, i) => {
      return (
         <label key={col}>
            {col}
            <input type="checkbox" hidden checked={shownCols[col]} onChange={() => toggle(col)} />
         </label>
      )
   })
   return (
      <div className="switches">
         {switches}
      </div>
   )
}