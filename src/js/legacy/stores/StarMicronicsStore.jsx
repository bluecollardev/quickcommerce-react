import assign from 'object-assign'

import axios from 'axios'
import { normalize, denormalize, schema } from 'normalizr'

import BaseStore from './BaseStore.jsx'

let instance = null

class StarMicronicsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher)
        
        if (instance !== null) {
            return instance
        }

        this.starPrinter = {
            isConnected: false,
            name: null,
            portName: null,
            macAddress: null
        }

       
        //this.subscribe(() => this.registerToActions.bind(this))
        
        // Easy access while developing app
        window.StarMicronicsStore = instance = this
        
        document.addEventListener('deviceready', () => {
            this.connectToStarPrinter()
        }, false)
    }
    
    connectToStarPrinter(onSuccess, onError) {
        this.discoverStarPrinterPorts(printerList => {
            printerList = printerList || false

            if (!printerList) {
                alert('No cash drawer/printer(s) detected')
                return
            }

            // Connect and listen for hardware events (mPOP on iOS only)
            window.plugins.starMicronics.connect(printerList[0].portName, (error, result) => {
                if (error) {
                    console.log(error)
                    alert(JSON.stringify(error))
                } else {
                    this.starPrinter.name = printerList[0].name
                    this.starPrinter.portName = printerList[0].portName
                    this.starPrinter.macAddress = printerList[0].macAddress
                    this.starPrinter.isConnected = true

                    //alert(JSON.stringify(that.starPrinter))
                    // Connect and listen for hardware events (mPOP on iOS only)
                    window.addEventListener('starIOPluginData', (e) => {
                        switch (e.dataType) {
                            case 'printerCoverOpen':
                                break
                            case 'printerCoverClose':
                                break
                            case 'printerImpossible':
                                break
                            case 'printerOnline':
                                break
                            case 'printerOffline':
                                break
                            case 'printerPaperEmpty':
                                break
                            case 'printerPaperNearEmpty':
                                break
                            case 'printerPaperReady':
                                break
                            case 'barcodeReaderConnect':
                                break
                            case 'barcodeDataReceive':
                                break
                            case 'barcodeReaderImpossible':
                                break
                            case 'cashDrawerOpen':
                                break
                            case 'cashDrawerClose':
                                break
                        }
                    }) // TODO: Unbind event listener on destruct
                }
            })
        })
    }

    discoverStarPrinterPorts(onSuccess) {
        // Make sure Cordova is initialized
        if (!window.hasOwnProperty('plugins')) {
            throw new Error('Cordova was not detected')
            alert('Cordova was not detected')
        }

        // Make sure the Star Micronics Cordova plugin is installed and working
        if (!window.plugins.hasOwnProperty('starMicronics')) {
            throw new Error('Star Micronics plugin was not detected')
            alert('Star Micronics plugin was not detected')
        }

        window.plugins.starMicronics.portDiscovery('All', (error, printerList) => {
            if (error) {
                console.error(error)
                alert(JSON.stringify(error))
            } else {
                // TODO: Check to make sure it's a function!
                onSuccess(printerList) // Trigger our onSuccess callback
            }
        })
    }

    openDrawer() {
        if (!this.starPrinter.isConnected) {
            alert('Could not open drawer - device not found')
            return
        }
        
        window.plugins.starMicronics.openCashDrawer(this.starPrinter.portName, (error, result) => {
            if (error) {
                alert(JSON.stringify(error))
            } else {
                console.log('Cash drawer opened')
            }
        })
    }

    printOrder(output) {
        if (!this.starPrinter.isConnected) {
            alert('Could not print order - printer not found')
            return
        }
        
        this.discoverStarPrinterPorts(printerList => {
            if (!this.starPrinter.isConnected) return
            
            window.plugins.starMicronics.printReceipt(this.starPrinter.portName, output, (error, result) => {
                if (error) {
                    console.log(error)
                    alert(JSON.stringify(error))
                } else {
                    console.log('Receipt printed')
                }
            })
        })
    }

    printReceipt(output) {
        if (!this.starPrinter.isConnected) {
            alert('Could not print receipt - printer not found')
            return
        }
        
        this.discoverStarPrinterPorts(printerList => {
            if (!this.starPrinter.isConnected) return
            
            window.plugins.starMicronics.printReceipt(this.starPrinter.portName, output, (error, result) => {
                if (error) {
                    console.log(error)
                    alert(JSON.stringify(error))
                } else {
                    console.log('Receipt printed')
                }
            })
        })
    }

    printReport(output) {
        if (!this.starPrinter.isConnected) {
            alert('Could not print report - printer not found')
            return
        }
        
        this.discoverStarPrinterPorts(printerList => {
            if (!this.starPrinter.isConnected) return
            
            window.plugins.starMicronics.printReceipt(this.starPrinter.portName, output, (error, result) => {
                if (error) {
                    console.log(error)
                    alert(JSON.stringify(error))
                } else {
                    console.log('Receipt printed')
                }
            })
        })
    }
}

export default new StarMicronicsStore()
export { StarMicronicsStore }