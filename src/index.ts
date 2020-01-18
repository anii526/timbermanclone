import "babel-polyfill";
import { App } from "./App";
import "./index.css";

export let ysdk: any;

(window as any).YaGames.init({
    adv: {
        onAdvClose: (wasShown: any) => {
            console.info("adv closed!", wasShown);
        }
    },
    screen: {
        fullscreen: false
    }
}).then((yasdk: any) => {
    ysdk = yasdk;
});

export const app = new App();
app.init();
(window as any).app = app;
