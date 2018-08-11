import { UAParser } from "ua-parser-js";
import { FullScreener } from "utils/fullscreener/FullScreener";

export class FullScreenerHelper {
    public static get instance() {
        return FullScreenerHelper.instanceStatic || (FullScreenerHelper.instanceStatic = new FullScreenerHelper());
    }
    private static instanceStatic: FullScreenerHelper;
    private inited: boolean = false;
    private constructor() {
    }
    public init() {
        if (this.inited) {
            throw new Error("FullScreenerHelper. try to call a method init() again");
            return;
        }
        this.inited = true;

        const parser = new UAParser();
        const name = parser.getBrowser().name;
        const os = parser.getOS().name;
        if (navigator.userAgent.match(/iemobile/i) || navigator.userAgent.match(/WPDesktop/i) || navigator.userAgent.match(/Windows Phone/i)) {
            // alert('IE is Issue Explorer');
        } else {
            if ((name && name.match(/webview/i)) && (os && os.match(/android/i))) {
                // alert("Откройте в другом браузере");
            } else {
                FullScreener.instance.init();
            }
        }
    }
}
