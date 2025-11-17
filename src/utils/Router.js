import Home from "../pages/Home";
import Discover from "../pages/Discover";
import Lodash from "../pages/Lodash";
import UpgradePlan from "../pages/UpgradePlan";

const routes = {
  home: Home,
  discover: Discover,
  lodash: Lodash,
  upgrade: UpgradePlan,
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

export async function renderPage(page = currentPage) {
  const PageComponent = routes[page];
  if (PageComponent) {
    return await PageComponent();
  }
  return await routes.home();
}

export function getRoutes() {
  return Object.keys(routes);
}
