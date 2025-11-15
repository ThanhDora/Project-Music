import { BiSearch } from "react-icons/bi";
import { FaChromecast } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { HiMiniBars3 } from "react-icons/hi2";
import { RiHomeHeartFill } from "react-icons/ri";
import { TbBrandSafari } from "react-icons/tb";
import { FaRegBookmark } from "react-icons/fa";
import { GrUpgrade } from "react-icons/gr";
import { MdAdd } from "react-icons/md";
import { TiPin } from "react-icons/ti";
import { renderIcon } from "./Icon";

export const Icons = {
  search: (props = {}) =>
    renderIcon(BiSearch, {
      className: "search-icon",
      size: 30,
      color: "#ffffff50",
      ...props,
    }),

  chromecast: (props = {}) =>
    renderIcon(FaChromecast, {
      className: "chromecast-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),

  profile: (props = {}) =>
    renderIcon(CgProfile, {
      className: "profile-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),

  bars: (props = {}) =>
    renderIcon(HiMiniBars3, {
      className: "bars-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),

  home: (props = {}) =>
    renderIcon(RiHomeHeartFill, {
      className: "home-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  safari: (props = {}) =>
    renderIcon(TbBrandSafari, {
      className: "safari-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  bookmark: (props = {}) =>
    renderIcon(FaRegBookmark, {
      className: "bookmark-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  upgrade: (props = {}) =>
    renderIcon(GrUpgrade, {
      className: "upgrade-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  add: (props = {}) =>
    renderIcon(MdAdd, {
      className: "add-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  pin: (props = {}) =>
    renderIcon(TiPin, {
      className: "pin-icon",
      size: 15,
      color: "#ffffff50",
      ...props,
    }),
};
