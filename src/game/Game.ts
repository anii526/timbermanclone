import * as PIXI from "pixi.js";
import {
    app,
    localStorageName,
    localStorageTime,
    timeLastShowFullscreenAdv,
    ysdk
} from "..";
import { Sounds } from "../sounds/sounds";
import { SoundsManager } from "../sounds/sounds-manager";
const TWEEN = require("tween.js");

export class Game extends PIXI.Sprite {
    private GAME_START = false;
    private GAME_OVER = false;
    private HEIGHT_TRUNK = 243;
    private WIDTH_GAME = 1080;
    private stump: PIXI.Sprite;
    private trunks: PIXI.Sprite;
    private manContainer: PIXI.Sprite;
    private timeContainer: PIXI.Sprite;
    private timeBar: PIXI.Sprite;
    private timeBarMask: PIXI.Graphics;
    private rip: PIXI.Sprite;
    private timeBarWidth: number;
    private timeBarWidthComplete: number;
    private manPosition: string;
    private canCut: boolean;
    private currentScore: number;
    private currentLevel: number;
    private summTF: PIXI.BitmapText;
    private summBestTF: PIXI.BitmapText;
    private summScoretTF: PIXI.BitmapText;
    private textStyle: any = {
        font: "Numbers",
        align: "center"
    };
    private levelTF: PIXI.BitmapText;
    private textStyleLevel: any = {
        font: "LevelNumbers",
        align: "center"
    };
    private musicPlay: boolean = false;
    private gameOver: PIXI.Sprite;
    private manCut: PIXI.AnimatedSprite;
    private manIdle: PIXI.AnimatedSprite;
    private bestScore: number = 0;
    private instructions: PIXI.Sprite;
    private instructionsRemove: boolean;
    private btnPlay: PIXI.Sprite;
    constructor() {
        super();
    }
    public init() {
        this.bestScore = +(localStorage.getItem(localStorageName) === null
            ? 0
            : localStorage.getItem(localStorageName));

        this.createBg();
        this.createOthersElements();
        this.createInstructions();

        document.addEventListener("keydown", (key: any) => {
            if (this.GAME_OVER) {
                if (this.btnPlay.interactive) {
                    this.reset();
                }
            }
            if (key.keyCode === 37) {
                this.listener(undefined, "left");
            } else if (key.keyCode === 39) {
                this.listener(undefined, "right");
            }
        });
    }
    private createInstructions() {
        this.instructions = new PIXI.Sprite(app.getTexture("instructions"));
        this.instructions.anchor.set(0.5, 0.5);
        this.instructions.position.set(this.WIDTH_GAME / 2, 1300);
        this.addChild(this.instructions);

        this.instructionsRemove = false;
    }

    private createBg() {
        this.currentScore = 0;
        this.currentLevel = 0;

        const bg = new PIXI.Sprite(app.getTexture("bg"));
        this.addChild(bg);

        this.stump = new PIXI.Sprite(app.getTexture("stump"));
        this.stump.position.set(352, 1394);
        this.addChild(this.stump);

        bg.on("pointerdown", this.listener);
        bg.interactive = true;
    }
    private listener = (
        e?: PIXI.interaction.InteractionEvent,
        action?: string
    ) => {
        if (this.GAME_OVER) {
            return;
        }
        // if (this.canCut) {
        if (!this.GAME_START && !this.musicPlay) {
            this.GAME_START = true;
            // On active la musique de fond
            SoundsManager.play(Sounds.MUSIC);
            this.musicPlay = true;
            if (!this.instructionsRemove) {
                this.removeChild(this.instructions);
                this.instructionsRemove = true;
            }
        }
        this.manIdle.visible = false;
        this.manCut.visible = true;
        this.manCut.play();
        if (e) {
            const posX = Math.round(this.toLocal(e.data.global).x);
            if (posX <= this.WIDTH_GAME / 2) {
                this.manContainer.scale.x = 1;
                this.manContainer.x = 0;
                this.manPosition = "left";
            } else {
                this.manContainer.scale.x = -1;
                this.manContainer.x = 1080;
                this.manPosition = "right";
            }
        } else if (action) {
            if (action === "left") {
                this.manContainer.scale.x = 1;
                this.manContainer.x = 0;
                this.manPosition = "left";
            } else {
                this.manContainer.scale.x = -1;
                this.manContainer.x = 1080;
                this.manPosition = "right";
            }
        }

        const nameTrunkToCut = this.trunks.getChildAt(0).name;
        if (
            (nameTrunkToCut === "branchLeft" && this.manPosition === "left") ||
            (nameTrunkToCut === "branchRight" && this.manPosition === "right")
        ) {
            this.death();
        }
        // }
    };

    private createOthersElements() {
        this.canCut = true;

        this.trunks = new PIXI.Sprite();
        this.addChild(this.trunks);

        const trunk1 = new PIXI.Sprite(app.getTexture("trunk1"));
        trunk1.position.set(37, 1151);
        trunk1.name = "trunk1";
        this.trunks.addChild(trunk1);

        const trunk2 = new PIXI.Sprite(app.getTexture("trunk2"));
        trunk2.position.set(37, 1151 - this.HEIGHT_TRUNK);
        trunk2.name = "trunk2";
        this.trunks.addChild(trunk2);

        this.constructTree();

        /////////// man ////////////

        this.manContainer = new PIXI.Sprite();
        this.manContainer.position.x = 0;
        this.manContainer.position.y = 1070;
        this.addChild(this.manContainer);

        this.manCut = new PIXI.AnimatedSprite([
            // PIXI.utils.TextureCache['wdoh2.png'],
            PIXI.utils.TextureCache["man1.png"],
            PIXI.utils.TextureCache["man2.png"],
            PIXI.utils.TextureCache["man3.png"]
        ]);
        this.manCut.loop = false;
        this.manCut.animationSpeed = 20 / 60;
        this.manCut.visible = false;
        this.manCut.gotoAndStop(0);
        this.manCut.onComplete = () => {
            this.manCut.gotoAndStop(0);
            this.manCut.visible = false;
            this.manIdle.visible = true;
            if (this.canCut) {
                this.cutTrunk();
                const nameTrunkToCut = this.trunks.getChildAt(0).name;
                if (
                    (nameTrunkToCut === "branchLeft" &&
                        this.manPosition === "left") ||
                    (nameTrunkToCut === "branchRight" &&
                        this.manPosition === "right")
                ) {
                    this.death();
                }
            }
        };
        this.manContainer.addChild(this.manCut);

        this.manIdle = new PIXI.AnimatedSprite([
            PIXI.utils.TextureCache["wdoh1.png"],
            PIXI.utils.TextureCache["wdoh2.png"]
        ]);
        this.manIdle.loop = true;
        this.manIdle.animationSpeed = 3 / 60;
        this.manIdle.play();
        this.manContainer.addChild(this.manIdle);

        this.manPosition = "left";

        // ---- BARRE DE TEMPS
        // Container
        this.timeContainer = new PIXI.Sprite(app.getTexture("timeContainer"));
        this.timeContainer.anchor.set(0.5, 0.5);
        this.timeContainer.position.x = this.WIDTH_GAME / 2;
        this.timeContainer.position.y = 175;
        this.addChild(this.timeContainer);

        this.timeBar = new PIXI.Sprite(app.getTexture("timeBar"));
        this.timeBar.anchor.set(0.5, 0.5);
        this.timeBar.position.x = this.WIDTH_GAME / 2;
        this.timeBar.position.y = 175;
        this.addChild(this.timeBar);

        this.timeBarWidth = this.timeBar.width / 2;
        this.timeBarWidthComplete = this.timeBar.width;

        this.timeBarMask = new PIXI.Graphics();
        this.timeBarMask.beginFill(0x000);
        this.timeBarMask.drawRect(
            0,
            0,
            this.timeBarWidthComplete,
            this.timeBar.height
        );
        this.timeBarMask.endFill();
        this.timeBarMask.width = this.timeBarWidth;
        this.timeBarMask.position.x =
            this.timeBar.position.x - this.timeBarWidth;
        this.timeBarMask.position.y =
            this.timeBar.position.y - this.timeBar.height / 2;
        this.addChild(this.timeBarMask);

        this.timeBar.mask = this.timeBarMask;

        this.summTF = new PIXI.BitmapText("0", this.textStyle);
        (this.summTF.anchor as PIXI.Point).set(0.5, 0.5);
        this.summTF.position.x = this.timeBar.position.x;
        this.summTF.position.y = this.timeBar.position.y + 330;
        // this.summ.scale.set(1.2, 1.2);
        this.addChild(this.summTF);

        this.levelTF = new PIXI.BitmapText("0", this.textStyleLevel);
        (this.levelTF.anchor as PIXI.Point).set(0, 0.5);
        this.levelTF.position.x = this.timeBar.position.x + 120;
        this.levelTF.position.y = this.timeBar.position.y + 180;
        // this.summ.scale.set(1.2, 1.2);
        this.addChild(this.levelTF);

        const level = new PIXI.Sprite(app.getTexture("level"));
        level.anchor.set(0.5, 0.5);
        level.position.x = this.WIDTH_GAME / 2 - 50;
        level.position.y = this.levelTF.position.y;
        this.addChild(level);

        PIXI.Ticker.shared.add(this.onTickEvent);
    }
    private onTickEvent = (deltaTime: number) => {
        if (this.GAME_START) {
            if (this.timeBarWidth > 0) {
                this.timeBarWidth -= 0.6 + 0.1 * this.currentLevel;
                this.timeBarMask.width = this.timeBarWidth;
            } else {
                this.death();
            }
        }
    };
    private death() {
        this.GAME_START = false;
        this.GAME_OVER = true;
        this.canCut = false;
        this.musicPlay = false;

        SoundsManager.stop(Sounds.MUSIC);
        SoundsManager.play(Sounds.DEATH);

        new TWEEN.Tween(this.manContainer)
            .to({ alpha: 0 }, 300)
            .onComplete(() => {
                if (!this.rip) {
                    this.rip = new PIXI.Sprite(app.getTexture("rip"));
                }
                this.addChild(this.rip);

                this.rip.alpha = 0;
                this.rip.x =
                    this.manPosition === "left"
                        ? this.manContainer.x + 75
                        : this.manContainer.x - 330;
                this.rip.y =
                    this.manContainer.y +
                    (this.manContainer.children[0] as PIXI.Sprite).height -
                    this.rip.height;

                new TWEEN.Tween(this.rip).to({ alpha: 1 }, 300).start();

                new TWEEN.Tween({ end: 0 })
                    .to({ end: 1 }, 1000)
                    .onComplete(() => {
                        this.finish();
                    })
                    .start();
            })
            .start();
    }
    private constructTree() {
        // On construit le reste de l'arbre
        for (let i = 0; i < 4; i++) {
            this.addTrunk();
        }
    }
    private addTrunk() {
        const trunks = ["trunk1", "trunk2"];
        const branchs = ["branchLeft", "branchRight"];
        const trunk = new PIXI.Sprite();
        trunk.position.x = 37;
        trunk.position.y =
            this.stump.y -
            this.HEIGHT_TRUNK * (this.trunks.children.length + 1);

        const index = Math.floor(Math.random() * 2);

        if (
            branchs.indexOf(
                this.trunks.getChildAt(this.trunks.children.length - 1).name
            ) === -1
        ) {
            if (Math.random() * 4 <= 1) {
                trunk.name = trunks[index];
            } else {
                trunk.name = branchs[index];
            }
        } else {
            trunk.name = trunks[index];
        }

        trunk.texture = app.getTexture(trunk.name);
        this.trunks.addChild(trunk);
    }
    private cutTrunk() {
        this.addTrunk();

        SoundsManager.play(Sounds.CUT);

        const trunkCut = new PIXI.Sprite();
        trunkCut.position.x = 37;
        trunkCut.position.y = 1151;
        trunkCut.anchor.set(0.5, 0.5);
        trunkCut.name = this.trunks.getChildAt(0).name;
        trunkCut.texture = app.getTexture(trunkCut.name);
        this.addChild(trunkCut);
        trunkCut.position.x += trunkCut.width / 2;
        trunkCut.position.y += trunkCut.height / 2;

        this.trunks.removeChild(this.trunks.getChildAt(0));

        let angle = 0.08;
        const endPos = new PIXI.Point();
        if (this.manPosition === "left") {
            endPos.x = 1500;
            angle *= -1;
        } else {
            endPos.x = -520;
        }
        endPos.y = 1100;

        const startPos = new PIXI.Point(540, 908);
        const tepmPos = new PIXI.Point(540, 908);
        new TWEEN.Tween(tepmPos)
            .to(endPos, 800)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate((value: number) => {
                if (trunkCut) {
                    trunkCut.position.x += tepmPos.x - startPos.x;
                    startPos.x = tepmPos.x;
                    trunkCut.rotation += angle;
                }
            })
            .onComplete(() => {
                this.removeChild(trunkCut);
            })
            .start();
        new TWEEN.Tween(tepmPos)
            .to(endPos, 800)
            .easing((k: any) => {
                k = !k;
                return -4 * k * k + 4 * k + 0;
            })
            .onUpdate((value: number) => {
                if (trunkCut) {
                    trunkCut.position.y += tepmPos.y - startPos.y;
                    startPos.y = tepmPos.y;
                }
            })
            .start();
        this.canCut = false;

        this.increaseScore();

        new TWEEN.Tween(this.trunks.position)
            .to({ y: this.trunks.y + this.HEIGHT_TRUNK }, 100)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                this.trunks.children.forEach(trunk => {
                    trunk.position.y += this.HEIGHT_TRUNK;
                });

                this.trunks.position.y -= this.HEIGHT_TRUNK;
                this.canCut = true;
            })
            .start();
    }
    private increaseScore() {
        this.currentScore++;
        if (this.currentScore % 20 === 0) {
            this.increaseLevel();
        }

        this.timeBarWidth += 12;

        this.summTF.text = this.currentScore.toString();
    }
    private increaseLevel() {
        this.currentLevel++;
        this.levelTF.text = this.currentLevel.toString();
    }
    private finish() {
        if (!this.gameOver) {
            this.gameOver = new PIXI.Sprite(app.getTexture("gameOver"));
            this.gameOver.anchor.set(0.5, 0);
            this.gameOver.position.x = this.WIDTH_GAME / 2;

            this.summBestTF = new PIXI.BitmapText("0", this.textStyle);
            (this.summBestTF.anchor as PIXI.Point).set(0.5, 0.5);
            this.summBestTF.position.x = this.gameOver.position.x;
            this.summBestTF.position.y = this.gameOver.position.y + 780;

            this.summScoretTF = new PIXI.BitmapText("0", this.textStyle);
            (this.summScoretTF.anchor as PIXI.Point).set(0.5, 0.5);
            this.summScoretTF.position.x = this.gameOver.position.x;
            this.summScoretTF.position.y = this.gameOver.position.y + 990;

            this.btnPlay = new PIXI.Sprite(app.getTexture("btnPlay"));
            this.btnPlay.anchor.set(0.5, 0.5);
            this.btnPlay.position.x = this.gameOver.position.x;
            this.btnPlay.position.y = this.gameOver.position.y + 1250;
            this.btnPlay.on(
                "pointerdown",
                (e: PIXI.interaction.InteractionEvent) => {
                    this.reset();
                }
            );
        }
        this.addChild(this.gameOver);
        this.gameOver.position.y = -this.gameOver.height;

        if (this.currentScore > this.bestScore) {
            this.bestScore = this.currentScore;
        }
        this.summBestTF.text = this.bestScore.toString();
        this.summBestTF.alpha = 0;
        this.addChild(this.summBestTF);

        this.summScoretTF.text = this.currentScore.toString();
        this.summScoretTF.alpha = 0;
        this.addChild(this.summScoretTF);

        this.btnPlay.alpha = 0;
        this.btnPlay.interactive = false;
        this.addChild(this.btnPlay);

        new TWEEN.Tween(this.gameOver.position)
            .to({ y: 0 }, 400)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                //
                // this.gameOver.interactive = true;
                const obj = { alpha: 0 };
                new TWEEN.Tween(obj)
                    .to({ alpha: 1 }, 300)
                    .onUpdate((value: number) => {
                        this.btnPlay.alpha = this.summBestTF.alpha = this.summScoretTF.alpha =
                            obj.alpha;
                    })
                    .onComplete(() => {
                        this.btnPlay.interactive = true;
                        localStorage.setItem(
                            localStorageName,
                            this.bestScore.toString()
                        );
                        this.showADV();
                    })
                    .start();
            })
            .start();
    }
    private reset() {
        this.removeChild(this.gameOver);
        this.removeChild(this.summBestTF);
        this.removeChild(this.summScoretTF);
        this.removeChild(this.btnPlay);
        this.btnPlay.interactive = false;

        while (this.trunks.children.length > 0) {
            this.trunks.removeChildAt(0);
        }

        const trunk1 = new PIXI.Sprite(app.getTexture("trunk1"));
        trunk1.position.set(37, 1151);
        trunk1.name = "trunk1";
        this.trunks.addChild(trunk1);

        const trunk2 = new PIXI.Sprite(app.getTexture("trunk2"));
        trunk2.position.set(37, 1151 - this.HEIGHT_TRUNK);
        trunk2.name = "trunk2";
        this.trunks.addChild(trunk2);

        this.constructTree();

        this.removeChild(this.rip);

        this.manContainer.alpha = 1;

        this.manPosition = "left";
        this.manContainer.scale.x = 1;
        this.manContainer.x = 0;

        this.summTF.text = "0";
        this.currentScore = 0;

        this.levelTF.text = "0";
        this.currentLevel = 0;

        this.timeBarWidth = this.timeBar.width / 2;
        this.timeBarMask.width = this.timeBarWidth;

        this.GAME_OVER = false;
        this.canCut = true;
        this.musicPlay = false;

        this.bestScore = +(localStorage.getItem(localStorageName) === null
            ? 0
            : localStorage.getItem(localStorageName));
    }
    private showADV() {
        const data = new Date();
        const sec = data.getTime();
        const resultSec = Math.round(
            (sec - timeLastShowFullscreenAdv.value) / 1000
        );
        if (resultSec > 180) {
            timeLastShowFullscreenAdv.value = sec;
            localStorage.setItem(
                localStorageTime,
                timeLastShowFullscreenAdv.value.toString()
            );

            ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose() {
                        // some action after close
                    },
                    onError() {
                        // some action on error
                    }
                }
            });
        }
    }
}
