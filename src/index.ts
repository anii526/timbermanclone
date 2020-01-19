import "babel-polyfill";
import { App } from "./App";
import "./index.css";
import { Utils } from "./utils";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("sw.js")
        .then(reg => {
            console.log("Registration succeeded. Scope is " + reg.scope);
        })
        .catch(error => {
            console.error("Trouble with sw: ", error);
        });
}

export let ysdk: any;

const isFullscreen: boolean = Utils.isMobile();

(window as any).YaGames.init({
    adv: {
        onAdvClose: (wasShown: any) => {
            console.info("adv closed!", wasShown);
        }
    },
    screen: {
        fullscreen: isFullscreen,
        orientation: "portrait"
    }
}).then((yasdk: any) => {
    ysdk = yasdk;
});

export let localStorageTime = "timber_timeshowadv";
export let localStorageName = "timber_bestballscore";

const lastTime = +(localStorage.getItem(localStorageTime) === null
    ? 0
    : localStorage.getItem(localStorageTime));
export let timeLastShowFullscreenAdv = { value: lastTime };

export const app = new App();
app.init();
(window as any).app = app;
