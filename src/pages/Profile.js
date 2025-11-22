import { Icons } from "../utils/Icons";
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
  isAuthenticated,
} from "../utils/Request";
import { getImageUrl } from "../utils/helpers";
import { setCurrentPage } from "../router/router";

async function Profile() {
  if (!isAuthenticated()) {
    return `
      <section class="w-full flex items-center justify-center py-20">
        <div class="text-white text-center">
          <p class="text-xl mb-4">Vui lòng đăng nhập để xem thông tin tài khoản</p>
          <button id="go-to-login" class="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
            Đăng nhập
          </button>
        </div>
      </section>
    `;
  }

  const user = getCurrentUser();
  const editIcon =
    Icons.edit ||
    (() =>
      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>`);
  const saveIcon =
    Icons.save ||
    (() =>
      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`);
  const lockIcon =
    Icons.lock ||
    (() =>
      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`);

  return `
    <section class="w-full flex flex-col items-center py-10">
      <div class="w-[80%] max-w-4xl flex flex-col gap-8">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h1 class="text-4xl font-bold text-white">Thông tin tài khoản</h1>
        </div>

        <!-- Profile Info Card -->
        <div class="bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl p-8">
          <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div class="relative">
              <img src="${getImageUrl(user)}" 
                alt="avatar" 
                class="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                onerror="this.onerror=null; this.src='./src/assets/images/git.jpg'">
              <button id="change-avatar-btn" class="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors">
                ${editIcon()}
              </button>
            </div>
            
            <div class="flex-1">
              <h2 class="text-3xl font-bold text-white mb-2">${
                user?.name || "Chưa có tên"
              }</h2>
              <p class="text-white/70 text-lg mb-4">${user?.email || ""}</p>
              <div class="flex flex-wrap gap-4 text-sm">
                <div>
                  <span class="text-white/50">Ngày tham gia:</span>
                  <span class="text-white ml-2">${
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"
                  }</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <div class="bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-white flex items-center gap-2">
              ${editIcon()} Chỉnh sửa thông tin
            </h3>
          </div>

          <form id="profile-form" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Tên</label>
              <input type="text" id="profile-name" value="${
                user?.name || ""
              }" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Email</label>
              <input type="email" id="profile-email" value="${
                user?.email || ""
              }" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>

            <button type="submit" class="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors mt-2 flex items-center justify-center gap-2">
              ${saveIcon()} Lưu thay đổi
            </button>
          </form>

          <div id="profile-message" class="mt-4 text-center text-sm"></div>
        </div>

        <!-- Change Password Form -->
        <div class="bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-white flex items-center gap-2">
              ${lockIcon()} Đổi mật khẩu
            </h3>
          </div>

          <form id="password-form" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Mật khẩu hiện tại</label>
              <input type="password" id="current-password" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Mật khẩu mới</label>
              <input type="password" id="new-password" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Xác nhận mật khẩu mới</label>
              <input type="password" id="confirm-new-password" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>

            <button type="submit" class="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors mt-2">
              Đổi mật khẩu
            </button>
          </form>

          <div id="password-message" class="mt-4 text-center text-sm"></div>
        </div>

        <!-- Logout Button -->
        <div class="bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl p-8">
          <button id="logout-btn" class="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
            Đăng xuất
          </button>
        </div>
      </div>
    </section>
  `;
}

export default Profile;
