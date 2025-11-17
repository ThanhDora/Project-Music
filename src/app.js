import "../src/assets/style.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { renderPage } from "./utils/Router";

async function app() {
  return `
    ${await Header()}
    ${Sidebar()}
    <main id="main-content" class="content-area fixed top-16 left-[230px] right-0 bottom-[8%] overflow-y-auto p-5">
      ${await renderPage()}
    </main>
    ${await Footer()}
  `;
}

export default app;
