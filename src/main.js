import "./assets/style.css";
import app from "./app";

const render = async () => {
  document.querySelector("#app").innerHTML = await app();
};

render();
