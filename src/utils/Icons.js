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
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import { AiOutlineDislike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoVolumeHigh } from "react-icons/io5";
import { IoMdVolumeOff } from "react-icons/io";
import { LuRepeat1 } from "react-icons/lu";
import { FaShuffle } from "react-icons/fa6";
import { IoPlaySharp } from "react-icons/io5";
import { RxSlider } from "react-icons/rx";
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
  play: (props = {}) =>
    renderIcon(FaPlay, {
      className: "play-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  playSkipBack: (props = {}) =>
    renderIcon(IoPlaySkipBackSharp, {
      className: "play-skip-back-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  playSkipForward: (props = {}) =>
    renderIcon(IoPlaySkipForward, {
      className: "play-skip-forward-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  dislike: (props = {}) =>
    renderIcon(AiOutlineDislike, {
      className: "dislike-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  like: (props = {}) =>
    renderIcon(AiOutlineLike, {
      className: "like-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  threeDotsVertical: (props = {}) =>
    renderIcon(BsThreeDotsVertical, {
      className: "three-dots-vertical-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  volumeHigh: (props = {}) =>
    renderIcon(IoVolumeHigh, {
      className: "volume-high-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  volumeOff: (props = {}) =>
    renderIcon(IoMdVolumeOff, {
      className: "volume-off-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  repeat1: (props = {}) =>
    renderIcon(LuRepeat1, {
      className: "repeat1-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  shuffle: (props = {}) =>
    renderIcon(FaShuffle, {
      className: "shuffle-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  playSharp: (props = {}) =>
    renderIcon(IoPlaySharp, {
      className: "play-sharp-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
  slider: (props = {}) =>
    renderIcon(RxSlider, {
      className: "slider-icon",
      size: 30,
      color: "#fff",
      ...props,
    }),
};
