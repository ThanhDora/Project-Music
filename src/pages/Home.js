import { Icons } from "../utils/Icons";
import {
  getPersonalized,
  getExploreAlbums,
  getCurrentUser,
  getMoods,
  getLines,
  getLineSongs,
  getLineVideos,
  isAuthenticated,
} from "../utils/Request";
import { extractItems, getArtistName, getImageUrl } from "../utils/helpers";

const renderSongCard = (song) => {
  const songId = song.videoId || song._id || song.id || song.name || "";
  const songData = JSON.stringify(song).replace(/"/g, "&quot;");
  return `
  <div data-song-id="${songId}" data-song-data="${songData}"
    class="flex items-center gap-3 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02] h-20">
    <img src="${getImageUrl(song)}" alt="album"
      class="w-16 h-16 rounded-lg object-cover shrink-0 transition-transform duration-200 group-hover:scale-105"
      onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
    <div class="flex flex-col gap-1 min-w-0 flex-1 h-full justify-center">
      <h5 class="text-white text-sm font-semibold leading-tight group-hover:text-white transition-colors truncate">
        ${song.name || song.title || "Không có tiêu đề"}
      </h5>
      <p class="text-white/60 text-xs leading-tight group-hover:text-white/80 transition-colors truncate">
        ${getArtistName(song)}
      </p>
      <p class="text-white/40 text-xs group-hover:text-white/60 transition-colors truncate">
        ${song.views || song.plays || ""}
      </p>
      <p class="text-white/30 text-xs group-hover:text-white/50 transition-colors truncate">
        ${song.albumName || song.album || ""}
      </p>
    </div>
  </div>
`;
};

const renderVideoCard = (video) => `
  <div data-video-id="${
    video.id || video._id || video.videoId || video.slug || ""
  }" 
    class="min-w-[calc(25%-0.75rem)] flex flex-col gap-2 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02]">
    <img src="${getImageUrl(video)}" 
      alt="video" class="w-full aspect-video object-cover rounded-lg"
      onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
    <div class="flex flex-col gap-1">
      <h5 class="text-white text-base font-semibold leading-tight truncate">
        ${video.name || video.title || "Không có tiêu đề"}
      </h5>
      <div class="flex items-center gap-1">
        <p class="text-white/50 text-xs leading-tight truncate">${getArtistName(
          video
        )}</p>
        <p class="text-white/50 text-xs leading-tight truncate">${
          video.views || ""
        }</p>
      </div>
    </div>
  </div>
`;

const renderAlbumCard = (album) => {
  const albumSlug = album.slug || album._id || album.id || "";
  return `
  <div data-album-slug="${albumSlug}" 
    class="min-w-[calc(20%-0.75rem)] flex flex-col gap-2 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02]">
    <img class="w-full h-80 object-cover rounded-lg" 
      src="${getImageUrl(album)}" 
      alt="album"
      onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
    <div class="flex flex-col gap-2">
      <h5 class="text-white text-base font-semibold leading-tight truncate">
        ${album.name || album.title || "Không có tiêu đề"}
      </h5>
      <p class="text-white/50 text-xs leading-tight truncate">${
        album.albumType || getArtistName(album)
      }</p>
    </div>
  </div>
`;
};

async function Home() {
  const chevronBackIcon = Icons.chevronBack();
  const navigateNextIcon = Icons.navigateNext();
  const userName = getCurrentUser()?.name || "Bạn";
  const authenticated = isAuthenticated();

  const [personalized, exploreAlbums, moods, linesData] = await Promise.all([
    getPersonalized(48),
    getExploreAlbums(20),
    getMoods(20),
    getLines(100),
  ]);

  const personalizedData =
    personalized && personalized.error ? { items: [] } : personalized;
  const albums = extractItems(exploreAlbums);
  const moodsList = extractItems(moods);
  const linesList = extractItems(linesData);

  let selectedLine = null;
  let songs = [];
  let videos = [];

  if (linesList.length > 0) {
    selectedLine = linesList[0];
    const allLinesSongsPromises = linesList.map((line) => {
      if (line.slug) {
        return getLineSongs(line.slug, 200, "-popularity").catch(() => ({
          items: [],
        }));
      }
      return Promise.resolve({ items: [] });
    });
    const allLinesSongsResults = await Promise.all(allLinesSongsPromises);
    const songMap = new Map();
    allLinesSongsResults.forEach((result) => {
      if (result && !result.error) {
        const items = extractItems(result);
        items.forEach((song) => {
          const songId =
            song._id ||
            song.id ||
            song.videoId ||
            `${song.name || song.title || ""}_${
              song.albumName || song.album || ""
            }`;
          if (songId && !songMap.has(songId)) {
            songMap.set(songId, song);
          }
        });
      }
    });
    songs = Array.from(songMap.values());

    const allLinesVideosPromises = linesList.map((line) => {
      if (line.slug) {
        return getLineVideos(line.slug, 200, "-popularity").catch(() => ({
          items: [],
        }));
      }
      return Promise.resolve({ items: [] });
    });
    const allLinesVideosResults = await Promise.all(allLinesVideosPromises);
    const videoMap = new Map();
    allLinesVideosResults.forEach((result) => {
      if (result && !result.error) {
        const items = extractItems(result);
        items.forEach((video) => {
          const videoId = video.id || video._id || video.videoId || video.slug;
          if (videoId && !videoMap.has(videoId)) {
            videoMap.set(videoId, video);
          }
        });
      }
    });
    videos = Array.from(videoMap.values());
  }

  if (songs.length === 0) {
    songs = extractItems(personalizedData);
  }

  if (songs.length === 0 && videos.length === 0 && albums.length === 0) {
    return `
      <section class="w-full flex flex-col justify-center items-center gap-5 py-20">
        <div class="text-white text-center">
          <p class="text-xl mb-4">Đang tải dữ liệu...</p>
          <p class="text-white/50 text-sm">Nếu không có dữ liệu, vui lòng đăng nhập để xem nội dung cá nhân hóa</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="w-full flex flex-col justify-center items-center gap-5">
    <div class="w-full flex flex-col justify-center items-center gap-5">
      <div class="w-full flex flex-col justify-center items-center">
        <div class="w-[80%] flex justify-start items-center flex-nowrap gap-2 overflow-x-auto horizontal-scrollbar pb-2">
          ${moodsList
            .map(
              (mood) => `
            <button data-mood-slug="${mood.slug || mood._id || ""}"
              class="mood-btn px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">
              ${mood.title || mood.name || "Mood"}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
      <!-- button view all -->

      ${
        authenticated
          ? `
      <div class="w-[80%] flex items-center gap-4">
        <div class="flex-1 flex flex-col justify-start items-start">
          <p class="text-sm text-white/50 mb-2">NHỮNG BÁN NHẠC GIÚP BẠN LÀM QUEN</p>
          <div class="flex w-full items-center justify-between">
            <h3 class="text-2xl font-bold text-white">Chào mừng ${userName}</h3>
            <div class="flex items-center gap-5">
              <button class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                Phát tất cả
              </button>
              <div class="gap-2 flex items-center">
                <button id="songs-scroll-prev" class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                  ${chevronBackIcon}
                </button>
                <button id="songs-scroll-next" class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                  ${navigateNextIcon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[80%]">
        <div id="songs-scroll-container" class="flex gap-6 overflow-x-auto horizontal-scrollbar pb-2 overflow-y-visible">
          ${
            songs.length > 0
              ? Array.from(
                  {
                    length: Math.min(
                      12,
                      Math.max(1, Math.ceil(songs.length / 4))
                    ),
                  },
                  (_, colIndex) => {
                    const startIndex = colIndex * 4;
                    return `
                  <div class="flex flex-col gap-4 min-w-[calc(33.333%-0.5rem)] ${
                    colIndex === 0 ? "pl-2" : ""
                  }">
                    ${songs
                      .slice(startIndex, startIndex + 4)
                      .map(renderSongCard)
                      .join("")}
                  </div>
                `;
                  }
                ).join("")
              : '<div class="col-span-3 text-white/50 text-center py-10">Không có bài hát nào</div>'
          }
        </div>
      </div>
      `
          : ""
      }
      <!-- end item songs -->

      <div class="w-[80%] flex items-center gap-4">
        <div class="flex-1 flex flex-col justify-start items-start">
          <div class="flex w-full items-center justify-between">
            <h3 class="text-4xl uppercase font-bold text-white">Video nhạc cho bạn</h3>
            <div class="flex items-center gap-5">
              <button class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                Phát tất cả
              </button>
              <div class="gap-2 flex items-center">
                <button id="videos-scroll-prev" class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                  ${chevronBackIcon}
                </button>
                <button id="videos-scroll-next" class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                  ${navigateNextIcon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[80%]">
        <div id="videos-scroll-container" class="flex gap-4 overflow-x-auto horizontal-scrollbar pb-2">
          ${
            videos.length > 0
              ? videos.slice(0, 8).map(renderVideoCard).join("")
              : '<div class="text-white/50 text-center py-10 w-full">Không có video nào</div>'
          }
        </div>
      </div>

      <!-- end item videos -->

      <div class="w-[80%] flex items-center gap-4">
        <div class="flex-1 flex flex-col justify-start items-start">
          <div class="flex w-full items-center justify-between">
            <h3 class="text-4xl uppercase font-bold text-white">Đĩa nhạc cho bạn</h3>
            <div class="gap-2 flex items-center">
              <button id="albums-scroll-prev" class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                ${chevronBackIcon}
              </button>
              <button id="albums-scroll-next" class="px-1 py-1 rounded-full bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">
                ${navigateNextIcon}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[80%]">
        <div id="albums-scroll-container" class="flex gap-4 overflow-x-auto horizontal-scrollbar pb-2">
          ${
            albums.length > 0
              ? albums.slice(0, 8).map(renderAlbumCard).join("")
              : '<div class="text-white/50 text-center py-10 w-full">Không có album nào</div>'
          }
        </div>
      </div>

      <!-- end item albums -->

    </div>
  </section>
    `;
}

export default Home;
