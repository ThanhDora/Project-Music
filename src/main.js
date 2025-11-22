import "./assets/style.css";
import app from "./app";
import {
  searchSongs,
  getSearchSuggestions,
  createPlaylistAPI,
  getPlaylists,
  trackPlayEvent,
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  updateProfile,
  changePassword,
  getSongDetails,
} from "./utils/Request";
import { getImageUrl } from "./utils/helpers";
import { showToast } from "./components/Toast";
import { Icons } from "./utils/Icons";
import {
  setCurrentPage,
  renderPage,
  getCurrentPage,
  getCurrentParams,
} from "./router/router";
import Footer from "./components/Footer";

const SCROLL_CONTAINERS = [
  {
    container: "songs-scroll-container",
    prev: "songs-scroll-prev",
    next: "songs-scroll-next",
    gap: 24,
  },
  {
    container: "videos-scroll-container",
    prev: "videos-scroll-prev",
    next: "videos-scroll-next",
    gap: 16,
  },
  {
    container: "albums-scroll-container",
    prev: "albums-scroll-prev",
    next: "albums-scroll-next",
    gap: 16,
  },
  {
    container: "mood-genre-scroll-container",
    prev: "mood-genre-scroll-prev",
    next: "mood-genre-scroll-next",
    gap: 16,
  },
  {
    container: "new-music-scroll-container",
    prev: "new-music-scroll-prev",
    next: "new-music-scroll-next",
    gap: 16,
  },
];

const setupScroll = (containerId, prevBtnId, nextBtnId, gap = 16) => {
  const scrollContainer = document.getElementById(containerId);
  const scrollPrevBtn = document.getElementById(prevBtnId);
  const scrollNextBtn = document.getElementById(nextBtnId);

  if (!scrollContainer || !scrollPrevBtn || !scrollNextBtn) return;

  const getScrollAmount = () => {
    const columns = Array.from(scrollContainer.children);
    if (columns.length > 0) {
      return columns[0].offsetWidth + gap;
    }
    return scrollContainer.offsetWidth / 3;
  };

  const scroll = (direction) => {
    const amount = getScrollAmount() * direction;
    scrollContainer.scrollBy({ left: amount, behavior: "smooth" });
  };

  scrollPrevBtn.onclick = () => scroll(-1);
  scrollNextBtn.onclick = () => scroll(1);
};

const initScrollContainers = () => {
  SCROLL_CONTAINERS.forEach(({ container, prev, next, gap }) => {
    setupScroll(container, prev, next, gap);
  });
};

let searchInitialized = false;
const initSearch = () => {
  const searchInput = document.getElementById("search");
  const searchResults = document.getElementById("search-results");
  if (!searchInput || !searchResults) {
    searchInitialized = false;
    return;
  }

  if (searchInitialized) return;

  const displaySearchResults = (results) => {
    if (results.length === 0) {
      searchResults.innerHTML = `<div class="p-4 text-white/50 text-center"><p>Không tìm thấy kết quả</p></div>`;
      searchResults.classList.remove("hidden");
      return;
    }

    searchResults.innerHTML = results
      .slice(0, 10)
      .map(
        (song) => `
        <div class="flex items-center gap-3 p-3 hover:bg-[#ffffff17] cursor-pointer transition-colors" data-song-id="${
          song._id || song.id || song.videoId || ""
        }">
          <img src="${getImageUrl(
            song
          )}" alt="album" class="w-12 h-12 rounded-lg object-cover shrink-0"
            onerror="this.onerror=null; this.src='/src/assets/images/git.jpg'">
          <div class="flex flex-col gap-1 min-w-0 flex-1">
            <h5 class="text-white text-sm font-semibold truncate">${
              song.title || song.name || "Không có tiêu đề"
            }</h5>
            <p class="text-white/60 text-xs truncate">${
              song.artist ||
              (song.artists && Array.isArray(song.artists)
                ? song.artists.map((a) => a?.name || a).join(", ")
                : "") ||
              "Nghệ sĩ"
            }</p>
            <p class="text-white/40 text-xs truncate">${song.album || ""}</p>
          </div>
        </div>
      `
      )
      .join("");
    searchResults.classList.remove("hidden");
  };

  const displaySearchSuggestions = async (query) => {
    const suggestions = await getSearchSuggestions(query);
    if (suggestions.length === 0) {
      hideSearchResults();
      return;
    }

    searchResults.innerHTML = suggestions
      .slice(0, 8)
      .map(
        (suggestion) => `
        <div class="flex items-center gap-3 p-3 hover:bg-[#ffffff17] cursor-pointer transition-colors" data-suggestion="${suggestion}">
          <div class="w-12 h-12 flex items-center justify-center">
            <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div class="flex flex-col gap-1 min-w-0 flex-1">
            <h5 class="text-white text-sm font-semibold truncate">${suggestion}</h5>
          </div>
        </div>
      `
      )
      .join("");
    searchResults.classList.remove("hidden");

    searchResults.querySelectorAll("[data-suggestion]").forEach((item) => {
      item.onclick = () => {
        searchInput.value = item.getAttribute("data-suggestion");
        performSearch(item.getAttribute("data-suggestion"));
      };
    });
  };

  const hideSearchResults = () => searchResults.classList.add("hidden");

  const performSearch = async (query) => {
    if (query.length === 0) {
      hideSearchResults();
      return;
    }
    const results = await searchSongs(query);
    displaySearchResults(results);
  };

  let searchTimeout;
  let suggestionTimeout;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchTimeout);
    clearTimeout(suggestionTimeout);

    if (query.length === 0) {
      hideSearchResults();
      return;
    }

    if (query.length < 3) {
      suggestionTimeout = setTimeout(
        () => displaySearchSuggestions(query),
        200
      );
    } else {
      searchTimeout = setTimeout(() => performSearch(query), 300);
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      clearTimeout(searchTimeout);
      performSearch(e.target.value.trim());
    }
  });

  searchInput.addEventListener("focus", (e) => {
    const query = e.target.value.trim();
    if (query.length > 0 && query.length < 3) {
      displaySearchSuggestions(query);
    } else if (query.length >= 3) {
      performSearch(query);
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      hideSearchResults();
    }
  });

  searchInitialized = true;
};

let navigationInitialized = false;
const initNavigation = () => {
  if (navigationInitialized) return;

  const navItems = document.querySelectorAll(".nav-item");
  const logoContainer = document.getElementById("logo-container");
  const loginBtn = document.getElementById("login-btn");
  const userMenu = document.getElementById("user-menu");
  const currentRoute = getCurrentPage();

  const navigateToPage = async (route, params = {}) => {
    if (!route) return;

    console.log("Navigating to:", route, "with params:", params);
    setCurrentPage(route, params);
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.innerHTML = `<div class="w-full flex items-center justify-center py-20"><p class="text-white">Đang tải...</p></div>`;
      try {
        const pageContent = await renderPage(route, params);
        if (pageContent) {
          mainContent.innerHTML = pageContent;
        } else {
          mainContent.innerHTML = `
            <div class="w-full flex items-center justify-center py-20">
              <div class="text-white text-center">
                <p class="text-xl mb-4">Không tìm thấy nội dung</p>
                <p class="text-white/50 text-sm">Vui lòng thử lại sau</p>
              </div>
            </div>
          `;
        }
      } catch (error) {
        console.error("Error loading page:", error);
        mainContent.innerHTML = `
          <div class="w-full flex items-center justify-center py-20">
            <div class="text-white text-center">
              <p class="text-xl mb-4">Có lỗi xảy ra khi tải trang</p>
              <p class="text-white/50 text-sm">${
                error.message || "Vui lòng thử lại sau"
              }</p>
            </div>
          </div>
        `;
      }
    }

    navItems.forEach((nav) => {
      const navRoute = nav.getAttribute("data-route");
      nav.classList.toggle("active", navRoute === route);
    });

    initScrollContainers();
    initSearch();
    initAuth();
    initPlaylists();
    initProfile();
    setTimeout(async () => {
      songDetailsInitialized = false;
      audioPlayerInitialized = false;
      initSongDetails();
      initAudioPlayer();

      // Update Footer if we're on song details page
      if (route === "song-details" && params.songId) {
        try {
          const song = await getSongDetails(params.songId);
          if (song && !song.error) {
            localStorage.setItem("currentPlayingSong", JSON.stringify(song));
            await updateFooterWithSong(song);
          } else {
            // Try fallback from sessionStorage
            const fallbackData = sessionStorage.getItem("currentSongData");
            if (fallbackData) {
              try {
                const songData = JSON.parse(fallbackData);
                localStorage.setItem(
                  "currentPlayingSong",
                  JSON.stringify(songData)
                );
                await updateFooterWithSong(songData);
              } catch (e) {
                console.warn("Failed to parse fallback data for footer:", e);
              }
            }
          }
        } catch (error) {
          console.error("Error loading song for footer:", error);
        }
      }
    }, 200);
  };

  if (loginBtn) {
    loginBtn.onclick = () => {
      const modal = document.getElementById("login-modal");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }
    };
  }

  if (userMenu) {
    userMenu.onclick = () => {
      const route = userMenu.getAttribute("data-route");
      if (route) {
        navigateToPage(route);
      }
    };
  }

  navItems.forEach((item) => {
    const route = item.getAttribute("data-route");
    if (route === currentRoute) item.classList.add("active");
    item.onclick = () => navigateToPage(route);
  });

  if (logoContainer) {
    logoContainer.onclick = () => {
      navigateToPage(logoContainer.getAttribute("data-route"));
    };
  }

  const chartsBtn = document.getElementById("charts-btn");
  if (chartsBtn) {
    chartsBtn.onclick = () => {
      navigateToPage("charts");
    };
  }

  const newReleasesBtn = document.getElementById("new-releases-btn");
  if (newReleasesBtn) {
    newReleasesBtn.onclick = () => {
      window.scrollTo({
        top:
          document.getElementById("new-music-scroll-container")?.offsetTop || 0,
        behavior: "smooth",
      });
    };
  }

  document.addEventListener("click", (e) => {
    // Skip if clicking on related song items (they have their own handler)
    if (e.target.closest(".related-song-item")) {
      return;
    }

    const songCard = e.target.closest("[data-song-id]");
    if (songCard) {
      e.preventDefault();
      e.stopPropagation();
      const songId = songCard.getAttribute("data-song-id");
      const songDataStr = songCard.getAttribute("data-song-data");
      console.log("Song card clicked, ID:", songId);

      if (songId && songId.trim() !== "") {
        // Store song data in sessionStorage as fallback
        if (songDataStr) {
          try {
            const songData = JSON.parse(songDataStr.replace(/&quot;/g, '"'));
            sessionStorage.setItem("currentSongData", JSON.stringify(songData));
            // Also store in localStorage for Footer
            localStorage.setItem(
              "currentPlayingSong",
              JSON.stringify(songData)
            );
            // Update Footer immediately
            updateFooterWithSong(songData);
          } catch (e) {
            console.warn("Failed to parse song data:", e);
          }
        }
        navigateToPage("song-details", { songId });
        const searchResults = document.getElementById("search-results");
        if (searchResults) {
          searchResults.classList.add("hidden");
        }
      } else {
        console.warn("Song ID is empty or invalid");
        showToast("Không tìm thấy ID bài hát", "error");
      }
    }

    const videoCard = e.target.closest("[data-video-id]");
    if (videoCard) {
      e.preventDefault();
      e.stopPropagation();
      const videoId = videoCard.getAttribute("data-video-id");
      console.log("Video card clicked, ID:", videoId);
      if (videoId && videoId.trim() !== "") {
        navigateToPage("video-details", { videoId });
      } else {
        console.warn("Video ID is empty or invalid");
        showToast("Không tìm thấy ID video", "error");
      }
    }

    const albumCard = e.target.closest("[data-album-slug]");
    if (albumCard) {
      e.preventDefault();
      e.stopPropagation();
      const albumSlug = albumCard.getAttribute("data-album-slug");
      console.log("Album card clicked, slug:", albumSlug);
      if (albumSlug && albumSlug.trim() !== "") {
        navigateToPage("album-details", { albumSlug });
      } else {
        console.warn("Album slug is empty or invalid");
        showToast("Không tìm thấy slug album", "error");
      }
    }

    const moodBtn = e.target.closest(".mood-btn");
    if (moodBtn) {
      const moodSlug = moodBtn.getAttribute("data-mood-slug");
      if (moodSlug) {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.scrollTo({ top: 0, behavior: "smooth" });
        }
        document.querySelectorAll(".mood-btn").forEach((btn) => {
          btn.classList.remove("bg-white", "text-black");
          btn.classList.add("bg-[#ffffff17]", "text-white");
        });
        moodBtn.classList.remove("bg-[#ffffff17]", "text-white");
        moodBtn.classList.add("bg-white", "text-black");
      }
    }
  });

  navigationInitialized = true;
};

let playlistsInitialized = false;
const initPlaylists = () => {
  const addPlaylistBtn = document.getElementById("add-playlist-btn");
  const playlistModal = document.getElementById("playlist-modal");
  const playlistModalBackdrop = document.getElementById(
    "playlist-modal-backdrop"
  );
  const newPlaylistForm = document.getElementById("new-playlist-form");
  const cancelPlaylistBtn = document.getElementById("cancel-playlist-btn");
  const playlistsContainer = document.getElementById("playlists-container");

  if (!playlistsContainer) {
    playlistsInitialized = false;
    return;
  }

  if (playlistsInitialized) return;

  const renderPlaylists = () => {
    const playlists = getPlaylists();

    if (playlists.length === 0) {
      playlistsContainer.innerHTML = `
        <div class="col-span-4 text-center text-white/50 py-10">
          <p>Chưa có danh sách phát nào. Tạo danh sách phát đầu tiên của bạn!</p>
        </div>
      `;
      return;
    }

    playlistsContainer.innerHTML = playlists
      .map(
        (playlist) => `
        <div class="flex flex-col gap-2 cursor-pointer group rounded-lg p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors">
          <div class="w-full aspect-square bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2">
            <span class="text-4xl text-white">🎵</span>
          </div>
          <h5 class="text-white font-semibold truncate">${playlist.name}</h5>
          <p class="text-white/50 text-sm truncate">${
            playlist.songs?.length || 0
          } bài hát</p>
        </div>
      `
      )
      .join("");
  };

  const openModal = () => {
    if (!playlistModal) return;
    playlistModal.classList.remove("hidden");
    playlistModal.style.display = "flex";
    playlistModal.classList.add("items-center", "justify-center");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!playlistModal) return;
    playlistModal.classList.add("hidden");
    playlistModal.style.display = "none";
    document.body.style.overflow = "";
    if (newPlaylistForm) newPlaylistForm.reset();
  };

  if (addPlaylistBtn) addPlaylistBtn.onclick = openModal;
  if (playlistModalBackdrop) playlistModalBackdrop.onclick = closeModal;
  if (cancelPlaylistBtn) cancelPlaylistBtn.onclick = closeModal;

  if (newPlaylistForm) {
    newPlaylistForm.onsubmit = async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("playlist-name");
      if (!nameInput?.value.trim()) return;

      const playlist = {
        name: nameInput.value.trim(),
        description:
          document.getElementById("playlist-description")?.value.trim() || "",
        privacy: document.getElementById("playlist-privacy")?.value || "public",
        collaborate:
          document.getElementById("playlist-collaborate")?.checked || false,
      };

      const result = await createPlaylistAPI(playlist);
      if (result) {
        renderPlaylists();
        closeModal();
      }
    };
  }

  renderPlaylists();
  playlistsInitialized = true;
};

let profileInitialized = false;
const initProfile = () => {
  const profileForm = document.getElementById("profile-form");
  const passwordForm = document.getElementById("password-form");
  const logoutBtn = document.getElementById("logout-btn");
  const goToLoginBtn = document.getElementById("go-to-login");

  if (!profileForm && !passwordForm && !logoutBtn && !goToLoginBtn) {
    profileInitialized = false;
    return;
  }

  if (goToLoginBtn) {
    goToLoginBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById("login-modal");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      } else {
        console.error("Login modal not found in DOM");
      }
    };
  }

  if (profileForm) {
    profileForm.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById("profile-name")?.value;
      const email = document.getElementById("profile-email")?.value;
      const messageEl = document.getElementById("profile-message");

      if (!name || !email) {
        if (messageEl) {
          messageEl.textContent = "Vui lòng điền đầy đủ thông tin";
          messageEl.className = "mt-4 text-center text-sm text-red-400";
        }
        return;
      }

      try {
        const result = await updateProfile(name, email);
        console.log("Update profile result:", result);

        if (result) {
          // Check if update was successful (API might return different formats)
          const isSuccess =
            result.user ||
            result.name ||
            result.email ||
            result.message?.includes("success") ||
            result.message?.includes("thành công");

          if (isSuccess) {
            // Update UI without reload
            const userNameEl = document.querySelector(
              "h2.text-3xl.font-bold.text-white"
            );
            const userEmailEl = document.querySelector(
              "p.text-white\\/70.text-lg"
            );
            const headerUserName = document.querySelector("#user-menu span");

            if (userNameEl) userNameEl.textContent = name;
            if (userEmailEl) userEmailEl.textContent = email;
            if (headerUserName) headerUserName.textContent = name;

            const successMsg =
              result.message || "Cập nhật thông tin thành công!";
            if (messageEl) {
              messageEl.textContent = successMsg;
              messageEl.className = "mt-4 text-center text-sm text-green-400";
            }
            showToast(successMsg, "success");
          } else {
            const errorMsg =
              result.message || "Cập nhật thất bại. Vui lòng thử lại";
            if (messageEl) {
              messageEl.textContent = errorMsg;
              messageEl.className = "mt-4 text-center text-sm text-red-400";
            }
            showToast(errorMsg, "error");
          }
        } else {
          const errorMsg = "Cập nhật thất bại. Vui lòng thử lại";
          if (messageEl) {
            messageEl.textContent = errorMsg;
            messageEl.className = "mt-4 text-center text-sm text-red-400";
          }
          showToast(errorMsg, "error");
        }
      } catch (error) {
        console.error("Update profile error:", error);
        const errorMsg = error.message || "Cập nhật thất bại";
        if (messageEl) {
          messageEl.textContent = errorMsg;
          messageEl.className = "mt-4 text-center text-sm text-red-400";
        }
        showToast(errorMsg, "error");
      }
    };
  }

  if (passwordForm) {
    passwordForm.onsubmit = async (e) => {
      e.preventDefault();
      const currentPassword =
        document.getElementById("current-password")?.value;
      const newPassword = document.getElementById("new-password")?.value;
      const confirmPassword = document.getElementById(
        "confirm-new-password"
      )?.value;
      const messageEl = document.getElementById("password-message");

      if (!currentPassword || !newPassword || !confirmPassword) {
        if (messageEl) {
          messageEl.textContent = "Vui lòng điền đầy đủ thông tin";
          messageEl.className = "mt-4 text-center text-sm text-red-400";
        }
        return;
      }

      if (newPassword !== confirmPassword) {
        if (messageEl) {
          messageEl.textContent = "Mật khẩu xác nhận không khớp";
          messageEl.className = "mt-4 text-center text-sm text-red-400";
        }
        return;
      }

      try {
        const result = await changePassword(
          currentPassword,
          newPassword,
          confirmPassword
        );
        if (result) {
          const successMsg = result.message || "Đổi mật khẩu thành công!";
          if (messageEl) {
            messageEl.textContent = successMsg;
            messageEl.className = "mt-4 text-center text-sm text-green-400";
          }
          passwordForm.reset();
          showToast(successMsg, "success");

          setTimeout(() => {
            if (messageEl) {
              messageEl.textContent = "";
              messageEl.className = "mt-4 text-center text-sm";
            }
          }, 3000);
        } else {
          const errorMsg =
            "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại";
          if (messageEl) {
            messageEl.textContent = errorMsg;
            messageEl.className = "mt-4 text-center text-sm text-red-400";
          }
          showToast(errorMsg, "error");
        }
      } catch (error) {
        const errorMsg = error.message || "Đổi mật khẩu thất bại";
        if (messageEl) {
          messageEl.textContent = errorMsg;
          messageEl.className = "mt-4 text-center text-sm text-red-400";
        }
        showToast(errorMsg, "error");
      }
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        try {
          await logout();
          window.location.reload();
        } catch (error) {
          console.error("Logout error:", error);
          window.location.reload();
        }
      }
    };
  }

  profileInitialized = true;
};

const closeLoginModal = () => {
  const modal = document.getElementById("login-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    const messageEl = document.getElementById("auth-message");
    if (messageEl) {
      messageEl.textContent = "";
      messageEl.className = "mt-4 text-center text-sm";
    }
  }
};

let authInitialized = false;
const initAuth = () => {
  if (authInitialized) return;

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const authMessage = document.getElementById("auth-message");
  const closeModalBtn = document.getElementById("close-login-modal");
  const loginModal = document.getElementById("login-modal");

  if (closeModalBtn) {
    closeModalBtn.onclick = closeLoginModal;
  }

  if (loginModal) {
    loginModal.onclick = (e) => {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    };
  }

  if (loginTab && registerTab) {
    loginTab.onclick = () => {
      loginTab.classList.add("border-white", "text-white");
      loginTab.classList.remove("text-white/50", "border-transparent");
      registerTab.classList.remove("border-white", "text-white");
      registerTab.classList.add("text-white/50", "border-transparent");
      loginForm?.classList.remove("hidden");
      registerForm?.classList.add("hidden");
      if (authMessage) authMessage.textContent = "";
    };

    registerTab.onclick = () => {
      registerTab.classList.add("border-white", "text-white");
      registerTab.classList.remove("text-white/50", "border-transparent");
      loginTab.classList.remove("border-white", "text-white");
      loginTab.classList.add("text-white/50", "border-transparent");
      registerForm?.classList.remove("hidden");
      loginForm?.classList.add("hidden");
      if (authMessage) authMessage.textContent = "";
    };
  }

  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email")?.value;
      const password = document.getElementById("login-password")?.value;

      if (!email || !password) {
        showToast("Vui lòng điền đầy đủ thông tin", "error");
        if (authMessage) {
          authMessage.textContent = "";
        }
        return;
      }

      try {
        const result = await login(email, password);
        if (result) {
          showToast("Đăng nhập thành công!", "success");
          if (authMessage) {
            authMessage.textContent = "";
          }
          setTimeout(() => {
            closeLoginModal();
            window.location.reload();
          }, 1000);
        } else {
          showToast("Email hoặc mật khẩu không đúng", "error");
          if (authMessage) {
            authMessage.textContent = "";
          }
        }
      } catch (error) {
        showToast(error.message || "Đăng nhập thất bại", "error");
        if (authMessage) {
          authMessage.textContent = "";
        }
      }
    };
  }

  if (registerForm) {
    registerForm.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name")?.value;
      const email = document.getElementById("register-email")?.value;
      const password = document.getElementById("register-password")?.value;
      const confirmPassword = document.getElementById(
        "register-confirm-password"
      )?.value;

      if (!name || !email || !password || !confirmPassword) {
        showToast("Vui lòng điền đầy đủ thông tin", "error");
        if (authMessage) {
          authMessage.textContent = "";
        }
        return;
      }

      if (password !== confirmPassword) {
        showToast("Mật khẩu xác nhận không khớp", "error");
        if (authMessage) {
          authMessage.textContent = "";
        }
        return;
      }

      try {
        const result = await register(name, email, password, confirmPassword);
        if (result) {
          showToast("Đăng ký thành công!", "success");
          if (authMessage) {
            authMessage.textContent = "";
          }
          setTimeout(() => {
            closeLoginModal();
            window.location.reload();
          }, 1000);
        } else {
          showToast("Đăng ký thất bại. Vui lòng thử lại", "error");
          if (authMessage) {
            authMessage.textContent = "";
          }
        }
      } catch (error) {
        showToast(error.message || "Đăng ký thất bại", "error");
        if (authMessage) {
          authMessage.textContent = "";
        }
      }
    };
  }

  authInitialized = true;
};

import { initApp as initAppLayout } from "./app";

const updateFooterWithSong = async (song) => {
  if (!song) return;

  try {
    const footer = await Footer(song);
    const footerElement = document.querySelector("footer");
    if (footerElement) {
      footerElement.outerHTML = footer;
      // Re-initialize audio player after footer update
      setTimeout(() => {
        initAudioPlayer();
      }, 100);
    }
  } catch (error) {
    console.error("Error updating footer:", error);
  }
};

const render = async () => {
  await initAppLayout();

  initScrollContainers();
  initSearch();
  initNavigation();
  initPlaylists();
  initAuth();

  setTimeout(async () => {
    initProfile();
    songDetailsInitialized = false;
    audioPlayerInitialized = false;
    initSongDetails();
    initAudioPlayer();

    // If on song-details page, update footer with current song
    const currentPage = getCurrentPage();
    const currentParams = getCurrentParams();
    if (currentPage === "song-details" && currentParams.songId) {
      try {
        const storedSong = localStorage.getItem("currentPlayingSong");
        if (storedSong) {
          const song = JSON.parse(storedSong);
          await updateFooterWithSong(song);
        } else {
          // Try to get song from API
          const { getSongDetails } = await import("./utils/Request");
          const song = await getSongDetails(currentParams.songId);
          if (song && !song.error) {
            localStorage.setItem("currentPlayingSong", JSON.stringify(song));
            await updateFooterWithSong(song);
          }
        }
      } catch (error) {
        console.error("Error loading song for footer on reload:", error);
      }
    }
  }, 200);
};

let songDetailsInitialized = false;
const initSongDetails = () => {
  const playSongBtn = document.getElementById("play-song-btn");
  const likeSongBtn = document.getElementById("like-song-btn");
  const addToPlaylistBtn = document.getElementById("add-to-playlist-btn");
  const shareSongBtn = document.getElementById("share-song-btn");
  const moreOptionsBtn = document.getElementById("more-options-btn");

  if (!playSongBtn && !likeSongBtn) {
    songDetailsInitialized = false;
    return;
  }

  if (songDetailsInitialized) return;

  // Get songId from the page - check if we're on song details page
  const getCurrentSongId = () => {
    // Try to get from URL or page content
    const urlParams = new URLSearchParams(window.location.search);
    const songIdFromUrl = urlParams.get("id");
    if (songIdFromUrl) return songIdFromUrl;

    // Try to get from data attribute in the page
    const songElement = document.querySelector("[data-current-song-id]");
    if (songElement) return songElement.getAttribute("data-current-song-id");

    return null;
  };

  // Play song button
  if (playSongBtn) {
    playSongBtn.onclick = async () => {
      const songId = getCurrentSongId();
      if (songId) {
        try {
          await trackPlayEvent(null, songId, null);
          showToast("Đang phát bài hát", "success");
        } catch (error) {
          console.error("Error playing song:", error);
          showToast("Không thể phát bài hát", "error");
        }
      } else {
        showToast("Không tìm thấy bài hát", "error");
      }
    };
  }

  // Like song button
  if (likeSongBtn) {
    likeSongBtn.onclick = () => {
      likeSongBtn.classList.toggle("bg-red-500");
      likeSongBtn.classList.toggle("text-white");
      showToast("Đã thêm vào bài hát yêu thích", "success");
    };
  }

  // Add to playlist button
  if (addToPlaylistBtn) {
    addToPlaylistBtn.onclick = async () => {
      // TODO: Show playlist selection modal
      showToast("Chức năng đang được phát triển", "info");
    };
  }

  // Share song button
  if (shareSongBtn) {
    shareSongBtn.onclick = async () => {
      const songTitle = document.querySelector("h1")?.textContent || "Bài hát";
      if (navigator.share) {
        try {
          await navigator.share({
            title: songTitle,
            text: `Nghe "${songTitle}"`,
            url: window.location.href,
          });
        } catch (error) {
          // User cancelled or error
          if (error.name !== "AbortError") {
            // Copy to clipboard as fallback
            navigator.clipboard.writeText(window.location.href);
            showToast("Đã sao chép link", "success");
          }
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showToast("Đã sao chép link", "success");
      }
    };
  }

  // More options button
  if (moreOptionsBtn) {
    moreOptionsBtn.onclick = () => {
      // TODO: Show more options menu
      showToast("Chức năng đang được phát triển", "info");
    };
  }

  // Song list items click handlers
  const songItems = document.querySelectorAll(".song-item");
  songItems.forEach((item) => {
    item.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const songId = item.getAttribute("data-song-id");
      if (songId) {
        navigateToPage("song-details", { songId });
      }
    };
  });

  // Tab switching
  const tabNext = document.getElementById("tab-next");
  const tabLyrics = document.getElementById("tab-lyrics");
  const tabRelated = document.getElementById("tab-related");
  const songListContainer = document.getElementById("song-list-container");
  const lyricsContainer = document.getElementById("lyrics-container");
  const relatedContainer = document.getElementById("related-container");

  const switchTab = (activeTab) => {
    // Reset all tabs
    [tabNext, tabLyrics, tabRelated].forEach((tab) => {
      if (tab) {
        tab.classList.remove("border-white", "text-white");
        tab.classList.add("border-transparent", "text-white/50");
      }
    });

    // Hide all containers
    if (songListContainer) songListContainer.classList.add("hidden");
    if (lyricsContainer) lyricsContainer.classList.add("hidden");
    if (relatedContainer) relatedContainer.classList.add("hidden");

    // Show active tab and container
    if (activeTab === "next") {
      if (tabNext) {
        tabNext.classList.remove("border-transparent", "text-white/50");
        tabNext.classList.add("border-white", "text-white");
      }
      if (songListContainer) songListContainer.classList.remove("hidden");
    } else if (activeTab === "lyrics") {
      if (tabLyrics) {
        tabLyrics.classList.remove("border-transparent", "text-white/50");
        tabLyrics.classList.add("border-white", "text-white");
      }
      if (lyricsContainer) lyricsContainer.classList.remove("hidden");
    } else if (activeTab === "related") {
      if (tabRelated) {
        tabRelated.classList.remove("border-transparent", "text-white/50");
        tabRelated.classList.add("border-white", "text-white");
      }
      if (relatedContainer) relatedContainer.classList.remove("hidden");
    }
  };

  if (tabNext) {
    tabNext.onclick = () => switchTab("next");
  }
  if (tabLyrics) {
    tabLyrics.onclick = () => switchTab("lyrics");
  }
  if (tabRelated) {
    tabRelated.onclick = () => switchTab("related");
  }

  // Filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.onclick = () => {
      filterButtons.forEach((b) => {
        b.classList.remove("active", "border-white", "text-white");
        b.classList.add("border-transparent", "text-white/50");
      });
      btn.classList.add("active", "border-white", "text-white");
      btn.classList.remove("border-transparent", "text-white/50");
    };
  });

  songDetailsInitialized = true;
};

let audioPlayerInitialized = false;
const initAudioPlayer = () => {
  const audioElement = document.getElementById("audio-element");
  const playPauseBtn = document.getElementById("audio-play-pause-btn");
  const progressBar = document.getElementById("audio-progress");
  const progressBarFill = document.getElementById("audio-progress-bar");
  const currentTimeEl = document.getElementById("audio-current-time");
  const durationEl = document.getElementById("audio-duration");
  const volumeSlider = document.getElementById("audio-volume");
  const volumeBtn = document.getElementById("audio-volume-btn");
  const prevBtn = document.getElementById("audio-prev-btn");
  const nextBtn = document.getElementById("audio-next-btn");
  const shuffleBtn = document.getElementById("audio-shuffle-btn");
  const repeatBtn = document.getElementById("audio-repeat-btn");

  if (!audioElement) {
    audioPlayerInitialized = false;
    return;
  }

  if (audioPlayerInitialized && playPauseBtn) {
    return;
  }

  console.log("Initializing audio player", {
    audioElement: !!audioElement,
    playPauseBtn: !!playPauseBtn,
    hasSource: !!audioElement.querySelector("source"),
    audioSrc:
      audioElement.src || audioElement.querySelector("source")?.src || "none",
  });

  // Check if audio has source, if not try to set it
  const source = audioElement.querySelector("source");
  const currentSrc = audioElement.src || (source && source.src);

  if (!currentSrc || currentSrc === window.location.href) {
    const storedSong = localStorage.getItem("currentPlayingSong");
    if (storedSong) {
      try {
        const song = JSON.parse(storedSong);
        const videoId = song.videoId;
        const songId = song._id || song.id;
        const idToUse = videoId || songId;
        if (idToUse) {
          // Always use API streaming endpoint to avoid CORS issues
          const audioUrl = `https://youtube-music.f8team.dev/api/stream/${idToUse}`;

          console.log("Setting initial audio URL:", audioUrl);
          // Remove old source if exists
          if (source) {
            source.remove();
          }
          audioElement.src = audioUrl;
          audioElement.load();
        }
      } catch (e) {
        console.error("Error setting initial audio URL:", e);
      }
    }
  } else {
    console.log("Audio already has source:", currentSrc);
  }

  let isPlaying = false;
  let isMuted = false;
  let currentVolume = 70;
  let isShuffling = false;
  let repeatMode = 0; // 0: off, 1: all, 2: one

  // Format time
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Update progress
  const updateProgress = () => {
    if (audioElement.duration) {
      const progress = (audioElement.currentTime / audioElement.duration) * 100;
      if (progressBar) progressBar.value = progress;
      if (progressBarFill) {
        progressBarFill.style.width = `${progress}%`;
      }
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audioElement.currentTime);
      }
    }
  };

  // Update duration
  const updateDuration = () => {
    if (audioElement.duration && durationEl) {
      durationEl.textContent = formatTime(audioElement.duration);
    }
  };

  // Play/Pause
  if (playPauseBtn) {
    // Use onclick to ensure it works
    playPauseBtn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log("Play button clicked!");

      const currentBtn = document.getElementById("audio-play-pause-btn");
      if (!currentBtn) {
        console.error("Play button not found!");
        return;
      }

      if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
        currentBtn.innerHTML = Icons.play();
      } else {
        // Check if audio source exists
        const source = audioElement.querySelector("source");
        let currentSrc = audioElement.src || (source && source.src);

        console.log("Play button clicked", {
          hasSource: !!source,
          sourceSrc: source?.src,
          audioSrc: audioElement.src,
          currentSrc: currentSrc,
          readyState: audioElement.readyState,
        });

        if (
          !currentSrc ||
          currentSrc === window.location.href ||
          currentSrc === ""
        ) {
          // Try to get audio URL from current song
          const storedSong = localStorage.getItem("currentPlayingSong");
          if (storedSong) {
            try {
              const song = JSON.parse(storedSong);
              const videoId = song.videoId;
              const songId = song._id || song.id;
              const idToUse = videoId || songId;

              if (idToUse) {
                // Try to get audio URL from song object first, then use API endpoint
                let audioUrl =
                  song.audioUrl ||
                  song.audio ||
                  song.streamUrl ||
                  song.url ||
                  song.source ||
                  song.streamingUrl ||
                  song.downloadUrl;

                // If no direct URL, use API streaming endpoint
                if (!audioUrl) {
                  audioUrl = `https://youtube-music.f8team.dev/api/stream/${idToUse}`;
                }

                console.log("Setting audio URL:", audioUrl, {
                  videoId: videoId,
                  songId: songId,
                  idToUse: idToUse,
                  hasDirectUrl: !!song.audioUrl,
                });
                // Remove old source if exists
                const oldSource = audioElement.querySelector("source");
                if (oldSource) {
                  oldSource.remove();
                }
                console.log("Setting audio source:", audioUrl);
                audioElement.src = audioUrl;
                audioElement.load();

                // Wait for metadata before playing
                const playAfterLoad = () => {
                  console.log("Audio ready, attempting to play...", {
                    readyState: audioElement.readyState,
                    src: audioElement.src,
                    duration: audioElement.duration,
                    networkState: audioElement.networkState,
                    paused: audioElement.paused,
                  });

                  if (audioElement.paused) {
                    audioElement
                      .play()
                      .then(() => {
                        console.log("Audio playing successfully!");
                        isPlaying = true;
                        const currentBtn = document.getElementById(
                          "audio-play-pause-btn"
                        );
                        if (currentBtn) currentBtn.innerHTML = Icons.pause();
                      })
                      .catch((error) => {
                        console.error("Error playing audio:", error);
                        console.error("Audio error details:", {
                          code: audioElement.error?.code,
                          message: audioElement.error?.message,
                          networkState: audioElement.networkState,
                          readyState: audioElement.readyState,
                          src: audioElement.src,
                        });
                        showToast(
                          `Không thể phát nhạc: ${
                            error.message || "Lỗi không xác định"
                          }`,
                          "error"
                        );
                      });
                  } else {
                    console.log("Audio already playing");
                  }
                };

                // Try multiple events to ensure audio loads
                const tryPlay = () => {
                  if (audioElement.readyState >= 2) {
                    playAfterLoad();
                  } else {
                    console.log("Audio not ready yet, waiting...", {
                      readyState: audioElement.readyState,
                    });
                  }
                };

                // Try to play immediately if ready, otherwise wait for events
                if (audioElement.readyState >= 2) {
                  console.log("Audio already ready, playing immediately");
                  playAfterLoad();
                } else {
                  console.log(
                    "Waiting for audio to load, readyState:",
                    audioElement.readyState
                  );

                  // Listen for multiple events to ensure we catch when audio is ready
                  const eventHandler = () => {
                    console.log(
                      "Audio load event fired, readyState:",
                      audioElement.readyState
                    );
                    if (audioElement.readyState >= 2) {
                      playAfterLoad();
                    }
                  };

                  audioElement.addEventListener("canplay", eventHandler, {
                    once: true,
                  });
                  audioElement.addEventListener("loadeddata", eventHandler, {
                    once: true,
                  });
                  audioElement.addEventListener(
                    "canplaythrough",
                    eventHandler,
                    { once: true }
                  );
                  audioElement.addEventListener(
                    "loadedmetadata",
                    () => {
                      console.log(
                        "Metadata loaded, duration:",
                        audioElement.duration
                      );
                      if (audioElement.readyState >= 2) {
                        playAfterLoad();
                      }
                    },
                    { once: true }
                  );

                  // Fallback timeout - try to play after 3 seconds
                  setTimeout(() => {
                    console.log(
                      "Fallback timeout, readyState:",
                      audioElement.readyState,
                      "isPlaying:",
                      isPlaying
                    );
                    if (!isPlaying && audioElement.readyState >= 1) {
                      console.log("Attempting to play after timeout");
                      playAfterLoad();
                    }
                  }, 3000);
                }
                return;
              }
            } catch (e) {
              console.error("Error getting audio URL:", e);
              showToast("Không thể lấy URL phát nhạc", "error");
            }
          } else {
            console.warn("No song in localStorage");
            showToast("Chưa có bài hát để phát", "info");
          }
        }

        // If source already exists, just play
        currentSrc =
          audioElement.src || audioElement.querySelector("source")?.src;
        if (
          currentSrc &&
          currentSrc !== window.location.href &&
          currentSrc !== ""
        ) {
          console.log("Playing existing audio:", currentSrc);
          if (audioElement.readyState >= 2) {
            audioElement
              .play()
              .then(() => {
                console.log("Audio playing successfully");
                isPlaying = true;
                const currentBtn = document.getElementById(
                  "audio-play-pause-btn"
                );
                if (currentBtn) currentBtn.innerHTML = Icons.pause();
              })
              .catch((error) => {
                console.error("Error playing audio:", error);
                showToast(
                  "Không thể phát nhạc. Vui lòng kiểm tra lại URL.",
                  "error"
                );
              });
          } else {
            // Wait for audio to be ready
            const playWhenReady = () => {
              audioElement
                .play()
                .then(() => {
                  console.log("Audio playing successfully");
                  isPlaying = true;
                  const currentBtn = document.getElementById(
                    "audio-play-pause-btn"
                  );
                  if (currentBtn) currentBtn.innerHTML = Icons.pause();
                })
                .catch((error) => {
                  console.error("Error playing audio:", error);
                  showToast(
                    "Không thể phát nhạc. Vui lòng kiểm tra lại URL.",
                    "error"
                  );
                });
            };
            audioElement.addEventListener("canplay", playWhenReady, {
              once: true,
            });
            audioElement.addEventListener("loadeddata", playWhenReady, {
              once: true,
            });
          }
        } else {
          console.warn("No audio source available", { currentSrc });
          showToast("Chưa có bài hát để phát", "info");
        }
      }
    };
  }

  // Progress bar
  if (progressBar) {
    progressBar.oninput = (e) => {
      if (audioElement.duration) {
        audioElement.currentTime =
          (e.target.value / 100) * audioElement.duration;
      }
    };
  }

  // Volume control
  if (volumeSlider) {
    volumeSlider.oninput = (e) => {
      currentVolume = e.target.value;
      audioElement.volume = currentVolume / 100;
      if (currentVolume > 0) {
        isMuted = false;
        if (volumeBtn) volumeBtn.innerHTML = Icons.volumeHigh();
      }
    };
  }

  if (volumeBtn) {
    volumeBtn.onclick = () => {
      if (isMuted) {
        audioElement.volume = currentVolume / 100;
        isMuted = false;
        volumeBtn.innerHTML = Icons.volumeHigh();
      } else {
        audioElement.volume = 0;
        isMuted = true;
        volumeBtn.innerHTML = Icons.volumeOff();
      }
    };
  }

  // Audio events
  audioElement.addEventListener("timeupdate", updateProgress);
  audioElement.addEventListener("loadedmetadata", () => {
    console.log("Audio metadata loaded", {
      duration: audioElement.duration,
      readyState: audioElement.readyState,
    });
    updateDuration();
  });
  audioElement.addEventListener("canplay", () => {
    console.log("Audio can play", {
      duration: audioElement.duration,
      readyState: audioElement.readyState,
    });
    updateDuration();
  });
  audioElement.addEventListener("loadstart", () => {
    console.log("Audio load started");
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (durationEl) durationEl.textContent = "0:00";
  });
  audioElement.addEventListener("progress", () => {
    console.log("Audio loading progress", {
      buffered:
        audioElement.buffered.length > 0 ? audioElement.buffered.end(0) : 0,
      readyState: audioElement.readyState,
    });
  });
  audioElement.addEventListener("error", (e) => {
    console.error("Audio error event:", e);
    const error = audioElement.error;
    if (error) {
      let errorMsg = "Không thể phát nhạc";
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMsg = "Phát nhạc bị hủy";
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMsg = "Lỗi kết nối mạng";
          break;
        case error.MEDIA_ERR_DECODE:
          errorMsg = "Không thể giải mã file nhạc";
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = "Định dạng không được hỗ trợ";
          break;
      }
      console.error("Audio error details:", {
        code: error.code,
        message: errorMsg,
        networkState: audioElement.networkState,
        readyState: audioElement.readyState,
        src: audioElement.src,
      });
      showToast(errorMsg, "error");
    }
  });
  audioElement.addEventListener("ended", () => {
    isPlaying = false;
    const currentBtn = document.getElementById("audio-play-pause-btn");
    if (currentBtn) {
      currentBtn.innerHTML = Icons.play();
    }
    // Handle repeat mode
    if (repeatMode === 2) {
      audioElement.currentTime = 0;
      audioElement.play();
    } else if (repeatMode === 1) {
      // Play next song (if available)
      // TODO: Implement playlist functionality
    }
  });

  // Initialize volume
  if (audioElement) {
    audioElement.volume = currentVolume / 100;
  }

  // Placeholder buttons
  if (prevBtn) {
    prevBtn.onclick = () => {
      showToast("Chức năng đang được phát triển", "info");
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      showToast("Chức năng đang được phát triển", "info");
    };
  }

  if (shuffleBtn) {
    shuffleBtn.onclick = () => {
      isShuffling = !isShuffling;
      shuffleBtn.classList.toggle("text-white", isShuffling);
      shuffleBtn.classList.toggle("text-white/70", !isShuffling);
    };
  }

  if (repeatBtn) {
    repeatBtn.onclick = () => {
      repeatMode = (repeatMode + 1) % 3;
      repeatBtn.classList.toggle("text-white", repeatMode > 0);
      repeatBtn.classList.toggle("text-white/70", repeatMode === 0);
    };
  }

  // Additional Footer controls
  const dislikeBtn = document.getElementById("audio-dislike-btn");
  const likeBtn = document.getElementById("audio-like-btn");
  const moreOptionsBtn = document.getElementById("audio-more-options-btn");
  const castBtn = document.getElementById("audio-cast-btn");
  const minimizeBtn = document.getElementById("audio-minimize-btn");

  if (dislikeBtn) {
    dislikeBtn.onclick = () => {
      showToast("Đã bỏ thích bài hát", "info");
    };
  }

  if (likeBtn) {
    likeBtn.onclick = () => {
      likeBtn.classList.toggle("text-red-500");
      const isLiked = likeBtn.classList.contains("text-red-500");
      showToast(
        isLiked
          ? "Đã thêm vào bài hát yêu thích"
          : "Đã xóa khỏi bài hát yêu thích",
        "success"
      );
    };
  }

  if (moreOptionsBtn) {
    moreOptionsBtn.onclick = () => {
      showToast("Chức năng đang được phát triển", "info");
    };
  }

  if (castBtn) {
    castBtn.onclick = () => {
      showToast("Chức năng đang được phát triển", "info");
    };
  }

  if (minimizeBtn) {
    minimizeBtn.onclick = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.classList.toggle("h-[8%]");
        footer.classList.toggle("h-[4%]");
      }
    };
  }

  audioPlayerInitialized = true;
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", render);
} else {
  render();
}
