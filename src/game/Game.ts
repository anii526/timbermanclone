import "pixi.js";
import { app } from "..";

export class Game extends PIXI.Sprite {
    private HEIGHT_TRUNK = 243;
    private stump: PIXI.Sprite;
    private trunks: PIXI.Sprite;
    constructor() {
        super();
    }
    public init() {
        this.createBg();
    }

    private createBg() {
        const bg = new PIXI.Sprite(app.getTexture('bg'));
        this.addChild(bg);

        this.stump = new PIXI.Sprite(app.getTexture('stump'));
        this.stump.position.set(352, 1394);
        this.addChild(this.stump);

        this.trunks = new PIXI.Sprite();
        this.addChild(this.trunks);

        const trunk1 = new PIXI.Sprite(app.getTexture('trunk1'));
        trunk1.position.set(37, 1151);
        trunk1.name = 'trunk1';
        this.trunks.addChild(trunk1);

        const trunk2 = new PIXI.Sprite(app.getTexture('trunk2'));
        trunk2.position.set(37, 1151 - this.HEIGHT_TRUNK);
        trunk2.name = 'trunk2';
        this.trunks.addChild(trunk2);

        this.constructTree();

        /////////// man ////////////

        const man = new PIXI.extras.AnimatedSprite([
            // PIXI.utils.TextureCache['wdoh2.png'],
            PIXI.utils.TextureCache['man1.png'],
            PIXI.utils.TextureCache['man2.png'],
            PIXI.utils.TextureCache['man3.png']
        ]);
        man.loop = false;
        man.animationSpeed = 20 / 60;
        man.position.x = 0;
        man.position.y = 1070;
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
        man2.position.x = man.position.x;
        man2.position.y = man.position.y;
        man2.play();
        this.addChild(man2);

        this.on('pointerdown', () => {
            man2.visible = false;
            man.visible = true;
            man.play();
        })

        this.interactive = true;
    }

    private constructTree() {
        // On construit le reste de l'arbre
        for (let i = 0; i < 4; i++) {
            this.addTrunk();
        }
    }
    private addTrunk() {
        const trunks = ['trunk1', 'trunk2'];
        const branchs = ['branchLeft', 'branchRight'];
        const trunk = new PIXI.Sprite();
        trunk.position.x = 37
        trunk.position.y = this.stump.y - this.HEIGHT_TRUNK * (this.trunks.children.length + 1);

        const index = Math.floor(Math.random() * 2);

        if (branchs.indexOf(this.trunks.getChildAt(this.trunks.children.length - 1).name) === -1) {
            if (Math.random() * 4 <= 1) {
                trunk.name = trunks[index];
            }
            else {
                trunk.name = branchs[index];
            }
        }
        else {
            trunk.name = trunks[index];
        }

        trunk.texture = app.getTexture(trunk.name);
        this.trunks.addChild(trunk);

    }
}