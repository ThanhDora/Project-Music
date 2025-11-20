import Home from "../pages/Home";
import Discover from "../pages/Discover";
import Lodash from "../pages/Lodash";
import UpgradePlan from "../pages/UpgradePlan";
import Charts from "../pages/Charts";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import SongDetails from "../pages/SongDetails";
import VideoDetails from "../pages/VideoDetails";
import AlbumDetails from "../pages/AlbumDetails";

const routes = {
  home: Home,
  discover: Discover,
  lodash: Lodash,
  upgrade: UpgradePlan,
  charts: Charts,
  login: Login,
  profile: Profile,
  "song-details": SongDetails,
  "video-details": VideoDetails,
  "album-details": AlbumDetails,
};

const STORAGE_KEY = "currentPage";

function getStoredPage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && routes[stored] ? stored : "home";
  } catch (e) {
    return "home";
  }
}

let currentPage = getStoredPage();

export function getCurrentPage() {
  return currentPage;
}

export function setCurrentPage(page) {
  if (routes[page]) {
    currentPage = page;
    try {
      localStorage.setItem(STORAGE_KEY, page);
    } catch (e) {
      console.error("Error saving page to localStorage:", e);
    }
    return true;
  }
  return false;
}

export async function renderPage(page = currentPage, params = {}) {
  const PageComponent = routes[page];
  if (PageComponent) {
    if (page === "song-details" && params.songId) {
      return await PageComponent(params.songId);
    }
    if (page === "video-details" && params.videoId) {
      return await PageComponent(params.videoId);
    }
    if (page === "album-details" && params.albumSlug) {
      return await PageComponent(params.albumSlug);
    }
    return await PageComponent();
  }
  return await routes.home();
}

export function getRoutes() {
  return Object.keys(routes);
}
