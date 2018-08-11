import { Utils } from "./utils";

export class GameData {
    public static ASSETS_WIDTH: number = 500;
    public static ASSETS_HEIGHT: number = 500;
    public isMobile: boolean = false;
    public isOS: boolean = false;
    public width: number = 0;
    public height: number = 0;
    public checkMobile() {
        this.isMobile = Utils.isMobileOrTablet();
        this.isOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
}