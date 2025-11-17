import { Icons } from "../utils/Icons";
import { fetchSongs } from "../utils/Request";

async function Header() {
  const searchIcon = Icons.search();
  const chromecastIcon = Icons.chromecast();
  const profileIcon = Icons.profile();
  const barsIcon = Icons.bars();
  const songs = await fetchSongs();
  const avatarImg = songs[0]?.img || "/src/assets/images/git.jpg";

  return `
  <header id="header"
    class="fixed top-0 left-0 right-0 z-50 w-full h-16 flex items-center justify-between text-white bg-transparent">
    <div class="w-[230px] h-full flex justify-start items-center bg-black">
      <div id="logo-container" data-route="home" class="px-5 flex gap-8 justify-start items-center cursor-pointer">
        <div class="cursor-pointer">${barsIcon}</div>
        <img src="/src/assets/images/logo.svg" alt="logo" class="logo cursor-pointer">
      </div>
    </div>
    <div class="w-[calc(100%-230px)] h-full pl-[9.5%] flex justify-start items-center bg-transparent">
      <div class="w-full flex justify-start items-center relative">
        <div
          class="flex items-center border border-white/20 rounded-lg w-1/2 bg-[#d1cfcf17] shadow-2xl overflow-visible relative">
          <label for="search" class="mx-2 p-2 rounded-lg cursor-pointer">
            ${searchIcon}
          </label>
          <input id="search" type="text"
            class="search outline-none w-full bg-transparent text-white placeholder-white/40 px-3 py-2 z-10"
            placeholder="Tìm bài hát, đĩa nhạc, nghệ sĩ, podcast">
          <div id="search-results" class="absolute top-full left-0 right-0 mt-2 bg-[#212121] rounded-lg shadow-2xl max-h-96 overflow-y-auto hidden border border-white/10">
            <!-- Kết quả tìm kiếm sẽ được hiển thị ở đây -->
          </div>
        </div>
      </div>
      <div class="w-1/2 gap-8 flex justify-center items-center">
        <div class="cursor-pointer">${chromecastIcon}</div>
        <div class="cursor-pointer">
          <img src="${avatarImg}" alt="avatar" class="w-10 h-10 rounded-full object-cover">
        </div>
      </div>
    </div>
  </header>
    `;
}

export default Header;
