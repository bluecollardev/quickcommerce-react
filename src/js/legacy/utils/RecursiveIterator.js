/**
 * Object: App.Utilities.RecursiveIterator
 * Type: Class
 *
 * Basic recursive iterator
 */
export default (obj) => {    
    var recursiveIterator = Object.create(App.Utilities.Iterator(), {
        hasChildren: {
            value: function () {
                var data = this.data,
                    keys = this.keys,
                    index = this.index,
                    //len = this.len,
                    type
                
                type = data[keys[index]].constructor
                
                if (type === Object || type === Array) {
                    if (Object.keys(data[keys[index]]).length !== 0) {
                        return Object.keys(data[keys[index]]).length
                    }
                }
                
                return false
            },
            enumerable: true,
            configurable: false,
            writable: true                
        },
        getChildren: {
            value: function () {
                var data = this.data,
                    keys = this.keys || {},
                    index = this.index,
                    //len = this.len,
                    type
                    
                type = data[keys[index]].constructor
                
                if (type === Object || type === Array) {
                    if (Object.keys(data[keys[index]]).length !== 0) {
                        return data[keys[index]]
                    }
                }
                
                return false
            },
            enumerable: true,
            configurable: false,
            writable: true
        }
    })
    
    return recursiveIterator.init(obj)
}