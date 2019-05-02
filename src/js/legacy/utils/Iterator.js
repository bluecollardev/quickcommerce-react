/**
 * Object: App.Utilities.Iterator
 * Type: Class
 *
 * Basic iterator
 */
export default (obj) => {
    let iterator = Object.create({
        data: {},
        keys: [],
        index: 0,
        len: 0,
        
        init: function (obj) {
            if (obj) {
                this.data = obj
                this.keys = Object.keys(obj)
                this.len = this.keys.length
                this.index = 0
            }
            
            return this
        },
        next: function () {
            let element,
                data = this.data,
                keys = this.keys,
                index = this.index
                
            if (!this.hasNext()) {
                return null
            }

            element = data[keys[index]]
            this.index++

            return element
        },
        hasNext: function () {
            let index = this.index,
                len = this.len
                    
            return index < len
        },
        rewind: function () {
            let data = this.data,
                keys = this.keys,
                index = this.index
            
            this.index = 0
            
            return data[keys[index]]
        },
        current: function () {
            let data = this.data,
                keys = this.keys,
                index = this.index
                
            return data[keys[index]]
        },
        key: function () {
            let keys = this.keys,
                index = this.index
                
            return keys[index]
        }
    })
    
    return iterator.init(obj)
}