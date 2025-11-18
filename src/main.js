import "./assets/style.css";
import app from "./app";
import { searchSongs, createPlaylistAPI, getPlaylists } from "./utils/Request";
import { setCurrentPage, renderPage, getCurrentPage } from "./utils/Router";

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

  scrollPrevBtn.addEventListener("click", () => scroll(-1));
  scrollNextBtn.addEventListener("click", () => scroll(1));
};

const initScrollContainers = () => {
  SCROLL_CONTAINERS.forEach(({ container, prev, next, gap }) => {
    setupScroll(container, prev, next, gap);
  });
};

const initSearch = () => {
  const searchInput = document.getElementById("search");
  const searchResults = document.getElementById("search-results");
  if (!searchInput || !searchResults) return;

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
        <div class="flex items-center gap-3 p-3 hover:bg-[#ffffff17] cursor-pointer transition-colors">
          <img src="${
            song.img || "/src/assets/images/git.jpg"
          }" alt="album" class="w-12 h-12 rounded-lg object-cover shrink-0">
          <div class="flex flex-col gap-1 min-w-0 flex-1">
            <h5 class="text-white text-sm font-semibold truncate">${
              song.title
            }</h5>
            <p class="text-white/60 text-xs truncate">${song.artist}</p>
            <p class="text-white/40 text-xs truncate">${song.album}</p>
          </div>
        </div>
      `
      )
      .join("");
    searchResults.classList.remove("hidden");
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
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(e.target.value.trim()), 300);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch(e.target.value.trim());
  });

  searchInput.addEventListener("focus", (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) performSearch(query);
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      hideSearchResults();
    }
  });
};

const initNavigation = () => {
  const navItems = document.querySelectorAll(".nav-item");
  const logoContainer = document.getElementById("logo-container");
  const currentRoute = getCurrentPage();

  const navigateToPage = async (route) => {
    if (!route) return;

    setCurrentPage(route);
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.innerHTML = await renderPage(route);
    }

    navItems.forEach((nav) => {
      const navRoute = nav.getAttribute("data-route");
      nav.classList.toggle("active", navRoute === route);
    });

    initScrollContainers();
  };

  navItems.forEach((item) => {
    const route = item.getAttribute("data-route");
    if (route === currentRoute) item.classList.add("active");
    item.addEventListener("click", () => navigateToPage(route));
  });

  if (logoContainer) {
    logoContainer.addEventListener("click", () => {
      navigateToPage(logoContainer.getAttribute("data-route"));
    });
  }
};

const initPlaylists = () => {
  const addPlaylistBtn = document.getElementById("add-playlist-btn");
  const playlistModal = document.getElementById("playlist-modal");
  const playlistModalBackdrop = document.getElementById(
    "playlist-modal-backdrop"
  );
  const newPlaylistForm = document.getElementById("new-playlist-form");
  const cancelPlaylistBtn = document.getElementById("cancel-playlist-btn");
  const playlistsContainer = document.getElementById("playlists-container");

  if (!playlistsContainer) return;

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
          <div class="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2">
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

  if (addPlaylistBtn) addPlaylistBtn.addEventListener("click", openModal);
  if (playlistModalBackdrop)
    playlistModalBackdrop.addEventListener("click", closeModal);
  if (cancelPlaylistBtn)
    cancelPlaylistBtn.addEventListener("click", closeModal);

  if (newPlaylistForm) {
    newPlaylistForm.addEventListener("submit", async (e) => {
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
    });
  }

  renderPlaylists();
};

const render = async () => {
  document.querySelector("#app").innerHTML = await app();
  initScrollContainers();
  initSearch();
  initNavigation();
  initPlaylists();
};

render();
