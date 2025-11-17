import { Icons } from "../utils/Icons";
import { fetchSongs } from "../utils/Request";
import colors from "../assets/colors";

async function Discover() {
  const songs = await fetchSongs();
  const tiktokIcon = Icons.tiktok();
  const trendingUpIcon = Icons.trendingUp();
  const moodIcon = Icons.mood();
  const chevronBackIcon = Icons.chevronBack();
  const navigateNextIcon = Icons.navigateNext();

  return `
     <section class="w-full flex flex-col justify-center items-center py-10">
    <div class="w-[80%] flex flex-col justify-center gap-5">
      <div class="w-full flex flex-wrap justify-start items-center gap-6">
      <button
          class="flex-1 min-w-0 px-6 py-5 text-xl md:text-2xl lg:text-3xl rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none flex items-center justify-center gap-2">${tiktokIcon} <span class="truncate">Bản phát hành mới</span></button>
      <button
          class="flex-1 min-w-0 px-6 py-5 text-xl md:text-2xl lg:text-3xl rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none flex items-center justify-center gap-2">${trendingUpIcon} <span class="truncate">Bảng xếp hạng</span></button>
      <button
          class="flex-1 min-w-0 px-6 py-5 text-xl md:text-2xl lg:text-3xl rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none flex items-center justify-center gap-2">${moodIcon} <span class="truncate">Tâm trạng và thể loại</span></button>
      </div>


      <div class="w-full">
        <div class="flex items-center justify-between pt-15 pb-10">
          <h3 class="text-4xl uppercase font-bold text-white">Tâm trạng và thể loại</h3>
          <div class="flex items-center gap-5">
            <button
              class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">Xem thêm</button>
            <div class="gap-2 flex items-center">
              <button id="mood-genre-scroll-prev"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${chevronBackIcon}</button>
              <button id="mood-genre-scroll-next"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${navigateNextIcon}</button>
            </div>
          </div>
        </div>
        
        <div id="mood-genre-scroll-container" class="overflow-x-auto horizontal-scrollbar pb-2">
          <div class="flex gap-4">
            ${(() => {
              const allGenres = [...new Set(songs.map((s) => s.genre))];
              const allMoods = [...new Set(songs.map((s) => s.mood))];
              const categories = [...allMoods, ...allGenres];

              return Array.from(
                { length: Math.ceil(categories.length / 4) },
                (_, colIndex) => {
                  const startIndex = colIndex * 4;
                  return `
                  <div class="flex flex-col gap-4 min-w-[calc(25%-0.75rem)] ${
                    colIndex === 0 ? " pl-2" : ""
                  }">
                    ${categories
                      .slice(startIndex, startIndex + 4)
                      .map(
                        (category, index) => `
                      <button class="bg-[#1a1a1a] text-white px-4 py-3 rounded-lg border-l-4 ${
                        colors[startIndex + index] || "border-gray-500"
                      } hover:bg-[#2a2a2a] transition-colors cursor-pointer text-left">
                        ${category}
                      </button>
                    `
                      )
                      .join("")}
                  </div>
                `;
                }
              ).join("");
            })()}
          </div>
        </div>

        <div class="w-full">
        <div class="flex items-center justify-between pt-15 pb-10">
          <h3 class="text-4xl uppercase font-bold text-white">Video nhạc mới</h3>
          <div class="flex items-center gap-5">
            <button
              class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">Xem thêm</button>
            <div class="gap-2 flex items-center">
              <button id="new-music-scroll-prev"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${chevronBackIcon}</button>
              <button id="new-music-scroll-next"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${navigateNextIcon}</button>
            </div>
          </div>
        </div>

        <div class="w-full">
          <div id="new-music-scroll-container" class="flex gap-4 overflow-x-auto horizontal-scrollbar pb-2">
            ${songs
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

      </div>
    </div>
  </section>
    `;
}

export default Discover;
