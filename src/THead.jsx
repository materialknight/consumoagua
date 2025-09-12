import { useContext } from "react"
import { MetersContext } from "./Meters"

export default function THead() {
   const { filtered_cols } = useContext(MetersContext)
   const THs = filtered_cols.map(col => <th key={col} data-col={col}>{col}</th>)
   return (
      <thead>
         <tr data-row="0">{THs}</tr>
      </thead>
   )
}