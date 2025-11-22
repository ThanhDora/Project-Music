import { Icons } from "../utils/Icons";
import { fetchSongs } from "../utils/Request";
import { getImageUrl, getArtistName } from "../utils/helpers";
import config from "../config.json";

const API_BASE_URL = config.API_URL || "https://youtube-music.f8team.dev/api";

async function Footer(song = null) {
  const playIcon = Icons.play();
  const pauseIcon = Icons.pause();
  const volumeIcon = Icons.volumeHigh();
  const volumeOffIcon = Icons.volumeOff();
  const dislikeIcon = Icons.dislike();
  const likeIcon = Icons.like();
  const threeDotsIcon = Icons.threeDotsVertical();
  const shuffleIcon = Icons.shuffle();
  const repeatIcon = Icons.repeat1();
  const prevIcon = Icons.playSkipBack();
  const nextIcon = Icons.playSkipForward();
  const castIcon = Icons.chromecast();
  const minimizeIcon = Icons.chevronDown();

  let currentSong = song;

  // Try to get from localStorage first
  if (!currentSong) {
    const storedSong = localStorage.getItem("currentPlayingSong");
    if (storedSong) {
      try {
        currentSong = JSON.parse(storedSong);
      } catch (e) {
        currentSong = null;
      }
    }
  }

  // Fallback to API
  if (!currentSong || !currentSong.title) {
    let songs = [];
    try {
      songs = await fetchSongs();
    } catch (error) {
      songs = [];
    }
    currentSong = songs[0] || {};
  }

  // Store current song in localStorage
  if (currentSong && currentSong.title) {
    localStorage.setItem("currentPlayingSong", JSON.stringify(currentSong));
  }

  // Use audioUrl from API response
  let audioUrl =
    currentSong.audioUrl || currentSong.audio || currentSong.streamUrl || "";

  const songTitle = (
    currentSong.title ||
    currentSong.name ||
    "Chưa chọn bài hát"
  ).toUpperCase();
  const artistName = getArtistName(currentSong) || "Various Artists";

  return `
    <footer class="w-full h-[8%] fixed bottom-0 left-0 right-0 bg-[#212121] z-40 flex flex-col">
      <!-- Audio Progress Bar - Full Width at Top -->
      <div class="w-full relative h-1 group">
        <div class="absolute top-0 left-0 w-full h-full bg-white/10">
          <div id="audio-progress-bar" class="h-full bg-white transition-all" style="width: 0%"></div>
        </div>
        <input type="range" id="audio-progress" min="0" max="100" value="0" 
          class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10">
      </div>

      <!-- Main Footer Content -->
      <div class="h-full w-full px-6 py-3 flex items-center justify-between gap-6 flex-1">
        <!-- Left: Previous, Play, Time -->
        <div class="flex items-center gap-4 shrink-0">
          <button id="audio-prev-btn" class="text-white hover:text-white/80 transition-colors">
            ${prevIcon}
          </button>
          <button id="audio-play-pause-btn" class="text-white hover:text-white/80 transition-colors cursor-pointer z-50 relative" style="pointer-events: auto;">
            ${playIcon}
          </button>
          <button id="audio-next-btn" class="text-white hover:text-white/80 transition-colors">
            ${nextIcon}
          </button>
          <div class="flex items-center gap-1 text-white text-sm">
            <span id="audio-current-time">0:00</span>
            <span class="text-white/50">/</span>
            <span id="audio-duration">0:00</span>
          </div>
        </div>

        <!-- Center: Album Art, Song Info (Vertical Layout) -->
        <div class="flex items-center gap-1 justify-center min-w-0 max-w-[400px] mx-auto">
          <img src="${getImageUrl(currentSong)}" 
            alt="song" 
            class="w-14 h-14 rounded object-cover shrink-0"
            onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
          <div class="flex flex-col min-w-0 w-full">
            <h5 class="text-white text-xs font-bold truncate w-full">${songTitle}</h5>
            <p class="text-white/60 text-[10px] truncate w-full">${artistName}</p>
          </div>
        </div>

        <!-- Right: Dislike, Like, More Options, Volume, Cast, Shuffle, Repeat, Minimize -->
        <div class="flex items-center gap-3 shrink-0">
          <button id="audio-dislike-btn" class="text-white hover:text-white/80 transition-colors">
            ${dislikeIcon}
          </button>
          <button id="audio-like-btn" class="text-white hover:text-white/80 transition-colors">
            ${likeIcon}
          </button>
          <button id="audio-more-options-btn" class="text-white hover:text-white/80 transition-colors">
            ${threeDotsIcon}
          </button>
          <button id="audio-volume-btn" class="text-white hover:text-white/80 transition-colors relative group">
            ${volumeIcon}
            <!-- Volume Slider Tooltip -->
            <div id="audio-volume-container" class="hidden absolute bottom-full right-0 mb-2 bg-[#2a2a2a] p-3 rounded-lg group-hover:block">
              <input type="range" id="audio-volume" min="0" max="100" value="70" 
                class="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer audio-slider">
            </div>
          </button>
          <button id="audio-cast-btn" class="text-white hover:text-white/80 transition-colors">
            ${castIcon}
          </button>
          <button id="audio-shuffle-btn" class="text-white hover:text-white/80 transition-colors">
            ${shuffleIcon}
          </button>
          <button id="audio-repeat-btn" class="text-white hover:text-white/80 transition-colors">
            ${repeatIcon}
          </button>
          <button id="audio-minimize-btn" class="text-white hover:text-white/80 transition-colors">
            ${minimizeIcon}
          </button>
        </div>
      </div>

      <audio id="audio-element" preload="auto" style="display: none;">
        Your browser does not support the audio element.
      </audio>
    </footer>
  `;
}

export default Footer;
