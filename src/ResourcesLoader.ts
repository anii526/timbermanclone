import * as PIXI from "pixi.js";
// import * as WebFont from 'webfontloader';
// import { PreloaderManager } from './utils/preloader/preloader-manager';
// import { mainSlot } from 'index';
/**
 * Created by aniii526 on 1.09.2017.
 */
export class ResourcesLoader {
    protected loader: PIXI.Loader;
    protected fontFamilies: string[];
    protected fontUrls: string[];
    constructor() {
        this.loader = new PIXI.Loader();
    }
    public init() {
        return new Promise((resolve, reject) => {
            const version = 5;

            // this.loader.add("./timber/man.json?" + version);
            // this.loader.add("./timber/man.json?" + version);
            this.loader.add("bg", "./timber/background.png?" + version);
            this.loader.add("wdoh1.png", "./timber/wdoh1.png?" + version);
            this.loader.add("wdoh2.png", "./timber/wdoh2.png?" + version);
            this.loader.add("man1.png", "./timber/man1.png?" + version);
            this.loader.add("man2.png", "./timber/man2.png?" + version);
            this.loader.add("man3.png", "./timber/man3.png?" + version);
            this.loader.add("stump", "./timber/stump.png?" + version);
            this.loader.add("trunk1", "./timber/trunk1.png?" + version);
            this.loader.add("trunk2", "./timber/trunk2.png?" + version);
            this.loader.add("branchLeft", "./timber/branch1.png?" + version);
            this.loader.add("branchRight", "./timber/branch2.png?" + version);
            this.loader.add(
                "timeContainer",
                "./timber/time-container.png?" + version
            );
            this.loader.add("timeBar", "./timber/time-bar.png?" + version);
            this.loader.add("rip", "./timber/rip.png?" + version);

            this.loader.add("Numbers", "./timber/fonts/Numbers.xml");
            this.loader.add("LevelNumbers", "./timber/fonts/LevelNumbers.xml");
            this.loader.add("level", "./timber/level.png");
            this.loader.add("gameOver", "./timber/game-over.png");
            this.loader.add("btnPlay", "./timber/btn-play.png");
            this.loader.add("instructions", "./timber/instructions.png");
            // this.loader.add('super_win', 'assets/bigwin/great.png?' + version);
            // this.loader.add('you_win', 'assets/bigwin/you.png?' + version);
            // this.loader.add('shine_white', 'assets/bigwin/shine_white.png?' + version);
            // this.loader.add('assets/error/error0.json?' + version);

            // this.loader.add('info_back', 'assets/info_back.png?' + version);

            this.loader.on("progress", (loader, res) => {
                // (loader.progress);
                // PreloaderManager.instance.setProgress(loader.progress > 90 ? 90 : loader.progress)
            });

            this.loader.once("complete", (loader, res) => {
                // ('Нужно сделать загрузку шрифтов');
                // WebFont.load({
                //     custom: {
                //         families: this.fontFamilies,
                //         urls: this.fontUrls
                //     },
                //     active: () => {
                //         resolve();
                //     }
                // });
                resolve();
            });
            this.loader.on("error", () => {
                reject("ПРОИЗОШЛА ОШИБКА ЗАГРУЗКИ");
            });

            this.loader.load();
        });
    }
}
