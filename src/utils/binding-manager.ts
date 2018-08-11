/**
 * Created by aniii526 on 13.03.2017.
 */
export class BindingManager {
    public static get instance() {
        return BindingManager.instanceStatic || (BindingManager.instanceStatic = new BindingManager());
    }

    private static instanceStatic: BindingManager;
    private constructor() {
    }

    public bindSetter(host: any, property: any, callback: any): void {
        if (!host[property + "_bindings"]) {
            host[property + "_bindings"] = [];
            host["_" + property] = host[property];
            Object.defineProperty(host, property, {
                get() {
                    return host["_" + property];
                },
                set(newValue) {
                    host["_" + property] = newValue;
                    host[property + "_bindings"].forEach((callbackTemp: any) => {
                        callbackTemp(newValue);
                    });
                }
            });
        }
        host[property + "_bindings"].push(callback);
        callback(host[property]);
    }

    public unbindSetter(host: any, property: any, callback: any): void {
        const bindings = host[property + "_bindings"];
        if (bindings) {
            const index = bindings.indexOf(callback);
            if (index > -1) {
                bindings.splice(index, 1);
            }
        }
    }
}
