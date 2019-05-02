import FileDriver from './FileDriver.jsx'

export default class TextDriver extends FileDriver {
    /**
     * Everything below has been pulled from legacy QuickCommerce POS app and needs to be refactored
     * Note: File API functions such as resolveLocalFileSystemURL will only work when using Chrome's V8 JS Engine
     * Cordova/PhoneGap, Chrome and NWJS all use the V8 engine internally
     */
    loadConfig() {
        let that = this,
            configFileDir,
            configFileName = 'config.ini'
        
        
        if (typeof cordova !== 'undefined') {
            configFileDir = cordova.file.externalDataDirectory
        
            console.log('----------- LOADING CONFIG -----------')
            console.log('loading config from ' + configFileDir + configFileName)
            
            window.resolveLocalFileSystemURL(configFileDir, function (directoryEntry) {
                File.directoryGetFile(directoryEntry, configFileName, function (file) {
                    let reader = new FileReader()
                    reader.onloadend = function (evt) {
                        console.log('on load end')
                        that.parseConfigFile(reader, function (context, dataDir, fileName) {
                            console.log(dataDir)
                            console.log(fileName)
                        })
                    }
                    reader.readAsText(file)
                }, { create: false, exclusive: true })
            }, function (error) {
                console.log('Error - ', error)
                console.log(cordova.file.externalDataDirectory + 'data')
            })
        }
    }
}