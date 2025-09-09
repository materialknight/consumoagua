import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <App />
   </StrictMode>
)

if ("serviceWorker" in navigator)
{
   try
   {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`)
   } catch (error)
   {
      console.error(`Your browser seems to support service workers, but the registration of this app's worker failed with error: ${error}`)
   }
} else
{
   console.error("This app's service worker couldn't be installed because you're in Private Mode or your browser doesn't support service workers!")
}
