import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";

async function app() {
  return `
  <main class="flex gap-[2%] flex-wrap content-start flex-row">
    ${Header()} ${Sidebar()} ${Home()}
  </main>
  `;
}

export default app;
