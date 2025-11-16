import { Icons } from "../utils/Icons";

function Header() {
  const searchIcon = Icons.search();
  const chromecastIcon = Icons.chromecast();
  const profileIcon = Icons.profile();
  const barsIcon = Icons.bars();

  return `
  <header id="header" class="fixed top-0 left-0 right-0 z-50 w-full h-16 flex items-center justify-between text-white bg-transparent">
  <div class="w-[230px] h-full flex justify-start items-center bg-black">
    <div class="px-5 flex gap-8 justify-start items-center-less">
    <div class="cursor-pointer">${barsIcon}</div>
    <img src="/src/assets/images/logo.svg" alt="logo" class="logo cursor-pointer">
    </div>
  </div>
  <div class="w-[calc(100%-230px)] h-full pl-30 flex justify-start items-center bg-transparent">
    <div class="w-full flex justify-start items-center">
      <div class="flex items-center border border-white/20 rounded-lg w-1/2 bg-[#d1cfcf17] shadow-2xl overflow-hidden">
        <label for="search" class="mx-2 p-2 rounded-lg cursor-pointer"> 
    ${searchIcon}
  </label>
  <input id="search" type="text" class="search outline-none w-full bg-transparent text-white placeholder-white/40 px-3 py-2 z-10" placeholder="Tìm bài hát, đĩa nhạc, nghệ sĩ, podcast">
    </div>
    </div>
    <div class="w-1/2 gap-8 flex justify-center items-center">
      <div class="cursor-pointer">${chromecastIcon}</div>
      <div class="cursor-pointer">${profileIcon}</div>
    </div>
  </div>
  </header>
    `;
}

export default Header;
