import "pixi.js";
import { app } from "..";

export class Game extends PIXI.Sprite {
    private HEIGHT_TRUNK = 243;
    private WIDTH_GAME = 1080;
    private stump: PIXI.Sprite;
    private trunks: PIXI.Sprite;
    private manContainer: PIXI.Sprite;
    private manPosition: string;
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

        this.manContainer = new PIXI.Sprite();
        this.manContainer.position.x = 0;
        this.manContainer.position.y = 1070;
        this.addChild(this.manContainer);

        const man = new PIXI.extras.AnimatedSprite([
            // PIXI.utils.TextureCache['wdoh2.png'],
            PIXI.utils.TextureCache['man1.png'],
            PIXI.utils.TextureCache['man2.png'],
            PIXI.utils.TextureCache['man3.png']
        ]);
        man.loop = false;
        man.animationSpeed = 20 / 60;
        man.visible = false;
        man.gotoAndStop(0);
        man.onComplete = () => {
            man.gotoAndStop(0);
            man.visible = false;
            man2.visible = true;
        }
        this.manContainer.addChild(man);

        const man2 = new PIXI.extras.AnimatedSprite([
            PIXI.utils.TextureCache['wdoh1.png'],
            PIXI.utils.TextureCache['wdoh2.png']
        ]);
        man2.loop = true;
        man2.animationSpeed = 3 / 60;
        man2.play();
        this.manContainer.addChild(man2);

        bg.on('pointerdown', (e: PIXI.interaction.InteractionEvent) => {
            man2.visible = false;
            man.visible = true;
            man.play();
            const posX = Math.round(this.toLocal(e.data.global).x);

            if (posX <= this.WIDTH_GAME / 2) {
                this.manContainer.scale.x = 1;
                this.manContainer.x = 0;
                this.manPosition = 'left';
            } else {
                this.manContainer.scale.x = -1;
                this.manContainer.x = 1080;
                this.manPosition = 'right';
            }
        })

        bg.interactive = true;
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