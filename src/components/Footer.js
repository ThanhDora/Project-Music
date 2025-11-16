import { Icons } from "../utils/Icons";
import { fetchSongs } from "../utils/Request";

async function Footer() {
  const playIcon = Icons.play();
  const playSkipBackIcon = Icons.playSkipBack();
  const playSkipForwardIcon = Icons.playSkipForward();
  const dislikeIcon = Icons.dislike();
  const likeIcon = Icons.like();
  const threeDotsVerticalIcon = Icons.threeDotsVertical();
  const volumeHighIcon = Icons.volumeHigh();
  const volumeOffIcon = Icons.volumeOff();
  const repeat1Icon = Icons.repeat1();
  const shuffleIcon = Icons.shuffle();
  const playSharpIcon = Icons.playSharp();
  const sliderIcon = Icons.slider();
  const songs = await fetchSongs();

  return `
    <footer class="w-full h-[8%] fixed bottom-0 left-0 right-0 bg-[#212121]">
    <div></div>
    <div class="h-full w-full px-5 flex items-center justify-between">
      <!-- player controls -->
      <div class="flex justify-center items-center gap-10">
        <div class="flex justify-center items-center gap-10">
          <button>${playSkipBackIcon}</button>
          <button>${playIcon}</button>
          <button>${playSkipForwardIcon}</button>
        </div>
        <div class="text-white/50 text-sm">
          <span>00:00</span>
        </div>
      </div>
      <!-- player play/pause -->
      <div class="flex justify-center items-center gap-5">
        <div>
          <img src="${
            songs[0].img || "/src/assets/images/git.jpg"
          }" alt="album" class="w-15 h-15 rounded-lg">
        </div>
        <div>
          <h5 class="text-white text-sm truncate">${songs[0].title}</h5>
          <p class="text-white/50 text-sm truncate">${songs[0].artist}</p>
        </div>
        <div class="flex justify-center items-center gap-10">
          <button>${dislikeIcon}</button>
          <button>${likeIcon}</button>
          <button>${threeDotsVerticalIcon}</button>
        </div>
      </div>
      <!-- main -->
      <div class="flex justify-center items-center gap-10">
        <div>${sliderIcon}</div>
        <div class="flex justify-center items-center gap-10">
        <button>${volumeHighIcon}</button>
        <button>${repeat1Icon}</button>
        <button>${shuffleIcon}</button>
        </div>
        <div class="cursor-pointer rotate-90">${playSharpIcon}</div>
      </div>
      <!-- volume -->
    </div>
  </footer>
    `;
}

export default Footer;
