import { Howler } from "howler";
import { ISoundResource } from "./isound-resource";
import { SoundEnity } from "./sound-enity";
import { Sounds } from "./sounds";

// const Howlers = require("howler");

export abstract class SoundsManager {
    public static mut: boolean = false;
    public static sounds: Sounds;
    private static vol: number = 1;
    private static soundsList: SoundEnity[] = [];
    private static music: SoundEnity;
    private static soundBackCurrentVolume: number;
    public static get volume(): number {
        return SoundsManager.vol;
    }
    public static set volume(value: number) {
        SoundsManager.vol = value;
        Howler.volume(value);
    }
    public static get muted(): boolean {
        return SoundsManager.mut;
    }
    public static set muted(value: boolean) {
        SoundsManager.mut = value;
        Howler.mute(value);
    }
    public static loadSounds(sounds: Sounds) {
        this.sounds = sounds;
        for (const value of this.sounds.map.values()) {
            SoundsManager.load(value);
        }
    }
    public static play(name: string) {
        const soundData: ISoundResource | undefined = this.sounds.map.get(name);
        if (soundData) {
            const se: SoundEnity = new SoundEnity(name, soundData);
            if (soundData.loop === false) {
                se.once(SoundEnity.COMPLETE_SOUND, (sound: SoundEnity) => { this.onCompleteSound(sound) });
            }
            this.soundsList.push(se);

            if (name === Sounds.MUSIC) {
                this.music = se;
                this.soundBackCurrentVolume = this.getVolumeBack();
            }
        }
    }
    public static stop(name: string) {
        // debugger;
        const sound: ISoundResource | undefined = this.sounds.map.get(name);
        if (sound) {
            const ar: SoundEnity[] = [];
            for (const iterator of this.soundsList) {
                if (iterator.nameSound === name) {
                    iterator.stop();
                    ar.push(iterator);
                }
            }
            for (const iterator of ar) {
                this.onCompleteSound(iterator);
            }
        }
    }
    public static load(sound: ISoundResource) {
        // tslint:disable-next-line:no-unused-expression
        new Howl({
            src: sound.files,
            volume: 0,
            preload: true
        });
    }
    public static changeVolumeBack(aValue?: number) {
        let value = aValue;
        if (value === undefined) {
            value = this.soundBackCurrentVolume;
        }
        if (this.music) {
            this.music.sound.fade(this.getVolumeBack(), value, 500);
        }
    }
    private static onCompleteSound(sound: SoundEnity): void {
        // debugger;
        const s: SoundEnity = sound;
        const ind: number = this.soundsList.indexOf(s);
        if (ind !== -1) {
            this.soundsList.splice(ind, 1);
        }
    }
    private static getVolumeBack() {
        return (this.music) ? this.music.sound.volume() : 0;
    }
}


