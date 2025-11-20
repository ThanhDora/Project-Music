import { Icons } from "../utils/Icons";
import { getVideoDetails, trackPlayEvent } from "../utils/Request";
import { getImageUrl, getArtistName } from "../utils/helpers";

async function VideoDetails(videoId) {
  if (!videoId) {
    return `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Không tìm thấy video</p></div>`;
  }

  const playIcon = Icons.play();
  const likeIcon = Icons.like();
  const threeDotsVerticalIcon = Icons.threeDotsVertical();
  
  const video = await getVideoDetails(videoId);
  
  if (!video) {
    return `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Không tìm thấy video</p></div>`;
  }

  const relatedVideos = video.relatedVideos || video.similarVideos || [];

  return `
    <section class="w-full flex flex-col items-center py-5">
      <div class="w-[80%] flex flex-col gap-6">
        <div class="flex gap-6">
          <div class="flex-1">
            <div class="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <img src="${getImageUrl(video)}" 
                alt="video" class="w-full h-full object-cover"
                onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
            </div>
          </div>
          
          <div class="w-80 flex flex-col gap-4">
            <div>
              <h1 class="text-2xl font-bold text-white mb-2">${video.title || video.name}</h1>
              <p class="text-white/70">${getArtistName(video)}</p>
              <p class="text-white/50 text-sm mt-2">${video.views || ""} lượt xem</p>
            </div>
            
            <div class="flex items-center gap-4">
              <button id="play-video-btn" class="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2">
                ${playIcon} Phát
              </button>
              <button class="p-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                ${likeIcon}
              </button>
              <button class="p-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                ${threeDotsVerticalIcon}
              </button>
            </div>
          </div>
        </div>

        ${relatedVideos.length > 0 ? `
          <div class="mt-8">
            <h2 class="text-2xl font-bold text-white mb-4">Video liên quan</h2>
            <div class="grid grid-cols-4 gap-4">
              ${relatedVideos.map((related) => `
                <div class="flex flex-col gap-2 cursor-pointer group rounded-lg p-2 transition-all duration-200 hover:rounded-xl hover:bg-[#ffffff17] hover:scale-[1.02]">
                  <img src="${getImageUrl(related)}" 
                    alt="video" class="w-full aspect-video object-cover rounded-lg"
                    onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                  <div class="flex flex-col gap-1">
                    <h5 class="text-white text-sm font-semibold leading-tight truncate">${related.title || related.name}</h5>
                    <p class="text-white/50 text-xs truncate">${getArtistName(related)}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

export default VideoDetails;

