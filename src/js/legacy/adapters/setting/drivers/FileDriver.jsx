import AbstractSettingDriver from './AbstractSettingDriver.jsx'

import { FileSystem, File, FileTransfer } from '../../../helpers/Cordova.js'

export default class FileDriver extends SettingDriver {
    getConfigFileName() {
        if (!(localStorage.hasOwnProperty('configFileName'))) {
            return false
        }
        
        if (localStorage.hasOwnProperty('configFileName')) {
            return localStorage.getItem('configFileName')
        } else {
            return false
        }
    }
    
    setConfigFileName(model) {
        // Accepts session string or model
        let configFileName = null
        
        model = model || false
        if (model && model instanceof kendo.data.Model) {
            configFileName = model.get('configFileName')
            if (typeof configFileName === 'string') {
                localStorage.setItem('configFileName', configFileName)
            }
        } else if (model && (typeof model === 'string' || typeof model ===  'number')) {
            model = (typeof model === 'number') ? parseInt(model) : model
            configFileName = model
            localStorage.setItem('configFileName', configFileName)
        }
    }
    
    parseConfigFile(reader, isFileCallback) {
        let that = this,
            page = that.getPage(),
            lineRegex = /[\r\n]+/g,
            configRegex = /([\w]+)\s?\=\s?([\w]+)/,
            isDataDir = false,
            dataDir = false,
            fileName,
            matches
        
        let lines = reader.result.split(lineRegex) // tolerate both Windows and Unix linebreaks
        let pairs,
            idx = 0,
            key, value

        for (idx; idx < lines.length; idx++) {
            pairs = lines[idx].match(configRegex)

            if (pairs.length === 3) {
                key = pairs[1]
                value = pairs[2]

                switch (key) {
                    case 'store_id':
                        that.setStoreId(value)
                        break
                    case 'control_file':
                        that.setControlFilePrefix(value)
                        break
                }
            }
        }
    }
}