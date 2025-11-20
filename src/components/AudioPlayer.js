import { Icons } from "../utils/Icons";

function AudioPlayer(song) {
  if (!song) return "";

  const playIcon = Icons.play();
  const pauseIcon = Icons.pause();
  const volumeIcon = Icons.volumeHigh();
  const volumeOffIcon = Icons.volumeOff();

  // Get audio URL from song object
  const audioUrl = song.audioUrl || song.audio || song.streamUrl || song.url || song.source || "";
  
  return `
    <div id="audio-player-container" class="fixed bottom-[8%] left-[230px] right-0 bg-[#181818] border-t border-white/10 px-6 py-4 z-40">
      <div class="flex items-center gap-4">
        <!-- Song Info -->
        <div class="flex items-center gap-3 min-w-[200px] flex-1">
          <img src="${song.thumbnail || song.image || song.img || '/src/assets/images/git.jpg'}" 
            alt="song" 
            class="w-14 h-14 rounded object-cover"
            onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
          <div class="flex flex-col min-w-0">
            <h5 class="text-white text-sm font-semibold truncate">${song.title || song.name || "Unknown"}</h5>
            <p class="text-white/60 text-xs truncate">${song.artist || song.artists?.map(a => a.name || a).join(", ") || "Unknown"}</p>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="flex flex-col items-center gap-2 flex-1 max-w-[600px]">
          <div class="flex items-center justify-center gap-4">
            <button id="audio-shuffle-btn" class="text-white/70 hover:text-white transition-colors p-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg>
            </button>
            <button id="audio-prev-btn" class="text-white/70 hover:text-white transition-colors p-2">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
            </button>
            <button id="audio-play-pause-btn" class="bg-white text-black rounded-full p-3 hover:scale-110 transition-transform">
              ${playIcon}
            </button>
            <button id="audio-next-btn" class="text-white/70 hover:text-white transition-colors p-2">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
            </button>
            <button id="audio-repeat-btn" class="text-white/70 hover:text-white transition-colors p-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg>
            </button>
          </div>
          
          <div class="flex items-center gap-2 w-full">
            <span id="audio-current-time" class="text-white/70 text-xs w-12 text-right">0:00</span>
            <div class="flex-1 relative">
              <input type="range" id="audio-progress" min="0" max="100" value="0" 
                class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer audio-slider">
              <div id="audio-progress-bar" class="absolute top-0 left-0 h-1 bg-white rounded-lg" style="width: 0%"></div>
            </div>
            <span id="audio-duration" class="text-white/70 text-xs w-12">0:00</span>
          </div>
        </div>

        <!-- Volume Control -->
        <div class="flex items-center gap-2 min-w-[150px] justify-end">
          <button id="audio-volume-btn" class="text-white/70 hover:text-white transition-colors p-2">
            ${volumeIcon}
          </button>
          <div class="flex-1 relative">
            <input type="range" id="audio-volume" min="0" max="100" value="70" 
              class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer audio-slider">
          </div>
        </div>
      </div>

      <audio id="audio-element" preload="metadata" style="display: none;">
        ${audioUrl ? `<source src="${audioUrl}" type="audio/mpeg">` : ""}
        Your browser does not support the audio element.
      </audio>
    </div>
  `;
}

export default AudioPlayer;

