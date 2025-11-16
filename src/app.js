import "../src/assets/style.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Footer from "./components/Footer";

async function app() {
  return `
    ${await Header()}
    ${Sidebar()}
    <main class="content-area fixed top-16 left-[230px] right-0 bottom-[8%] overflow-y-auto p-5">
      ${await Home()}
    </main>
    ${await Footer()}
  `;
}

export default app;
