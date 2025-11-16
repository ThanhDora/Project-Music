import "../src/assets/style.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Footer from "./components/Footer";

async function app() {
  return `
    ${Header()}
    ${Sidebar()}
    <main class="content-area fixed top-16 left-[230px] right-0 bottom-0 overflow-y-auto p-5">
      ${Home()}
    </main>
    ${Footer()}
  `;
}

export default app;
