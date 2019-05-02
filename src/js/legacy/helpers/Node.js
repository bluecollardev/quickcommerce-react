/**********************************************************
 * Namespace: QC.Helpers.Node
 **********************************************************/
export default {
    File: {
        getFS: function () {
            fs = require('fs') // Global for now
            return fs
        },
        // We can do better than this
        readFile: function (fileName, fileDir, callback, options) {
            fs = this.getFS()
            fs.readFile(fileDir + fileName, options, callback)
        },
        readDir: function (path, callback, options) {
            console.log('attempting to list files at ' + path)
            fs = this.getFS()
            fs.readdir(path, options, callback)
        },
        exists: function (path) {
            return fs.existsSync(path)
        }
    }
}