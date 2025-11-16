import { Icons } from "../utils/Icons";
import { fetchSongs } from "../utils/Request";

async function Home() {
  const chevronBackIcon = Icons.chevronBack();
  const navigateNextIcon = Icons.navigateNext();
  const songs = await fetchSongs();

  return `
    <section class="w-full flex flex-col justify-center items-center gap-5">
    <div class="w-full flex flex-col justify-center items-center gap-5">
      <div class="w-full flex flex-col justify-center items-center">
        <div
          class="w-[80%] flex justify-start items-center flex-nowrap gap-2 overflow-x-auto horizontal-scrollbar pb-2">
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Nạp
            năng lượng</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Thư
            giãn</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Vui
            tươi</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Tiệc
            tùng</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Trên
            đường đi làm</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Tập
            thể dục</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Lãng
            mạn</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Buồn</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Tập
            trung</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Dễ
            ngủ</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Độc
            đáo</button>
        </div>
      </div>
      <!-- button view all -->

      <div class="w-[80%] flex items-center gap-4">
        <div class="flex-1 flex flex-col justify-start items-start">
          <p class="text-sm text-white/50 mb-2">NHỮNG BÁN NHẠC GIÚP BẠN LÀM QUEN</p>
          <div class="flex w-full items-center justify-between">
            <h3 class="text-2xl font-bold text-white">Chào mừng ThanhDora</h3>
            <div class="flex items-center gap-5">
              <button
                class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">Phát
                tất cả</button>
              <div class="gap-2 flex items-center">
                <button id="songs-scroll-prev"
                  class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${chevronBackIcon}</button>
                <button id="songs-scroll-next"
                  class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${navigateNextIcon}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[80%]">
        <div id="songs-scroll-container"
          class="flex gap-6 overflow-x-auto horizontal-scrollbar pb-2 overflow-y-visible">
          ${Array.from({ length: 6 }, (_, colIndex) => {
            const startIndex = colIndex * 4;
            return `
          <div class="flex flex-col gap-4 min-w-[calc(33.333%-0.5rem)] ${
            colIndex === 0 ? " pl-2" : ""
          }">
            ${songs
              .slice(startIndex, startIndex + 4)
              .map(
                (song) => `
            <div
              class="flex items-center gap-3 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02] h-20">
              <img src="${song.img || "/src/assets/images/git.jpg"}" alt="album"
                class="w-16 h-16 rounded-lg object-cover shrink-0 transition-transform duration-200 group-hover:scale-105">
              <div class="flex flex-col gap-1 min-w-0 flex-1 h-full justify-center">
                <h5
                  class="text-white text-sm font-semibold leading-tight group-hover:text-white transition-colors truncate">
                  ${song.title}</h5>
                <p class="text-white/60 text-xs leading-tight group-hover:text-white/80 transition-colors truncate">${
                  song.artist
                }</p>
                <p class="text-white/40 text-xs group-hover:text-white/60 transition-colors truncate">${
                  song.plays
                }</p>
                <p class="text-white/30 text-xs group-hover:text-white/50 transition-colors truncate">${
                  song.album
                }</p>
              </div>
            </div>
            `
              )
              .join("")}
          </div>
          `;
          }).join("")}
        </div>
      </div>
      <!-- end item songs -->

      <div class="w-[80%] flex items-center gap-4">
        <div class="flex-1 flex flex-col justify-start items-start">
          <div class="flex w-full items-center justify-between">
            <h3 class="text-4xl uppercase font-bold text-white">Video nhạc cho bạn</h3>
            <div class="flex items-center gap-5">
              <button
                class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">Phát
                tất cả</button>
              <div class="gap-2 flex items-center">
                <button id="videos-scroll-prev"
                  class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${chevronBackIcon}</button>
                <button id="videos-scroll-next"
                  class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${navigateNextIcon}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[80%]">
        <div id="videos-scroll-container" class="flex gap-4 overflow-x-auto horizontal-scrollbar pb-2">
          ${songs
            .slice(0, 8)
            .map(
              (song) => `
            <div class="min-w-[calc(25%-0.75rem)] flex flex-col gap-2 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02]">
              <img src="${
                song.img || "/src/assets/images/git.jpg"
              }" alt="video" class="w-full aspect-video object-cover rounded-lg">
              <div class="flex flex-col gap-1">
                <h5 class="text-white text-base font-semibold leading-tight truncate">${
                  song.video
                }</h5>
                <div class="flex items-center gap-1">
                <p class="text-white/50 text-xs leading-tight truncate">${
                  song.artist
                }</p>
                <p class="text-white/50 text-xs leading-tight truncate">${
                  song.plays
                }</p>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- end item videos -->

      <div class="w-[80%] flex items-center gap-4">
        <div class="flex-1 flex flex-col justify-start items-start">
          <div class="flex w-full items-center justify-between">
            <h3 class="text-4xl uppercase font-bold text-white">Đĩa nhạc cho bạn</h3>
            <div class="flex items-center gap-5">
              <div class="gap-2 flex items-center">
                <button id="albums-scroll-prev"
                  class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${chevronBackIcon}</button>
                <button id="albums-scroll-next"
                  class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${navigateNextIcon}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[80%]">
        <div id="albums-scroll-container" class="flex gap-4 overflow-x-auto horizontal-scrollbar pb-2">
          ${songs
            .slice(0, 8)
            .map(
              (song) => `
            <div class="min-w-[calc(20%-0.75rem)] flex flex-col gap-2 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02]">
              <img class="w-60 h-70 object-cover rounded-lg" src="${
                song.img || "/src/assets/images/git.jpg"
              }" alt="album" class="w-60 h-70 object-cover rounded-lg">
              <div class="flex flex-col gap-2">
                <h5 class="text-white text-base font-semibold leading-tight truncate">${
                  song.album
                }</h5>
                <p class="text-white/50 text-xs leading-tight truncate">${
                  song.artist
                }</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- end item albums -->

    </div>
  </section>
    `;
}

export default Home;
