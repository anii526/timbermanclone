import "pixi.js";
import { ITest } from "./ITest";

export class Test implements ITest {
    constructor() {
        // 
    }
    public init(): void {
        // 
    }
    public appendText(text: string = 'Горячая перезагрузка во всей своей КУРЕЕЕЕЕЕ!!!!!!!!') {
        const root = document.getElementById('root');
        const el = document.createElement('div');
        el.innerText = text;
        if (root) {
            root.appendChild(el);
        }
    }
}