/**
 * Object: App.Utilities.ChainableHash
 * Type: Hash
 *
 * Wrapper for App.Utilities.HashTable providing a cleaner interface and supporting method chaining
 */
ChainableHash: function (obj) {
    var chainableHash = Object.create(App.Utilities.HashTable(), {
        has: {
            // Yeah, prototypal inheritance is a bit too verbose if you ask me, but I didn't come up with this stuff.
            // Prototypal inheritance works better than classical OOP & constructors anyway (at least for JS).
            value: function (key) {
                return this.hasItem(key);
            },
            enumerable: true, // 
            configurable: false,
            writable: true
        },
        get: {
            value: function (key) {
                return this.getItem(key);
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        set: {
            value: function (key, value) {
                this.setItem(key, value);
                return this;
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        remove: {
            value: function (key) {
                return (this.removeItem(key) !== undefined) ? this : false;
            },
            enumerable: true,
            configurable: false,
            writable: true
        }
    });
    
    // TODO: Make sure we're not calling the init method twice
    return chainableHash.init(obj);
},