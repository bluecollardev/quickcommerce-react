/**********************************************************
 * Namespace: QC.Helpers.FileSystem
 **********************************************************/
export default (handler) => {
    let fileSystem
    
    fileSystem = Object.create({
        fileSystem: null,
        handler: null,
        init: function (handler) {
            this.handler = handler
            console.log(handler)
            
            return this
        },
        readFile: function (fileName, dirName, callback, options) {
            options = options || null
            this.handler.readFile(fileName, dirName, callback, options)
        },
        readDir: function (dirName, callback, options) {
            options = options || null
            this.handler.readDir(dirName, callback, options)
        },
        exists: function (path) {
            if (this.handler.hasOwnProperty('exists')) {
                return this.handler.exists(path)
            }
        },
        getFS: function () {
            if (this.fileSystem === null) {
                this.fileSystem = this.handler.getFS()
            }
            
            return this.fileSystem
        }
    })
    
    return fileSystem.init(handler)
}