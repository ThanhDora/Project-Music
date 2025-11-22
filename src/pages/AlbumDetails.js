import { Icons } from "../utils/Icons";
import { getAlbumDetails } from "../utils/Request";
import { getImageUrl, getArtistName } from "../utils/helpers";

async function AlbumDetails(albumSlug) {
  if (!albumSlug) {
    return `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Không tìm thấy album</p></div>`;
  }

  const playIcon = Icons.play();
  const likeIcon = Icons.like();
  const threeDotsVerticalIcon = Icons.threeDotsVertical();

  try {
    const album = await getAlbumDetails(albumSlug);

    if (!album) {
      return `<div class="w-full flex items-center justify-center py-20">
        <div class="text-white text-center">
          <p class="text-xl mb-2">Không tìm thấy album</p>
          <p class="text-white/50 text-sm">Slug: ${albumSlug}</p>
        </div>
      </div>`;
    }

  const songs = album.songs || album.tracks || [];

  return `
    <section class="w-full flex flex-col items-center py-5">
      <div class="w-[80%] flex flex-col gap-6">
        <div class="flex gap-6">
          <img src="${getImageUrl(album)}" 
            alt="album" class="w-64 h-64 rounded-lg object-cover"
            onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
          
          <div class="flex flex-col justify-end gap-4 flex-1">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">${
                album.title || album.name
              }</h1>
              <p class="text-white/70 text-lg">${getArtistName(album)}</p>
              <p class="text-white/50 text-sm mt-2">${songs.length} bài hát</p>
              <p class="text-white/50 text-sm">${album.releaseDate || ""}</p>
            </div>
            
            <div class="flex items-center gap-4">
              <button id="play-album-btn" class="px-6 py-3 bg-transparent border border-white/30 hover:bg-white/10 transition-colors rounded-full flex items-center gap-2">
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

        ${
          songs.length > 0
            ? `
          <div class="mt-8">
            <h2 class="text-2xl font-bold text-white mb-4">Danh sách bài hát</h2>
            <div class="flex flex-col gap-2">
              ${songs
                .map(
                  (song, index) => `
                <div class="flex items-center gap-4 p-3 hover:bg-[#ffffff17] rounded-lg cursor-pointer transition-colors">
                  <span class="text-white/50 w-8 text-center">${
                    index + 1
                  }</span>
                  <img src="${getImageUrl(song)}" 
                    alt="song" class="w-12 h-12 rounded object-cover"
                    onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
                  <div class="flex-1 min-w-0">
                    <h5 class="text-white font-semibold truncate">${
                      song.title || song.name
                    }</h5>
                    <p class="text-white/50 text-sm truncate">${getArtistName(
                      song
                    )}</p>
                  </div>
                  <p class="text-white/50 text-sm">${song.duration || ""}</p>
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
    return `<div class="w-full flex items-center justify-center py-20">
      <div class="text-white text-center">
        <p class="text-xl mb-2">Có lỗi xảy ra khi tải thông tin album</p>
        <p class="text-white/50 text-sm">${error.message || ""}</p>
      </div>
    </div>`;
  }
}

export default AlbumDetails;
