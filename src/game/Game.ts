import "pixi.js";
import { app } from "..";

export class Game extends PIXI.Sprite {
    constructor() {
        super();
    }
    public init() {
        this.createBg();
    }

    private createBg() {
        const bg = new PIXI.Sprite(app.getTexture('bg'));
        this.addChild(bg);

        const man = new PIXI.extras.AnimatedSprite([
            // PIXI.utils.TextureCache['wdoh2.png'],
            PIXI.utils.TextureCache['man1.png'],
            PIXI.utils.TextureCache['man2.png'],
            PIXI.utils.TextureCache['man3.png']
        ]);
        man.loop = false;
        man.animationSpeed = 20 / 60;
        man.position.x = 0;
        man.position.y = 0;
        man.visible = false;
        man.gotoAndStop(0);
        man.onComplete = () => {
            man.gotoAndStop(0);
            man.visible = false;
            man2.visible = true;
        }
        this.addChild(man);

        const man2 = new PIXI.extras.AnimatedSprite([
            PIXI.utils.TextureCache['wdoh1.png'],
            PIXI.utils.TextureCache['wdoh2.png']
        ]);
        man2.loop = true;
        man2.animationSpeed = 3 / 60;
        man2.position.x = 0;
        man2.position.y = 0;
        man2.play();
        this.addChild(man2);

        this.on('pointerdown', () => {
            man2.visible = false;
            man.visible = true;
            man.play();
        })

        this.interactive = true;
    }
}