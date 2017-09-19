/**
 * Object: App.Utilities.Iterator
 * Type: Class
 *
 * Basic iterator
 */
Iterator: function (obj) {
    var iterator = Object.create({
        data: {},
        keys: [],
        index: 0,
        len: 0,
        
        init: function (obj) {
            if (obj) {
                this.data = obj;
                this.keys = Object.keys(obj);
                this.len = this.keys.length;
                this.index = 0;
            }
            
            return this;
        },
        next: function () {
            var element,
                data = this.data,
                keys = this.keys,
                index = this.index;
                
            if (!this.hasNext()) {
                return null;
            }

            element = data[keys[index]];
            this.index++;

            return element;
        },
        hasNext: function () {
            var index = this.index,
                len = this.len;
                    
            return index < len;
        },
        rewind: function () {
            var data = this.data,
                keys = this.keys,
                index = this.index;
            
            this.index = 0;
            
            return data[keys[index]];
        },
        current: function () {
            var data = this.data,
                keys = this.keys,
                index = this.index;
                
            return data[keys[index]];
        },
        key: function () {
            var keys = this.keys,
                index = this.index;
                
            return keys[index];
        }
    });
    
    return iterator.init(obj);
},