import { Icons } from "../utils/Icons";

function Sidebar() {
  const homeIcon = Icons.home();
  const safariIcon = Icons.safari();
  const bookmarkIcon = Icons.bookmark();
  const upgradeIcon = Icons.upgrade();
  const addIcon = Icons.add();
  const pinIcon = Icons.pin();

  return `
    <aside class="fixed top-16 left-0 bottom-0 w-[230px] bg-[#110f12] overflow-y-auto">
    <!-- menu items -->
      <div class="text-white p-4">
      <div class="flex items-center gap-4 cursor-pointer px-2 py-2 hover:bg-[#ffffff4f] rounded-lg active"><div>${homeIcon}</div> Trang chủ</div>
      <div class="flex items-center gap-4 cursor-pointer px-2 py-2 hover:bg-[#ffffff4f] rounded-lg"><div>${safariIcon}</div> Khám phá</div>
      <div class="flex items-center gap-4 cursor-pointer px-2 py-2 hover:bg-[#ffffff4f] rounded-lg"><div>${bookmarkIcon}</div> Đã thích</div>
      <div class="flex items-center gap-4 cursor-pointer px-2 py-2 hover:bg-[#ffffff4f] rounded-lg"><div>${upgradeIcon}</div> Nâng cấp</div>
      </div>
       <hr class="border-white/20">
      <!-- new releases -->
       <div class="p-4">
       <div class="flex items-center gap-2 cursor-pointer px-2 py-2 rounded-full border-white/20 bg-[#ffffff17] hover:bg-[#ffffff4f]">
        <div>${addIcon}</div> <span class="text-white">Tạo playlist mới</span>
        </div>
        <div class="mt-4 px-2 py-5">
        <div class="text-xl text-white">Nhạc đã thích</div>
        <div class="flex items-center text-sm">
        <span>${pinIcon}</span> <span class="text-white/50 font-medium">Danh sách tự động</span>
        </div>
        <div class="mt-4 py-5">
        <div class="text-white text-xl">Tập podcast để thưởng thức ...</div>
        <span class="text-white/50 font-medium">Danh sách tự động</span>
        </div>
        </div>
      </div>
    </aside>
    `;
}

export default Sidebar;
