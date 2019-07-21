// import "pixi.js";
import { GameData } from "./GameData";
export class PixiHelper {
    public app: PIXI.Application;
    constructor() {
        this.app = new PIXI.Application();
    }
    public async init() {
        this.app = new PIXI.Application({
            width: GameData.ASSETS_WIDTH,
            height: GameData.ASSETS_HEIGHT
            // antialias: true
        });
        this.app.view.style.position = 'absolute';
        document.body.appendChild(this.app.view);
        this.app.view.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        return this.app.stage;
    }
}