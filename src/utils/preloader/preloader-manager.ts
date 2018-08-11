/**
 * Created by ctretyak on 23.02.2017.
 */
import "./preloader.css";

// import * as $ from "jquery";
// let preloaderNode = $.parseHTML(require("raw-loader!./preloader.html"));

export class PreloaderManager {
    public static get instance() {
        return PreloaderManager.instanceStatic || (PreloaderManager.instanceStatic = new PreloaderManager());
    }
    private static instanceStatic: PreloaderManager;
    private loaderExample: any;
    private loader: any;
    private linebg: any;
    private line: any;
    private constructor() {
    }
    public init() {
        // if ($(".loader_example").length) {
        //     this.loaderExample = $(".loader_example");
        // }
        // this.loader = this.loaderExample.find(".loader");
        // this.linebg = this.loaderExample.find(".preloader__linepath");
        // this.line = this.loaderExample.find(".preloader__line");

    }
    public setProgress(progress: number, callback?: any) {
        // this.percentage.html(Math.round(progress) + "%");
        this.line
            .stop()
            .animate({ width: progress + "%" }, 1000, "linear")
            .promise()
            .done(() => {
                if (progress >= 100) {
                    this.linebg.hide();
                    this.line.hide();
                    this.loader.hide();
                    this.loaderExample.fadeOut(1000).promise().done(() => {
                        this.loaderExample.hide();
                        if (callback) {
                            callback();
                        }
                    });
                }
            });
    }
}
