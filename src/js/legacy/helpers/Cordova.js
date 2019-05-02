/***************************************************************************************************************
 * Namespace: QC.Helpers.Cordova
 * Note: File API functions such as resolveLocalFileSystemURL will only work when using Chrome's V8 JS Engine.
 * Cordova/PhoneGap, Chrome and NWJS all use the V8 engine internally, but we'll need to use a different adapter
 * if we're going to support file system functionality on other platforms (Mozilla, Trident, Opera, etc).
 ***************************************************************************************************************/

class FileSystem {
    static getFS() {
        // DO something
    }
}

class File {    
    static readFile(fileName, fileDir, callback, options) {
        if (typeof cordova !== 'undefined') {
            fileDir = (typeof fileDir === 'string' && fileDir.length > 0) ? fileDir : cordova.file.externalDataDirectory
        
            console.log('----------- LOADING FILE -----------')
            console.log('loading file from ' + fileDir + fileName)
            window.resolveLocalFileSystemURL(fileDir, (directoryEntry) => {
                //alert('Directory entry success')
                File.directoryGetFile(directoryEntry, fileName, file => {
                    let reader = new FileReader()
                    reader.onloadend = (evt) => {
                        callback(file)
                    }
                    
                    reader.readAsText(file)
                }, options)
            }, (error) => {
                console.log('Error - ', error)
                console.log(fileDir + fileName)
            })
        }                
    }
    
    static readDir(path, callback, options) {
        console.log('attempting to list files at ' + path)
        // in chrome 0 menas temporaray which means data can not be written and 512000 is just size of bytes usable
        // but phonegap works a bit differently so even if the number is 0, the API will still work
        window.requestFileSystem(PERSISTENT, 512000, (fileSystem) => {
            fileSystem.root.getDirectory('data/' + path, { create: true },
                (dir) => {
                    console.log(dir)
                    dir.createReader().readEntries(callback)
                },
                (error) => {
                    console.log('Error - ', error)
                }
            )
            
            return files // Not sure if this does anything, we're passing in by ref, really...

        }, (error) => {
            console.log('Error - ', error)
        })
    }
    
    static directoryGetFile(directoryEntry, fileName, successCallback, options) {
        options = options || {}
        
        directoryEntry.getFile(fileName, options,
            (fileEntry) => {
                fileEntry.file(
                    (file) => {                                    
                        successCallback(file)
                    },
                    (error) => {
                        console.log('File Read cannot complete on File System - ', error)
                    }
                )
            }, (error) => {
                console.log('Reader cannot read from the File System - ', error)
            }
        )
    }
    
    static getErrorCodeMessage(code) {
        let message = ''
        if (typeof code !== 'number') {
            message = 'Unknown error, code provided is not a valid integer'
        }
        
        switch (code) {
            case 1:
                // NOT_FOUND_ERR
                message = 'File was not found or does not exist'
                break
            case 2:
                // SECURITY_ERR
                message = 'Security/permissions error'
                break
            case 3:
                // ABORT_ERR
                message = 'Operation was aborted'
                break
            case 4:
                // NOT_READABLE_ERR
                message = 'File is not readable'
                break
            case 5:
                // ENCODING_ERR
                message = 'File encoding error'
                break
            case 6:
                // NO_MODIFICATION_ALLOWED_ERR
                message = 'The application does not have the appropriate permissions to modify the file or directory'
                break
            case 7:
                // INVALID_STATE_ERR
                message = 'Invalid state'
                break
            case 8:
                // SYNTAX_ERR
                message = 'Syntax error'
                break
            case 9:
                // INVALID_MODIFICATION_ERR
                message = 'Invalid modification'
                break
            case 10:
                // QUOTA_EXCEEDED_ERR
                message = 'Quota exceeded - the current user does not have enough space to store the file'
                break
            case 11:
                // TYPE_MISMATCH_ERR
                message = 'Type mismatch'
                break
            case 12:
                // PATH_EXISTS_ERR
                message = 'Cannot create file/directory - the current path already exists'
                break
        }
        
        return message
    }
}

class FileTransfer {
    static createFileDownloader(context, remoteUrl, filePath) {
        // 0: In queue, 1: Processing, 2: Complete, 5: Failed
        // Returns a context object
        return {
            remoteUrl: remoteUrl,
            filePath: filePath,
            context: context,
            //status: 0,
            fetch: () => {
                let download = this // TODO: I changed this -- make sure it's still working
                
                // TODO: Check slashes
                window.resolveLocalFileSystemURL(download.filePath, 
                    (entry) => {
                        console.log(entry)
                        console.log(download.filePath + ' exists')
                        download.context.activeDownloads--
                        //download.status = 2
                    },
                    (error) => {
                        console.log('downloading file [' + download.filePath + ']')
                        File.downloadFile(download.remoteUrl, download.filePath,
                            (entry) => {
                                //download.status = 2
                                console.log('successfully downloaded ' + download.filePath)
                                download.context.activeDownloads--
                            },
                            (error) => {
                                //download.status = 5
                                console.log('error downloading ' + download.filePath)
                                download.context.activeDownloads--
                            }
                        )
                    }
                )
            }
        }
    }
    
    static downloadFile(url, filePath, successCallback, errorCallback) {
        // TODO: This method assumes the url variable contains a valid URI to a file on a server and filePath is a valid path on the device
        let fileTransfer = new FileTransfer()
        fileTransfer.download(url, filePath, successCallback, errorCallback)
    }
}

export { FileSystem, File, FileTransfer }