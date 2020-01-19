import { ISoundResource } from "./isound-resource";

export class Sounds {
    public static MUSIC: string = "theme";
    public static MENU: string = "menu";
    public static CUT: string = "cut";
    public static DEATH: string = "death";

    public map: Map<string, ISoundResource>;

    protected gameName: string = "";
    protected version: number = 5;
    protected staticPath: string = "timber/";
    constructor() {
        this.map = new Map<string, ISoundResource>();
    }
    public init(): void {
        const names: string[] = [
            Sounds.MUSIC,
            Sounds.MENU,
            Sounds.CUT,
            Sounds.DEATH
        ];
        for (const name of names) {
            this.map.set(name, {
                name,
                files: [
                    this.staticPath + name + ".mp3?" + this.version,
                    this.staticPath + name + ".ogg?" + this.version
                ],
                volume: 0.3,
                loop: false,
                autoplay: false
            });
        }
        // звук фона должен быть зациклен
        const back: ISoundResource = this.map.get(Sounds.MUSIC);
        back.loop = true;
        back.autoplay = true;

        const cut: ISoundResource = this.map.get(Sounds.CUT);
        cut.volume = 0.5;
    }
}
