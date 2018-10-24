import 'babel-polyfill';
import { App } from './App';
import './index.css';

export const app = new App();
app.init();
(window as any).app = app;
