import "pixi.js";
export class PixiHelper {
    private app: PIXI.Application;
    constructor() {
        this.app = new PIXI.Application();
        this.init();
    }
    public init() {
        document.body.appendChild(this.app.view);

        PIXI.loader.add('bunny', 'src/bunny.png').load((loader: any, resources: any) => {
            // This creates a texture from a 'bunny.png' image
            const bunny = new PIXI.Sprite(resources.bunny.texture);

            // Setup the position of the bunny
            bunny.x = this.app.renderer.width / 2;
            bunny.y = this.app.renderer.height / 2;

            // Rotate around the center
            bunny.anchor.x = 0.5;
            bunny.anchor.y = 0.5;

            // Add the bunny to the scene we are building
            this.app.stage.addChild(bunny);

            // Listen for frame updates
            this.app.ticker.add((delta) => {
                // each frame we spin the bunny around a bit
                bunny.rotation += 0.1 * delta;
            });
        });
    }
}