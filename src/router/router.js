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
const PARAMS_KEY = "currentPageParams";

function getStoredPage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && routes[stored] ? stored : "home";
  } catch (e) {
    return "home";
  }
}

function getStoredParams() {
  try {
    const stored = localStorage.getItem(PARAMS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
}

let currentPage = getStoredPage();
let currentParams = getStoredParams();

export function getCurrentPage() {
  return currentPage;
}

export function getCurrentParams() {
  return currentParams;
}

export function setCurrentPage(page, params = {}) {
  if (routes[page]) {
    currentPage = page;
    currentParams = params;
    try {
      localStorage.setItem(STORAGE_KEY, page);
      localStorage.setItem(PARAMS_KEY, JSON.stringify(params));
    } catch (e) {}
    return true;
  }
  return false;
}

export async function renderPage(page = currentPage, params = null) {
  const PageComponent = routes[page];
  if (PageComponent) {
    // Use provided params or fallback to stored params
    const finalParams = params !== null ? params : currentParams;

    if (page === "song-details" && finalParams.songId) {
      return await PageComponent(finalParams.songId);
    }
    if (page === "video-details" && finalParams.videoId) {
      return await PageComponent(finalParams.videoId);
    }
    if (page === "album-details" && finalParams.albumSlug) {
      return await PageComponent(finalParams.albumSlug);
    }
    return await PageComponent();
  }
  return await routes.home();
}

export function getRoutes() {
  return Object.keys(routes);
}
