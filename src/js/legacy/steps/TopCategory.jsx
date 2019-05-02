import { normalize, denormalize, schema } from 'normalizr'

let data = []

let category = new schema.Entity('data', {}, {
    idAttribute: 'id'
})

export default {
    key: 'categories',
    type: 'select',
    src: {
        transport: {
            read: {
                url: QC_RESOURCE_API + 'category?top=1',
                method: 'get', //type: 'GET',
                responseType: 'json' //dataType: 'json',
                /*beforeSend: function (request) {
                    page.setHeaders(request)
                    request.setRequestHeader('X-Oc-Merchant-Language', 'en')
                }*/
            }
        },
        /*schema: {
            parse: function (response) {
                var categories = response.data,
                    results = []
                
                var flattenCategories = function (categories, parentId) {
                    $.each(categories, function (idx, obj) {
                        var row = obj,
                            children
                        
                        row.parentId = (parentId > 0) ? parentId : 0
                        row.id = row.category_id
                        row.name = stringHelpers.decodeHtmlEntities(row.name)
                        row.description = stringHelpers.decodeHtmlEntities(row.description)
                        delete row.category_id
                        
                        if (row.hasOwnProperty('categories') && row.categories !== null) {
                            children = row.categories
                            flattenCategories(children, row.id)
                        }
                        
                        delete row.categories
                        
                        results.push(row)
                        row = null
                    })
                }
                
                flattenCategories(categories, 0)
                
                return results
            },                    
            model: {
                //id: 'category_id',
                //parentId: 'parent_id',
                id: 'id',
                //parentId: 'parentId',
                // TODO: Something is up with this field config
                fields: {
                    id: { editable: false, nullable: true },
                    parentId: { type: 'number', editable: true },
                    image: { type: 'string', editable: true, nullable: true },
                    name: { type: 'string', editable: true, nullable: true }, 
                    description: { type: 'string', editable: true, nullable: true },
                    language_id: { type: 'number', editable: true, nullable: true },
                    meta_description: { type: 'string', editable: true, nullable: true },
                    meta_keyword: { type: 'string', editable: true, nullable: true },
                    meta_title: { type: 'string', editable: true, nullable: true },
                    sort_order: { type: 'number', editable: true, nullable: true }
                }
            }
        }*/
    },
    data: data, // Inject dummy data, just patch it in above if you want...
    entityName: 'OcCategory',
    schema: {
        categories: [category]
    },
    selectOnClick: true, // TODO: Fix this later, for now just define for every step
    filter: {
        //target: browserDataSources.get('browser.product'),
        filter: { 
            //field: 'category',
            field: 'product_id',
            operator: function (item, value) {
                console.log('operator sources')
                var categories = [], //browserDataSources.get('catalog.category'),
                    productIds = []
                    
                // Value provided will be a category ID
                $.each(categories.get(parseInt(value)).product, function (idx, product) {
                    productIds.push(product.product_id)
                })
                
                /*$.each(item, function (idx, cat) {
                    categories.push(cat.id)
                })
                
                return categories.indexOf(value) > -1*/
                return productIds.indexOf(item) > -1
                
                // This is for REST Admin API
                //return Object.keys(item).indexOf(value) > -1
            }
        }
    },
    filtersApplied: function (data) {
        var productDataSource = browserDataSources.get('browser.product'),
            products = productDataSource.view()
            
        console.log('filters applied')
        console.log(products)
        
        if (products.length === 1) {
            var productData = products[0],
                windowLauncher = page.getAttribute(productData, 'Product Config', 'Category Window Launcher')
                
            if (windowLauncher !== false) {
                if (windowLauncher.hasOwnProperty('text') && typeof windowLauncher.text === 'string') {
                    infoWindow.refresh({
                        type: 'GET',
                        url: windowLauncher.text
                    })
                    
                    console.log('set window content')
                    console.log(infoWindow)
                    
                    infoWindow.center().open()
                    
                    browser.progressBar.value(0) // Reset progress bar
                    browser.reset()
                }
            }
        }
    },
    after: function (data) {
        // We use this before callback to set the next steps
        console.log('executing category step [' + data.step + '] after callback')
        console.log('category', data.category)
        console.log('product', data.product)
        console.log('view-model', data.viewModel)
        console.log('item', data.item)
    }
}