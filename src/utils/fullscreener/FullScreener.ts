/**
 * Created by ctretyak on 09.03.2017.
 */
const fingerUp = require("./finger-up.png");
import { Utils } from "services/utils";
import "./style.css";
import { swiper } from "./swiper.js";
export class FullScreener {
    public static get instance() {
        return FullScreener.instanceStatic || (FullScreener.instanceStatic = new FullScreener());
    }

    private static instanceStatic: FullScreener;
    private inited: boolean = false;

    private constructor() {
    }
    public init() {
        if (this.inited) {
            return;
        }
        this.inited = true;
        if (Utils.isMobileOrTablet()) {
            const swiperRoot = document.createElement("div");
            document.body.appendChild(swiperRoot);
            const screenIncreser = document.createElement("div");
            screenIncreser.id = "screen-increaser";
            document.body.appendChild(screenIncreser);
            // tslint:disable-next-line:no-unused-expression
            new (swiper as any)(swiperRoot, fingerUp);

            if (Utils.isMobileSafari()) {
                setInterval(() => {
                    if (window.scrollY > 2) {
                        window.scroll(0, 1);
                    }
                }, 50);
                document.documentElement.addEventListener('gesturestart', (event) => {
                    event.preventDefault();
                }, false);

                let lastTouchEnd = 0;
                document.documentElement.addEventListener('touchend', (event) => {
                    const now = (new Date()).getTime();
                    if (now - lastTouchEnd <= 300) {
                        event.preventDefault();
                    }
                    lastTouchEnd = now;
                }, false);
            }
        }
    }
}
