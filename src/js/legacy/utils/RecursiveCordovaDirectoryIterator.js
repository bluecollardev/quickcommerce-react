/**
 * Object: RecursiveCordovaDirectoryIterator
 * Type: Class
 * Work in progress...
 * Recursive directory iterator for (Cordova) PhoneGap
 */
export default (obj) => {    
    var recursiveIterator = Object.create(App.Utilities.Iterator(), {
        _numDirs: {
            value: 0,
            enumerable: true,
            configurable: false,
            writable: true
        },
        _numFiles: {
            value: 0,
            enumerable: true,
            configurable: false,
            writable: true
        },
        _readerTimeout: {
            value: null,
            enumerable: true,
            configurable: false,
            writable: true
        }, 
        _millisecondsBetweenReadSuccess: {
            value: 100,
            enumerable: true,
            configurable: false,
            writable: true
        },
        _rootDir: {
            value: null,
            enumerable: true,
            configurable: false,
            writable: true
        },
        iterate: {
            value: function () {
                var that = this
                
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 512000, function (fileSystem) {
                    window.resolveLocalFileSystemURL(that._rootDir, 
                    function (directoryEntry) {
                        that.dirSuccess(directoryEntry)
                    }, 
                    function (error) {
                        console.log('uh oh')
                        console.log(error)
                    }, { create: false, exclusive: false })
                })
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        setRootDir: {
            value: function (dir) {
                this._rootDir = dir
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        dirSuccess: {
            value: function (dirEntry) {
                var that = this,
                    directoryReader = dirEntry.createReader() // Get a directory reader

                // Get a list of all the entries in the directory
                directoryReader.readEntries(
                function (entries) {
                    that.readerSuccess(entries)
                }, 
                function (error) {
                    console.log(error)
                })
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        fileSuccess: {
            value: function (fileEntry) {
                var that = this
                
                console.log('file found')
                console.log(fileEntry)
            },
            enumerable: true,
            configurable: true,
            writable: true
        },
        readerSuccess: {
            value: function (entries) {
                var that = this,
                    i = 0, len = entries.length
                
                for (i; i < len; i++) {
                    if (entries[i].isFile) {
                        that._numFiles++
                        
                        that.fileSuccess(entries[i])
                        
                        /*entries[i].file(
                        function (file) {
                            that.fileSuccess(file)
                        }, 
                        function (error) {
                            console.log(error)
                        })*/
                    } else if (entries[i].isDirectory) {
                        that._numDirs++
                        that.dirSuccess(entries[i])
                    }
                    if (that._readerTimeout) {
                        window.clearTimeout(that._readerTimeout)
                    }
                }
                if (that._readerTimeout) {
                    window.clearTimeout(that._readerTimeout)
                }
                
                that._readerTimeout = window.setTimeout(function () {
                    that.done()
                }, that._millisecondsBetweenReadSuccess)
            },
            enumerable: true,
            configurable: false,
            writable: true
        },
        done: {
            value: function () {},
            enumerable: true,
            configurable: false,
            writable: true    
        },
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