import { Icons } from "../utils/Icons";

function Lodash() {
  const globeIcon = Icons.globe();
  const chevronDownIcon = Icons.chevronDown();

  return `
    <section class="w-full flex flex-col justify-center items-center py-5">
    <div class="w-full flex flex-wrap justify-start items-center gap-6">
      <div class="w-full flex flex-col justify-center items-center">
        <div
          class="w-[80%] flex justify-start items-center flex-nowrap gap-2 overflow-x-auto horizontal-scrollbar pb-2">
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Danh
            sách phát</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Bài
            hát</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Đĩa
            nhạc</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Nghệ
            sĩ</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Hồ
            sơ</button>
          <button
            class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border-1/2 border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none my-2 whitespace-nowrap">Podcast</button>

        </div>

        <div class="w-[80%]">
          <div class="flex items-center justify-between pt-15 pb-10">
            <h3 class="text-4xl uppercase font-bold text-white">Danh sách phát của tôi</h3>
            <button id="add-playlist-btn"
              class="px-4 py-2 text-sm rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/60 text-white shadow-lg transition duration-200 hover:bg-[#ffffff4f] active:scale-95 select-none cursor-pointer">Tạo playlist mới</button>
          </div>
          
          <div id="playlist-modal" class="hidden fixed inset-0 z-100" style="display: none;">
            <div id="playlist-modal-backdrop" class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div class="relative z-101 w-full max-w-md mx-4">
              <div class="p-8 bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl">
                <h4 class="text-2xl font-bold text-white mb-6">Danh sách phát mới</h4>
                <form id="new-playlist-form" class="flex flex-col gap-6">
                  <div class="flex flex-col gap-2">
                    <label class="text-white/70 text-sm">Tiêu đề</label>
                    <input type="text" id="playlist-name" placeholder="Tiêu đề" required
                      class="px-0 py-2 bg-transparent border-0 border-b border-white/30 text-white placeholder-white/40 outline-none focus:border-white/60 transition-colors">
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label class="text-white/70 text-sm">Thông tin mô tả</label>
                    <input type="text" id="playlist-description" placeholder="Thông tin mô tả"
                      class="px-0 py-2 bg-transparent border-0 border-b border-white/30 text-white placeholder-white/40 outline-none focus:border-white/60 transition-colors">
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label class="text-white/70 text-sm">Quyền riêng tư</label>
                    <div class="relative">
                      <select id="playlist-privacy" 
                        class="w-full pl-8 pr-8 py-2 bg-transparent border-0 border-b border-white/30 text-white outline-none focus:border-white/60 transition-colors appearance-none cursor-pointer">
                        <option value="public" class="bg-[#1a1a1a] text-white">Công khai</option>
                        <option value="private" class="bg-[#1a1a1a] text-white">Riêng tư</option>
                        <option value="unlisted" class="bg-[#1a1a1a] text-white">Không liệt kê</option>
                      </select>
                      <div class="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        ${globeIcon}
                      </div>
                      <div class="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        ${chevronDownIcon}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <label class="text-white/70 text-sm">Cộng tác</label>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="playlist-collaborate" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex justify-end gap-4 mt-4">
                    <button type="button" id="cancel-playlist-btn"
                      class="px-6 py-2 text-white hover:text-white/80 transition-colors">Hủy</button>
                    <button type="submit"
                      class="px-6 py-2 rounded-lg bg-gray-400 text-gray-900 font-semibold hover:bg-gray-300 transition-colors">Tạo</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div id="playlists-container" class="grid grid-cols-4 gap-4">
          </div>
        </div>

      </div>
    </div>
  </section>
    `;
}

export default Lodash;
