import { Icons } from "../utils/Icons";
import { getChartsVideos, getChartsTopArtists, getChartsCountries } from "../utils/Request";
import { getImageUrl } from "../utils/helpers";

async function Charts() {
  const chevronBackIcon = Icons.chevronBack();
  const navigateNextIcon = Icons.navigateNext();
  
  const [videos, artists, countries] = await Promise.all([
    getChartsVideos("GLOBAL", "latest", 20),
    getChartsTopArtists("GLOBAL", "latest", 20),
    getChartsCountries()
  ]);
  
  const chartVideos = videos?.items || [];
  const topArtists = artists?.items || [];
  const countryList = countries?.countries || [];

  return `
    <section class="w-full flex flex-col justify-center items-center py-5">
      <div class="w-full flex flex-col justify-center items-center gap-8">
        <div class="w-[80%]">
          <h2 class="text-4xl font-bold text-white mb-6">Bảng xếp hạng</h2>
          
          <div class="mb-6">
            <label class="text-white/70 text-sm mb-2 block">Chọn quốc gia</label>
            <select id="country-select" class="px-4 py-2 bg-[#1a1a1a] border border-white/30 text-white rounded-lg">
              ${countryList.map(country => `
                <option value="${country.code}" ${country.code === "GLOBAL" ? "selected" : ""}>${country.name}</option>
              `).join("")}
            </select>
          </div>
        </div>

        <div class="w-[80%]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-3xl font-bold text-white">Top Video</h3>
            <div class="gap-2 flex items-center">
              <button id="videos-chart-scroll-prev"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${chevronBackIcon}</button>
              <button id="videos-chart-scroll-next"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${navigateNextIcon}</button>
            </div>
          </div>
          
          <div id="videos-chart-container" class="flex gap-4 overflow-x-auto horizontal-scrollbar pb-2">
            ${chartVideos.map((video, index) => `
              <div class="min-w-[calc(25%-0.75rem)] flex flex-col gap-2 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02]">
                <div class="relative">
                  <img src="${getImageUrl(video)}" alt="video" class="w-full aspect-video object-cover rounded-lg"
                    onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                  <div class="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">#${index + 1}</div>
                </div>
                <div class="flex flex-col gap-1">
                  <h5 class="text-white text-base font-semibold leading-tight truncate">${video.title || video.name}</h5>
                  <p class="text-white/50 text-xs leading-tight truncate">${video.artist || video.artists?.map(a => a.name).join(", ") || ""}</p>
                  <p class="text-white/40 text-xs truncate">${video.views || ""}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="w-[80%]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-3xl font-bold text-white">Top Nghệ Sĩ</h3>
            <div class="gap-2 flex items-center">
              <button id="artists-chart-scroll-prev"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${chevronBackIcon}</button>
              <button id="artists-chart-scroll-next"
                class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">${navigateNextIcon}</button>
            </div>
          </div>
          
          <div id="artists-chart-container" class="flex gap-4 overflow-x-auto horizontal-scrollbar pb-2">
            ${topArtists.map((artist, index) => `
              <div class="min-w-[calc(20%-0.75rem)] flex flex-col gap-2 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02]">
                <div class="relative">
                  <img src="${getImageUrl(artist)}" alt="artist" class="w-full aspect-square object-cover rounded-full"
                    onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                  <div class="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">#${index + 1}</div>
                </div>
                <div class="flex flex-col gap-1 text-center">
                  <h5 class="text-white text-base font-semibold leading-tight truncate">${artist.name || artist.title}</h5>
                  <p class="text-white/50 text-xs truncate">${artist.followers || ""}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

export default Charts;

