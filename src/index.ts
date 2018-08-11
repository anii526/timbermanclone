import 'babel-polyfill';
import { App } from './App';
import './index.css';
// require("babel-polyfill");
// export declare let app: App;
export const app = new App();
app.init();
(window as any).app = app;
