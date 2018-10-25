import * as PIXI from 'pixi.js';
// import * as WebFont from 'webfontloader';
// import { PreloaderManager } from './utils/preloader/preloader-manager';
// import { mainSlot } from 'index';
/**
 * Created by aniii526 on 1.09.2017.
 */
export class ResourcesLoader {
    protected loader: PIXI.loaders.Loader;
    protected fontFamilies: string[];
    protected fontUrls: string[];
    constructor() {
        this.loader = new PIXI.loaders.Loader();
    }
    public init() {
        return new Promise((resolve, reject) => {
            const version = 4;

            this.loader.add('./timber/man.json?' + version);
            this.loader.add('bg', './timber/background.png?' + version);
            this.loader.add('bunny', './timber/bunny.png?' + version);
            // this.loader.add('super_win', 'assets/bigwin/great.png?' + version);
            // this.loader.add('you_win', 'assets/bigwin/you.png?' + version);
            // this.loader.add('shine_white', 'assets/bigwin/shine_white.png?' + version);
            // this.loader.add('assets/error/error0.json?' + version);

            // this.loader.add('info_back', 'assets/info_back.png?' + version);

            this.loader.on('progress', (loader, res) => {
                // console.log(loader.progress);
                // PreloaderManager.instance.setProgress(loader.progress > 90 ? 90 : loader.progress)
            });

            this.loader.once("complete", (loader, res) => {
                console.log('Нужно сделать загрузку шрифтов');
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
            this.loader.on('error', () => {
                reject("ПРОИЗОШЛА ОШИБКА ЗАГРУЗКИ");
            });

            this.loader.load();
        });
    }
}