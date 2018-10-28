import { ISoundResource } from "./isound-resource";

export class SoundEnity extends PIXI.utils.EventEmitter {
    public static COMPLETE_SOUND: string = "completeSound";
    public isPlayed: boolean;
    public nameSound: string;
    public soundData: ISoundResource;
    public sound: Howl;

    constructor(nameSound: string, soundData: ISoundResource) {
        super();
        this.nameSound = nameSound;
        this.soundData = soundData;

        this.isPlayed = true;
        this.sound = new Howl({
            src: this.soundData.files,
            autoplay: this.soundData.autoplay,
            loop: this.soundData.loop,
            volume: this.soundData.volume,
            preload: true
        });
        this.sound.once('end', () => { this.onCompleteSound() });
        this.sound.play();
    }
    public stop(): void {
        if (this.sound !== null) {
            this.sound.stop();
        }
    }
    private onCompleteSound(): void {
        this.isPlayed = false;
        this.emit(SoundEnity.COMPLETE_SOUND, this);
    }

}
