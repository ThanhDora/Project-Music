import { Icons } from "../utils/Icons";
function Footer() {
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
      <div class="flex justify-center items-center gap-10">
        <div>
          <img src="/src/assets/images/git.jpg" alt="album" class="w-10 h-10 rounded-lg">
        </div>
        <div>
          <h5 class="text-white text-sm">Song Name</h5>
          <p class="text-white/50 text-sm">Artist Name</p>
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
