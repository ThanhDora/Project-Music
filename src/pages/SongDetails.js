import { Icons } from "../utils/Icons";
import {
  getSongDetails,
  trackPlayEvent,
  fetchSongs,
  searchSongs,
} from "../utils/Request";
import { getImageUrl, getArtistName } from "../utils/helpers";

async function SongDetails(songId) {
  if (!songId) {
    return `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Không tìm thấy bài hát</p></div>`;
  }

  const playIcon = Icons.play();
  const pauseIcon = Icons.pause();
  const likeIcon = Icons.like();
  const addIcon = Icons.add();

  try {
    console.log("Loading song details for ID:", songId);
    let song = await getSongDetails(songId);
    console.log("Song details received:", song);

    if (!song || (song && song.error)) {
      const fallbackData = sessionStorage.getItem("currentSongData");
      if (fallbackData) {
        try {
          song = JSON.parse(fallbackData);
          console.log("Using fallback song data:", song);
          sessionStorage.removeItem("currentSongData");
        } catch (e) {
          console.warn("Failed to parse fallback data:", e);
        }
      }
    }

    if (!song || (song && song.error)) {
      // Try to get from localStorage as fallback
      const storedSong = localStorage.getItem("currentPlayingSong");
      if (storedSong) {
        try {
          const parsedSong = JSON.parse(storedSong);
          const storedSongId =
            parsedSong._id || parsedSong.id || parsedSong.videoId;
          if (storedSongId === songId) {
            song = parsedSong;
          }
        } catch (e) {
          console.warn("Failed to parse stored song:", e);
        }
      }
    }

    if (!song || (song && song.error)) {
      const errorMsg =
        song && song.error ? song.error : "Không tìm thấy bài hát";
      return `<div class="w-full flex items-center justify-center py-20">
        <div class="text-white text-center">
          <p class="text-xl mb-2">${errorMsg}</p>
          <p class="text-white/50 text-sm">ID: ${songId}</p>
          <p class="text-white/40 text-xs mt-2">Vui lòng thử lại hoặc chọn bài hát khác</p>
        </div>
      </div>`;
    }

    localStorage.setItem("currentPlayingSong", JSON.stringify(song));

    const relatedSongs =
      song.related || song.relatedSongs || song.similarSongs || [];
    const description = song.description || song.about || "";
    const lyrics = song.lyrics || "";
    const songTitle = song.title || song.name || "Không có tiêu đề";
    const artistName = getArtistName(song) || "";

    const formatDuration = (seconds) => {
      if (!seconds) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    let nextSongs = [];
    let allAlbumTracks = [];
    if (song.album && song.album.tracks && Array.isArray(song.album.tracks)) {
      allAlbumTracks = song.album.tracks;
      nextSongs = song.album.tracks
        .filter((track) => {
          if (!track) return false;
          const trackId = track.id || track._id || "";
          return trackId && trackId !== songId;
        })
        .slice(0, 50);
    }

    if (
      nextSongs.length === 0 &&
      song.playlists &&
      Array.isArray(song.playlists) &&
      song.playlists.length > 0
    ) {
      const playlistTracks = song.playlists[0].tracks || [];
      if (Array.isArray(playlistTracks) && playlistTracks.length > 0) {
        nextSongs = playlistTracks
          .filter((track) => {
            if (!track) return false;
            const trackId = track.id || track._id || "";
            return trackId && trackId !== songId;
          })
          .slice(0, 50);
      }
    }

    return `
    <section class="w-full h-full flex">
      <!-- Left Side: Album Art & Song Info -->
      <div class="w-1/2 h-full relative overflow-hidden">
        <img src="${getImageUrl(song)}" 
          alt="song" 
          class="w-full h-full object-cover"
          onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
          <div class="text-white">
            <h1 class="text-5xl font-bold mb-4 leading-tight">${songTitle}</h1>
            ${
              description
                ? `<p class="text-xl mb-6 text-white/90">${description}</p>`
                : ""
            }
            <p class="text-2xl font-bold">${artistName}</p>
          </div>
        </div>
      </div>

      <!-- Right Side: Tabs & Song List -->
      <div class="w-1/2 h-full bg-[#121212] flex flex-col overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-white/10 px-6">
          <button id="tab-next" class="px-6 py-4 text-white font-semibold border-b-2 border-white pb-4">
            TIẾP THEO
          </button>
          <button id="tab-lyrics" class="px-6 py-4 text-white/50 font-semibold border-b-2 border-transparent pb-4">
            LỜI NHẠC
          </button>
          <button id="tab-related" class="px-6 py-4 text-white/50 font-semibold border-b-2 border-transparent pb-4">
            LIÊN QUAN
          </button>
        </div>

        <!-- Now Playing Info -->
        <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div class="text-white/70 text-sm">
            Đang phát từ <span class="text-white font-semibold">Đài ${songTitle}</span>
          </div>
          <button class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors">
            ${addIcon}
            <span>Lưu</span>
          </button>
        </div>

        <!-- Filter Buttons -->
        <div class="px-6 py-4 border-b border-white/10 flex gap-4 overflow-x-auto">
          <button class="filter-btn active px-4 py-2 text-sm font-semibold text-white border-b-2 border-white whitespace-nowrap">
            All
          </button>
          <button class="filter-btn px-4 py-2 text-sm font-semibold text-white/50 border-b-2 border-transparent hover:text-white transition-colors whitespace-nowrap">
            Quen thuộc
          </button>
          <button class="filter-btn px-4 py-2 text-sm font-semibold text-white/50 border-b-2 border-transparent hover:text-white transition-colors whitespace-nowrap">
            Khám phá
          </button>
          <button class="filter-btn px-4 py-2 text-sm font-semibold text-white/50 border-b-2 border-transparent hover:text-white transition-colors whitespace-nowrap">
            Đình đám
          </button>
        </div>

        <!-- Song List Container -->
        <div id="song-list-container" class="flex-1 overflow-y-auto px-6 py-4">
          <!-- Currently Playing Song -->
          <div class="song-item current-song flex items-center gap-4 p-3 rounded-lg bg-white/10 mb-2" data-song-id="${songId}">
            <div class="flex-shrink-0 w-10 flex items-center justify-center">
              ${playIcon}
            </div>
            <div class="flex-1 min-w-0">
              <h5 class="text-white font-semibold truncate">${songTitle}</h5>
              <p class="text-white/60 text-sm truncate">${artistName}</p>
            </div>
            <div class="flex-shrink-0 text-white/60 text-sm">
              ${formatDuration(song.duration || song.length)}
            </div>
          </div>

          <!-- Next Songs List from API -->
          ${
            nextSongs.length > 0
              ? nextSongs
                  .map((nextSong) => {
                    const nextSongId =
                      nextSong._id || nextSong.id || nextSong.videoId || "";
                    const nextTitle =
                      nextSong.title || nextSong.name || "Không có tiêu đề";
                    const nextArtist = getArtistName(nextSong) || "";
                    const nextDuration = formatDuration(
                      nextSong.duration || nextSong.length
                    );

                    return `
              <div class="song-item flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" data-song-id="${nextSongId}">
                <img src="${getImageUrl(nextSong)}" 
                  alt="song" 
                  class="w-10 h-10 rounded object-cover shrink-0"
                  onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                <div class="flex-1 min-w-0">
                  <h5 class="text-white font-medium truncate">${nextTitle}</h5>
                  <p class="text-white/60 text-sm truncate">${nextArtist}</p>
                </div>
                <div class="flex-shrink-0 text-white/60 text-sm">
                  ${nextDuration}
                </div>
              </div>
            `;
                  })
                  .join("")
              : allAlbumTracks.length > 0
              ? allAlbumTracks
                  .map((track) => {
                    const trackId = track.id || track._id || "";
                    const trackTitle =
                      track.title || track.name || "Không có tiêu đề";
                    const trackDuration = formatDuration(
                      track.duration || track.length
                    );
                    const isCurrent = trackId === songId;

                    return `
              <div class="song-item flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ${
                isCurrent ? "bg-white/10" : ""
              }" data-song-id="${trackId}">
                <img src="${getImageUrl(track)}" 
                  alt="song" 
                  class="w-10 h-10 rounded object-cover shrink-0"
                  onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                <div class="flex-1 min-w-0">
                  <h5 class="text-white font-medium truncate ${
                    isCurrent ? "font-semibold" : ""
                  }">${trackTitle}</h5>
                  <p class="text-white/60 text-sm truncate">${
                    getArtistName(track) || ""
                  }</p>
                </div>
                <div class="shrink-0 text-white/60 text-sm">
                  ${trackDuration}
                </div>
              </div>
            `;
                  })
                  .join("")
              : `
            <div class="text-white/50 text-center py-10">
              <p>Không có bài hát</p>
            </div>
          `
          }
        </div>

        <!-- Lyrics Container (Hidden by default) -->
        <div id="lyrics-container" class="hidden flex-1 overflow-y-auto px-6 py-4">
          ${
            lyrics
              ? `
            <div class="text-white whitespace-pre-wrap leading-relaxed">${lyrics}</div>
          `
              : `
            <div class="text-white/50 text-center py-10">
              <p>Chưa có lời bài hát</p>
            </div>
          `
          }
        </div>

        <!-- Related Container (Hidden by default) -->
        <div id="related-container" class="hidden flex-1 overflow-y-auto px-6 py-4">
          ${
            relatedSongs.length > 0
              ? relatedSongs
                  .map((related) => {
                    const relatedSongId =
                      related._id || related.id || related.videoId || "";
                    const relatedTitle =
                      related.title || related.name || "Không có tiêu đề";
                    const relatedArtist = getArtistName(related) || "";
                    const relatedDuration = formatDuration(
                      related.duration || related.length
                    );

                    return `
              <div class="song-item flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" data-song-id="${relatedSongId}">
                <img src="${getImageUrl(related)}" 
                  alt="song" 
                  class="w-14 h-14 rounded object-cover shrink-0"
                  onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                <div class="flex-1 min-w-0">
                  <h5 class="text-white font-semibold truncate">${relatedTitle}</h5>
                  <p class="text-white/60 text-sm truncate">${relatedArtist}</p>
                </div>
                <div class="flex-shrink-0 text-white/60 text-sm">
                  ${relatedDuration}
                </div>
              </div>
            `;
                  })
                  .join("")
              : `
            <div class="text-white/50 text-center py-10">
              <p>Không có bài hát liên quan</p>
            </div>
          `
          }
        </div>
      </div>
    </section>
  `;
  } catch (error) {
    console.error("Error loading song details:", error);
    return `<div class="w-full flex items-center justify-center py-20">
      <div class="text-white text-center">
        <p class="text-xl mb-2">Có lỗi xảy ra khi tải thông tin bài hát</p>
        <p class="text-white/50 text-sm">${error.message || ""}</p>
      </div>
    </div>`;
  }
}

export default SongDetails;
