import "./assets/style.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Toast from "./components/Toast";
import { renderPage } from "./router/router";

let appInitialized = false;

export async function initApp() {
  if (appInitialized) {
    return;
  }

  try {
    const header = Header();
    const sidebar = Sidebar();
    const footer = await Footer();
    const loginModal = LoginModal();
    const toast = Toast();

    document.querySelector("#app").innerHTML = `
      ${header}
      ${sidebar}
      <main id="main-content" class="content-area fixed top-16 left-[230px] right-0 bottom-[8%] overflow-y-auto p-5">
      </main>
      ${footer}
      ${loginModal}
      ${toast}
    `;

    appInitialized = true;

    const { getCurrentPage, getCurrentParams } = await import("./router/router");
    const currentPage = getCurrentPage();
    let currentParams = getCurrentParams();
    
    // If on song-details page but no songId in params, try to get from localStorage
    if (currentPage === "song-details" && !currentParams.songId) {
      try {
        const storedSong = localStorage.getItem("currentPlayingSong");
        if (storedSong) {
          const song = JSON.parse(storedSong);
          const songId = song._id || song.id || song.videoId;
          if (songId) {
            currentParams = { songId };
          }
        }
      } catch (e) {
      }
    }
    
    const page = await renderPage(currentPage, currentParams);
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.innerHTML = page;
    }
  } catch (error) {
    document.querySelector("#app").innerHTML = `
      ${Header()}
    ${Sidebar()}
    <main id="main-content" class="content-area fixed top-16 left-[230px] right-0 bottom-[8%] overflow-y-auto p-5">
        <div class="w-full flex items-center justify-center py-20">
          <div class="text-white text-center">
            <p class="text-xl mb-4">Có lỗi xảy ra khi tải trang</p>
            <p class="text-white/50 text-sm">Vui lòng thử lại sau</p>
          </div>
        </div>
    </main>
      ${await Footer().catch(() => "")}
      ${LoginModal()}
      ${Toast()}
  `;
    appInitialized = true;
  }
}

async function app() {
  if (!appInitialized) {
    await initApp();
  }
  return "";
}

export default app;
