import { normalize, denormalize, schema } from 'normalizr'

let data = []

let option = new schema.Entity('data', {}, {
    idAttribute: 'id'
})

export default {
    key: 'options',
    type: 'select',
    data: data,
    entityName: 'OcProductOption',
    schema: {
        options: [option]
    },
    selectOnClick: true,
    after: function (browser, data) {
        // We use this before callback to set the next steps
        console.log('executing product step [' + data.step + '] after callback')
        console.log('product', data.product)
        console.log('view-model', data.viewModel)
        console.log('item', data.item)
        
        // Rebuild before adding steps
        browser.buildSteps(browser.config.steps.length - 1)
        var selectedProduct,
            dataFolderAttribute,
            trackCodeAttribute,
            options
        
        //selectedProduct = browserDataSources.get('browser.product').get(data.product.get('id')) // Tablet & Old REST API
        selectedProduct = browserDataSources.get('browser.product').get(data.product.get('product_id'))
        //options = selectedProduct.get('options').toJSON() // Tablet & Old REST API
        options = selectedProduct.get('option').toJSON()
        
        dataFolderAttribute = page.getDataFolderAttribute(selectedProduct) || false
        
        // TODO: VEST Racing module - how are we gonna handle this generically?
        // VESTHOOK
        // TODO: Implement this properly yo
        if (page.hasOwnProperty('vestracing')) {
            trackCodeAttribute = page.getTrackCodeAttribute(selectedProduct) || false
            console.log('track code attribute:')
            console.log(trackCodeAttribute)
            externalDateOptionAttributes = page.getExternalDateOptionAttributes(selectedProduct) || false
            console.log('date option attribute:')
            console.log(externalDateOptionAttributes)
        }
        
        var productDownloads = viewModel.get('product_downloads')

        // If product configuration does not exist, then create one
        if (typeof productDownloads === 'undefined' || !(productDownloads instanceof kendo.data.ObservableObject)) {
            productDownloads = new kendo.data.ObservableObject()
            viewModel.set('product_downloads', productDownloads)
        }

        // Wouldn't this be better to use a datasource?
        var productId = viewModel.get('product_config.product_id')
        if (typeof productId !== 'undefined') {
            var downloadInfo = productDownloads.get('product_' + productId)
            if (typeof downloadInfo === 'undefined') {
                downloadInfo = new kendo.data.ObservableObject()
                viewModel.set('product_downloads.product_' + productId, downloadInfo)
            }

            if (dataFolderAttribute.hasOwnProperty('text')) {
                console.log('data folder attribute has text: ' + dataFolderAttribute.text)
                downloadInfo.set('folder_path', dataFolderAttribute.text)
            }
            
            // TODO: Track Code attribute is what in a generic sense?
            // VESTHOOK
            if (typeof trackCodeAttribute !== 'undefined' && trackCodeAttribute.hasOwnProperty('text')) {
                downloadInfo.set('track_code', page.parseTrackCodes(trackCodeAttribute.text))
            }
        }
        
        if (options.hasOwnProperty('length') && options.length > 0) {
            browser.progressBar.options.max = 2
            browser.progressBar.options.chunkCount = 2
            
            // Re-order options if necessary (using sort order)
            options.sort(function (a, b) {
                if (a.hasOwnProperty('option') && b.hasOwnProperty('option')) {
                    if (a.option.hasOwnProperty('sort_order') && b.option.hasOwnProperty('sort_order')) {
                        return a.option.sort_order - b.option.sort_order
                    }
                }
            })
            
            $.each(options, function (idx, opt) {
                // setOptions doesn't really work after initializing the widget... whatever, reinitialize
                browser.progressBar.options.max = browser.progressBar.options.max + 1,
                browser.progressBar.options.chunkCount = browser.progressBar.options.chunkCount + 1
                
                // Tablet & Old REST API doesn't nest option entity -- it flattens the data
                // We're dealing with JSONified Doctrine entities, we need to flatten it first
                if (opt.hasOwnProperty('option')) $.extend(true, opt, opt.option)
                delete opt.option
                
                //if (opt.type === 'checkbox' || opt.type === 'select' || opt.type === 'radio') {
                if (opt.type === 'checkbox' || opt.type === 'select' || opt.type === 'radio') {
                    // Display rendering will be slighty different - radio has default selected and is only single select, etc.
                    
                    // Add the product option id to each option value so we can reference it later
                    var optionValues = []

                    $.each(opt.product_option_values, function (idx, value) {
                        optionValues[idx] = value
                        optionValues[idx].product_option_id = value.product_option.productOptionId // Recursion... ids are camelcased
                        $.extend(optionValues[idx], value.option_value) // Don't deep extend
                        $.extend(optionValues[idx], value.option) // Don't deep extend
                        optionValues[idx].name = value.option_value.description[0].name // TODO: English only for now
                        delete optionValues[idx].option_value
                        delete optionValues[idx].option
                        delete optionValues[idx].product_option
                        delete optionValues[idx].product
                        
                        // TODO: Add a callback for here so we can filter or alter the datasource/data
                        // VESTHOOK
                        if (value.hasOwnProperty('name') /*&& opt.name.match(/tracks$/i) !== null*/) {
                            // TODO: This is gross let's use a callback or something, but this is fast for now
                            // Parse the codes
                            var codes = page.parseTrackCodes(value.name)
                            if (codes && codes.length > 0) {
                                // No code? We have nothing to search by so delete it from the list
                                optionValues[idx].code = codes.join(',') // CSV list
                            } else {
                                delete optionValues[idx]
                            }
                            
                            if (typeof value.name !== 'undefined') {
                                optionValues[idx].name = page.parseTrackName(value.name)
                            } else {
                                // No name and just a code? The user doesn't know what that is so delete it from the list
                                delete optionValues[idx]
                            }
                        }
                    })
                    
                    browser.addStep({
                        // QcProductOption
                    }, parseInt(browser.config.steps.length + idx))
                }
                
                if (opt.type === 'date' || opt.type == 'time' || opt.type == 'datetime') {
                    browser.addStep({
                        // QcProductDatetime
                    }, parseInt(browser.config.steps.length + idx))
                    
                    if (dataFolderAttribute && dataFolderAttribute.hasOwnProperty('text')) {
                        // VESTHOOK
                        browser.getAvailableDates(dataFolderAttribute.text)
                    }
                }
            })
            
            // The setOptions method doesn't really work after initializing the widget
            // This occurs with certain Kendo UI widgets, not just the ProgressBar one
            // I've tried pretty much everything, so whatever, guess we have to destroy and reinitialize
            var progressElement = browser.progressBar.element,
                progressOptions = browser.progressBar.options
            
            browser.progressBar.destroy() // First, we have to destroy the widget instance
            progressElement.empty() // Then empty the container, or it still won't work
            
            browser.progressBar = progressElement.kendoProgressBar(progressOptions).data('kendoProgressBar')
        }
    }
}