import "./assets/style.css";
import app from "./app";
import { searchSongs } from "./utils/Request";
import { setCurrentPage, renderPage, getCurrentPage } from "./utils/Router";

const render = async () => {
  document.querySelector("#app").innerHTML = await app();

  // Function để setup scroll cho một container
  const setupScroll = (containerId, prevBtnId, nextBtnId) => {
    const scrollContainer = document.getElementById(containerId);
    const scrollPrevBtn = document.getElementById(prevBtnId);
    const scrollNextBtn = document.getElementById(nextBtnId);

    if (scrollContainer && scrollPrevBtn && scrollNextBtn) {
      // Tính scrollAmount dựa trên chiều rộng của một cột + gap
      const getScrollAmount = () => {
        const columns = Array.from(scrollContainer.children);
        if (columns.length > 0) {
          const firstColumn = columns[0];
          const columnWidth = firstColumn.offsetWidth;
          // gap-6 = 1.5rem = 24px hoặc gap-4 = 1rem = 16px
          const gap = containerId === "songs-scroll-container" ? 24 : 16;
          return columnWidth + gap;
        }
        // Fallback: scroll 1/3 container width
        return scrollContainer.offsetWidth / 3;
      };

      scrollPrevBtn.addEventListener("click", () => {
        const scrollAmount = getScrollAmount();
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });

      scrollNextBtn.addEventListener("click", () => {
        const scrollAmount = getScrollAmount();
        scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  };

  // Setup scroll cho phần songs
  setupScroll(
    "songs-scroll-container",
    "songs-scroll-prev",
    "songs-scroll-next"
  );

  // Setup scroll cho phần videos
  setupScroll(
    "videos-scroll-container",
    "videos-scroll-prev",
    "videos-scroll-next"
  );

  // Setup scroll cho phần albums
  setupScroll(
    "albums-scroll-container",
    "albums-scroll-prev",
    "albums-scroll-next"
  );

  // Setup scroll cho phần mood-genre
  setupScroll(
    "mood-genre-scroll-container",
    "mood-genre-scroll-prev",
    "mood-genre-scroll-next"
  );

  // Setup scroll cho phần new-music
  setupScroll(
    "new-music-scroll-container",
    "new-music-scroll-prev",
    "new-music-scroll-next"
  );

  // Setup search functionality
  const searchInput = document.getElementById("search");
  const searchResults = document.getElementById("search-results");

  console.log("Search input:", searchInput);
  console.log("Search results container:", searchResults);

  // Function để hiển thị kết quả tìm kiếm
  const displaySearchResults = (results) => {
    console.log("Displaying search results:", results);
    if (!searchResults) {
      console.error("Search results container not found!");
      return;
    }

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="p-4 text-white/50 text-center">
          <p>Không tìm thấy kết quả</p>
        </div>
      `;
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

  // Function để ẩn kết quả tìm kiếm
  const hideSearchResults = () => {
    if (searchResults) {
      searchResults.classList.add("hidden");
    }
  };

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim();

      // Debounce: đợi 300ms sau khi người dùng ngừng gõ
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        if (query.length > 0) {
          console.log("Searching for:", query);
          const results = await searchSongs(query);
          console.log("Search results received:", results);
          displaySearchResults(results);
        } else {
          hideSearchResults();
        }
      }, 300);
    });

    // Xử lý khi nhấn Enter
    searchInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const query = e.target.value.trim();
        if (query.length > 0) {
          const results = await searchSongs(query);
          displaySearchResults(results);
        }
      }
    });

    // Ẩn kết quả khi click ra ngoài
    document.addEventListener("click", (e) => {
      if (
        searchInput &&
        searchResults &&
        !searchInput.contains(e.target) &&
        !searchResults.contains(e.target)
      ) {
        hideSearchResults();
      }
    });

    // Focus vào input để hiển thị kết quả
    searchInput.addEventListener("focus", async (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        const results = await searchSongs(query);
        displaySearchResults(results);
      }
    });
  }

  // Setup navigation
  const navItems = document.querySelectorAll(".nav-item");
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

    const setupScroll = (containerId, prevBtnId, nextBtnId) => {
      const scrollContainer = document.getElementById(containerId);
      const scrollPrevBtn = document.getElementById(prevBtnId);
      const scrollNextBtn = document.getElementById(nextBtnId);

      if (scrollContainer && scrollPrevBtn && scrollNextBtn) {
        const getScrollAmount = () => {
          const columns = Array.from(scrollContainer.children);
          if (columns.length > 0) {
            const firstColumn = columns[0];
            const columnWidth = firstColumn.offsetWidth;
            const gap = containerId === "songs-scroll-container" ? 24 : 16;
            return columnWidth + gap;
          }
          return scrollContainer.offsetWidth / 3;
        };

        scrollPrevBtn.addEventListener("click", () => {
          const scrollAmount = getScrollAmount();
          scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
          });
        });

        scrollNextBtn.addEventListener("click", () => {
          const scrollAmount = getScrollAmount();
          scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        });
      }
    };

    setupScroll(
      "songs-scroll-container",
      "songs-scroll-prev",
      "songs-scroll-next"
    );
    setupScroll(
      "videos-scroll-container",
      "videos-scroll-prev",
      "videos-scroll-next"
    );
    setupScroll(
      "albums-scroll-container",
      "albums-scroll-prev",
      "albums-scroll-next"
    );
    setupScroll(
      "mood-genre-scroll-container",
      "mood-genre-scroll-prev",
      "mood-genre-scroll-next"
    );
  };

  navItems.forEach((item) => {
    const route = item.getAttribute("data-route");
    if (route === currentRoute) {
      item.classList.add("active");
    }

    item.addEventListener("click", () => {
      const route = item.getAttribute("data-route");
      navigateToPage(route);
    });
  });

  const logoContainer = document.getElementById("logo-container");
  if (logoContainer) {
    logoContainer.addEventListener("click", () => {
      const route = logoContainer.getAttribute("data-route");
      navigateToPage(route);
    });
  }
};

render();
