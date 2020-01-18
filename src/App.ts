import { Game } from "./game/Game";
import { GameData } from "./GameData";
import { PixiHelper } from "./PixiHelper";
import { ResourcesLoader } from "./ResourcesLoader";
import { Sounds } from "./sounds/sounds";
import { SoundsManager } from "./sounds/sounds-manager";
// import { PreloaderManager } from "./utils/preloader/preloader-manager";
const TWEEN = require("tween.js");
export class App {
    public pixi: PixiHelper;
    public container: PIXI.Container;
    public stage: PIXI.Container;
    public data: GameData;
    // public root: any;
    constructor() {
        this.pixi = new PixiHelper();
    }
    public async init() {
        this.data = new GameData();
        this.data.checkMobile();

        // PreloaderManager.instance.init();

        // this.root = document.getElementById("root");

        this.container = await this.pixi.init();
        this.initEventResize();

        const resLoadManager = new ResourcesLoader();
        await resLoadManager.init();

        const sounds = new Sounds();
        sounds.init();
        SoundsManager.loadSounds(sounds);

        // SoundsManager.play(Sounds.MUSIC);

        this.stage = this.pixi.app.stage;

        const game = new Game();
        game.init();
        this.stage.addChild(game);

        // PreloaderManager.instance.setProgress(100, () => {
        //     // вызывается когда заканчивается анимация угасания экрана
        //     ('Открылась игра');
        //     // SoundsManager.play(Sounds.MUSIC);
        // });
    }
    public getTexturesForName(
        nameTextures: string,
        countTextures: number,
        nameResolution: string = ".png"
    ): PIXI.Texture[] {
        const texrures: PIXI.Texture[] = [];
        let indexName: string = "";
        for (let i: number = 1; i <= countTextures; i++) {
            indexName = i.toString();
            const texture: PIXI.Texture =
                PIXI.utils.TextureCache[
                    nameTextures + indexName + nameResolution
                ];
            if (texture) {
                texrures.push(texture);
            }
        }
        return texrures;
    }
    public getTexture(name: string): PIXI.Texture {
        const texture: PIXI.Texture = PIXI.utils.TextureCache[name];
        if (!texture) {
            throw new Error("Нет Текстуры для: " + name);
        } else {
            return texture;
        }
    }
    private animate(time: number) {
        TWEEN.update(time);
        requestAnimationFrame((delta: number) => this.animate(delta));
    }
    private initEventResize(): void {
        if (!this.data.isMobile) {
            window.addEventListener(
                "resize",
                () => {
                    this.resize();
                },
                false
            );
            this.resize();
        } else {
            window.addEventListener(
                "orientationchange",
                () => {
                    this.resize();
                },
                false
            );
            window.addEventListener(
                "resize",
                () => {
                    this.resize();
                },
                false
            );
            this.resize();
        }
        this.animate(0);
    }
    private resize() {
        // ресайз возможно подвергнется тотальной переработке.
        const w = (this.data.width = window.innerWidth);
        const h = (this.data.height = window.innerHeight);
        let scale = 1;

        if (this.container) {
            // debugger;
            scale = Math.min(
                w / GameData.ASSETS_WIDTH,
                h / GameData.ASSETS_HEIGHT
            );

            this.container.scale.x = this.container.scale.y = scale;
            // mainSlot.mainStage.scale.x += 0.008;

            this.pixi.app.view.width = GameData.ASSETS_WIDTH * scale;
            this.pixi.app.view.height = GameData.ASSETS_HEIGHT * scale;
            this.pixi.app.view.style.left =
                (w - this.pixi.app.view.width) / 2 + "px";
            this.pixi.app.view.style.top =
                (h - this.pixi.app.view.height) / 2 + "px";
            this.pixi.app.renderer.resize(
                this.pixi.app.view.width,
                this.pixi.app.view.height
            );

            // this.root.style.width = window.innerWidth + "px";
            // this.root.style.height = window.innerHeight + "px";
        }
    }
}
