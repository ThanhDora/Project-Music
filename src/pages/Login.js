import { Icons } from "../utils/Icons";
import { login, register, isAuthenticated } from "../utils/Request";
import { setCurrentPage } from "../router/router";

async function Login() {
  if (isAuthenticated()) {
    return `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Bạn đã đăng nhập rồi!</p></div>`;
  }

  const closeIcon = Icons.close();

  return `
    <section class="w-full flex items-center justify-center py-10">
      <div class="w-full max-w-md">
        <div class="bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl p-8">
          <h2 class="text-3xl font-bold text-white mb-6 text-center">Đăng nhập</h2>
          
          <div id="login-tabs" class="flex gap-4 mb-6 border-b border-white/20">
            <button id="login-tab" class="flex-1 py-2 text-white font-semibold border-b-2 border-white">Đăng nhập</button>
            <button id="register-tab" class="flex-1 py-2 text-white/50 font-semibold">Đăng ký</button>
          </div>

          <form id="login-form" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Email</label>
              <input type="email" id="login-email" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Mật khẩu</label>
              <input type="password" id="login-password" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <button type="submit" class="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors mt-2">
              Đăng nhập
            </button>
          </form>

          <form id="register-form" class="hidden">
            <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Tên</label>
              <input type="text" id="register-name" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Email</label>
              <input type="email" id="register-email" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Mật khẩu</label>
              <input type="password" id="register-password" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white/70 text-sm">Xác nhận mật khẩu</label>
              <input type="password" id="register-confirm-password" required
                class="px-4 py-2 bg-[#2a2a2a] border border-white/20 text-white rounded-lg outline-none focus:border-white/60 transition-colors">
            </div>
            
            <button type="submit" class="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors mt-2">
              Đăng ký
            </button>
          </form>

          <div id="auth-message" class="mt-4 text-center text-sm"></div>
        </div>
      </div>
    </section>
  `;
}

export default Login;

