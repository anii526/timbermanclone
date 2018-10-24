import { GameData } from "./GameData";
import { PixiHelper } from "./PixiHelper";
// import { PreloaderManager } from "./utils/preloader/preloader-manager";
const TWEEN = require("tween.js");
export class App {
    public pixi: PixiHelper;
    public stage: PIXI.Container;
    public data: GameData;
    constructor() {
        this.pixi = new PixiHelper();
    }
    public async  init() {
        // PreloaderManager.instance.init();

        this.data = new GameData();
        this.data.checkMobile();

        this.stage = await this.pixi.init();
        this.initEventResize();

        PIXI.loader.add('bg', './timber/background.png').load((loader: any, resources: any) => {
            // This creates a texture from a 'bunny.png' image
            const bg = new PIXI.Sprite(resources.bg.texture);
            // Add the bunny to the scene we are building
            this.pixi.app.stage.addChild(bg);

            PIXI.loader.add('bunny', './timber/bunny.png').load((loader2: any, resources2: any) => {
                // This creates a texture from a 'bunny.png' image
                const bunny = new PIXI.Sprite(resources2.bunny.texture);
                // Setup the position of the bunny
                bunny.x = 500 / 2;
                bunny.y = 500 / 2;

                // Rotate around the center
                bunny.anchor.x = 0.5;
                bunny.anchor.y = 0.5;

                // Add the bunny to the scene we are building
                this.pixi.app.stage.addChild(bunny);

                // Listen for frame updates
                this.pixi.app.ticker.add((delta) => {
                    // each frame we spin the bunny around a bit
                    bunny.rotation += 0.1 * delta;
                });
            });
        });

        // PreloaderManager.instance.setProgress(100, () => {
        //     // вызывается когда заканчивается анимация угасания экрана
        //     console.log('Открылась игра');
        //     // SoundsManager.play(Sounds.MUSIC);
        // });
    }
    public getTexturesForName(nameTextures: string, countTextures: number, nameResolution: string = '.png'): PIXI.Texture[] {
        const texrures: PIXI.Texture[] = [];
        let indexName: string = '';
        for (let i: number = 1; i <= countTextures; i++) {
            indexName = i.toString();
            const texture: PIXI.Texture = PIXI.utils.TextureCache[nameTextures + indexName + nameResolution];
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
        }
        else {
            return texture;
        }
    }
    private animate(time: number) {
        TWEEN.update(time);
        requestAnimationFrame((delta: number) => this.animate(delta));
    }
    private initEventResize(): void {
        if (!this.data.isMobile) {
            window.addEventListener('resize', () => { this.resize(); }, false);
            this.resize();
        } else {
            window.addEventListener('orientationchange', () => { this.resize(); }, false);
            window.addEventListener('resize', () => { this.resize(); }, false);
            this.resize();
        }
        this.animate(0);
    }
    private resize() {
        // ресайз возможно подвергнется тотальной переработке.
        const w = this.data.width = window.innerWidth;
        const h = this.data.height = window.innerHeight;
        let scale = 1;

        if (this.stage) {
            // debugger;
            scale = Math.min(w / GameData.ASSETS_WIDTH, h / GameData.ASSETS_HEIGHT);

            this.stage.scale.x = this.stage.scale.y = scale;
            // mainSlot.mainStage.scale.x += 0.008;

            this.pixi.app.view.width = (GameData.ASSETS_WIDTH * scale);
            this.pixi.app.view.height = (GameData.ASSETS_HEIGHT * scale);
            this.pixi.app.view.style.left = (w - this.pixi.app.view.width) / 2 + "px";
            this.pixi.app.view.style.top = (h - this.pixi.app.view.height) / 2 + "px";
            this.pixi.app.renderer.resize(this.pixi.app.view.width, this.pixi.app.view.height);
        }
    }
}