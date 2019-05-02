/**
 * Object: App.Utilities.Injector
 * Type: Class
 *
 * Dependency Injection container
 * 
 * Note: I should probably be using a AMD/CommonJS loader instead
 */
export default () => {
    return Object.create(kendo.Class(), {
        _dependencies: {
            value: function () {
                return Class.create(App.Utilities.ChainableHash())
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        get: {
            value: function (name) {
                return this._dependencies.get(name)
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        register: {
            value: function (name, dependency) {
                this._dependencies.set(name, dependency)
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        unregister: {
            value: function (name) {
                this._dependencies.remove(name)
            },
            enumerable: true,
            configurable: false,
            writable: true
        }
    })
}