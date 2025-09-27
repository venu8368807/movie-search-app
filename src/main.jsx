import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import './Components/Movie Search App/CSS/index.css'


createRoot(document.getElementById("venu")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
