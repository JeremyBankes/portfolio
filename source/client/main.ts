import { Wallpaper } from "./Wallpaper.js";

const styles = [
    "color: #AA30AA;",
    "color: #DF90DF;",
    "color: #AA30AA;",
    "color: #606060;",
    "color: #505050;",
];

console.log("\n%cWelcome to %cWonderland%c.\n       ~ %cJeremy %cBankes\n", ...styles);

const canvas = document.getElementById("wallpaperCanvas");
if (canvas instanceof HTMLCanvasElement) {
    const wallpaper = new Wallpaper(canvas);
    wallpaper.start();
}