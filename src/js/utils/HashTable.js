/**
 * Object: App.Utilities.HashTable
 * Type: Hash
 *
 * Basic hash table implementation
 */
HashTable: function (obj) {
    var hashTable = Object.create({
        length: 0,
        items: {},
        
        init: function (obj) {
            var p;
            
            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    this.items[p] = obj[p];
                    this.length++;
                }
            }
            
            return this;
        },
        setItem: function (key, value) {
            var previous;
            
            if (this.hasItem(key)) {
                previous = this.items[key];
            }
            else {
                this.length++;
            }
            this.items[key] = value;
            return previous;
        },
        getItem: function (key) {
            return this.hasItem(key) ? this.items[key] : undefined;
        },
        hasItem: function (key) {
            return this.items.hasOwnProperty(key);
        },
        removeItem: function (key) {
            var previous;
            
            if (this.hasItem(key)) {
                previous = this.items[key];
                this.length--;
                delete this.items[key];
                return previous;
            }
            
            return undefined;
        },
        keys: function () {
            var keys = [], k;
                
            for (k in this.items) {
                if (this.hasItem(k)) {
                    keys.push(k);
                }
            }
            return keys;
        },
        values: function () {
            var values = [], k;
                
            for (k in this.items) {
                if (this.hasItem(k)) {
                    values.push(this.items[k]);
                }
            }
            return values;
        },
        each: function (fn) {
            var k;
            
            for (k in this.items) {
                if (this.hasItem(k)) {
                    fn(k, this.items[k]);
                }
            }
        },
        clear: function () {
            this.items = {};
            this.length = 0;
        }
    });
    
    return hashTable.init(obj);
},