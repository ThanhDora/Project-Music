import { Icons } from "../utils/Icons";
import { getSongDetails, trackPlayEvent, getPlaylists } from "../utils/Request";
import { getImageUrl, getArtistName } from "../utils/helpers";

async function SongDetails(songId) {
  if (!songId) {
    return `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Không tìm thấy bài hát</p></div>`;
  }

  const playIcon = Icons.play();
  const likeIcon = Icons.like();
  const threeDotsVerticalIcon = Icons.threeDotsVertical();
  const addIcon = Icons.add();
  const shareIcon = Icons.share || (() => `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>`);

  try {
    console.log("Loading song details for ID:", songId);
    let song = await getSongDetails(songId);
    console.log("Song details received:", song);

    // If API returns error, try to use fallback data from sessionStorage
    if (!song || (song && song.error)) {
      const fallbackData = sessionStorage.getItem("currentSongData");
      if (fallbackData) {
        try {
          song = JSON.parse(fallbackData);
          console.log("Using fallback song data:", song);
          // Clear the fallback data after use
          sessionStorage.removeItem("currentSongData");
        } catch (e) {
          console.warn("Failed to parse fallback data:", e);
        }
      }
    }

    if (!song || (song && song.error)) {
      const errorMsg = song && song.error ? song.error : "Không tìm thấy bài hát";
      return `<div class="w-full flex items-center justify-center py-20">
        <div class="text-white text-center">
          <p class="text-xl mb-2">${errorMsg}</p>
          <p class="text-white/50 text-sm">ID: ${songId}</p>
          <p class="text-white/40 text-xs mt-2">Vui lòng thử lại hoặc chọn bài hát khác</p>
        </div>
      </div>`;
    }

    const relatedSongs = song.relatedSongs || song.similarSongs || song.related || [];
    const duration = song.duration || song.length || "";
    const releaseDate = song.releaseDate || song.createdAt || "";
    const genre = song.genre || song.genres?.map(g => g.name || g).join(", ") || "";
    const description = song.description || song.about || "";

    return `
    <section class="w-full flex flex-col items-center py-5">
      <div class="w-[80%] max-w-6xl flex flex-col gap-6" data-current-song-id="${songId}">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-shrink-0">
            <img src="${getImageUrl(song)}" 
              alt="song" class="w-64 h-64 md:w-80 md:h-80 rounded-lg object-cover shadow-2xl"
              onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
          </div>
          
          <div class="flex flex-col justify-end gap-4 flex-1">
            <div>
              <p class="text-white/50 text-sm mb-1">Bài hát</p>
              <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">${
                song.title || song.name || "Không có tiêu đề"
              }</h1>
              <p class="text-white/70 text-lg mb-2">${getArtistName(song)}</p>
              
              <div class="flex flex-wrap items-center gap-4 text-sm text-white/50 mt-4">
                ${song.album ? `<span>Album: <span class="text-white/70">${song.album}</span></span>` : ""}
                ${duration ? `<span>Thời lượng: <span class="text-white/70">${duration}</span></span>` : ""}
                ${releaseDate ? `<span>Phát hành: <span class="text-white/70">${new Date(releaseDate).toLocaleDateString('vi-VN')}</span></span>` : ""}
                ${genre ? `<span>Thể loại: <span class="text-white/70">${genre}</span></span>` : ""}
              </div>
              
              <div class="flex items-center gap-4 mt-2">
                ${song.views || song.plays ? `<span class="text-white/50 text-sm">${song.views || song.plays} lượt nghe</span>` : ""}
              </div>
            </div>
            
            <div class="flex items-center gap-3 flex-wrap">
              <button id="play-song-btn" class="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2">
                ${playIcon} Phát
              </button>
              <button id="like-song-btn" class="p-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                ${likeIcon}
              </button>
              <button id="add-to-playlist-btn" class="p-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors" title="Thêm vào playlist">
                ${addIcon}
              </button>
              <button id="share-song-btn" class="p-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors" title="Chia sẻ">
                ${shareIcon()}
              </button>
              <button id="more-options-btn" class="p-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                ${threeDotsVerticalIcon}
              </button>
            </div>
          </div>
        </div>

        <!-- Description -->
        ${description ? `
        <div class="mt-4">
          <h3 class="text-xl font-bold text-white mb-2">Mô tả</h3>
          <p class="text-white/70 text-sm leading-relaxed">${description}</p>
        </div>
        ` : ""}

        <!-- Related Songs -->
        ${
          relatedSongs.length > 0
            ? `
          <div class="mt-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-white">Bài hát liên quan</h2>
            </div>
            <div class="flex flex-col gap-2">
              ${relatedSongs
                .slice(0, 20)
                .map(
                  (related, index) => `
                <div data-song-id="${related._id || related.id || related.videoId || ""}" class="related-song-item flex items-center gap-4 p-3 hover:bg-[#ffffff17] rounded-lg cursor-pointer transition-colors group">
                  <span class="text-white/50 w-8 text-center group-hover:text-white transition-colors">${
                    index + 1
                  }</span>
                  <img src="${getImageUrl(related)}" 
                    alt="song" class="w-12 h-12 rounded object-cover shrink-0"
                    onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                  <div class="flex-1 min-w-0">
                    <h5 class="text-white font-semibold truncate group-hover:text-white/90">${
                      related.title || related.name || "Không có tiêu đề"
                    }</h5>
                    <p class="text-white/50 text-sm truncate group-hover:text-white/70">${getArtistName(
                      related
                    )}</p>
                  </div>
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white/50 text-xs">${related.duration || related.length || ""}</span>
                    <button class="p-2 hover:bg-white/10 rounded-full transition-colors" data-play-related="${related._id || related.id || related.videoId || ""}">
                      ${playIcon}
                    </button>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    </section>
  `;
  } catch (error) {
    console.error("Error loading song details:", error);
    return `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Có lỗi xảy ra khi tải thông tin bài hát</p></div>`;
  }
}

export default SongDetails;
