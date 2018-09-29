import { schema } from 'normalizr'

import UrlHelper from 'qc-react/helpers/URL.js'

import BrowserConstants from 'qc-react/modules/browserSequence/BrowserConstants'

import StepDecorator from '../StepDecorator.js'

let product = new schema.Entity('data', {}, { idAttribute: 'id' })

/**
 * These configs could use a bit of tweaking, but I don't see a reason to change
 * the axios implemenation used in BrowserStore. I'd like ProductBrowser and
 * related components to be able to bind to a non-Swagger enabled endpoint.
 * ProductBrowser will eventually be split out into a module and will be
 * self-contained.
 */
const Product = () => {
  return {
    entityName: 'OcProduct',
    schema: { products: [product] },
    key: 'products',
    type: 'select',
    selectOnClick: true,
    src: {
      transport: {
        read: {
          url: UrlHelper.compile(''),
          method: 'post',
          responseType: 'json',
          headers: { 'X-Ideal-Provider': sessionStorage.getItem('UUID') }
        }
      },
      pageSize: 30,
      batch: true
    },
    registerDecorators: () => {
      this.configureSteps = this.configureSteps.bind(this)
      //this.setStep = this.setStep.bind(this)
      //this.stepClicked = this.stepClicked.bind(this)
      this.onItemClicked = this.onItemClicked.bind(this)
      this.onItemDropped = this.onItemDropped.bind(this)
    },
    registerActions: (payload) => {
      return {
        [BrowserConstants.SEARCH_PRODUCT]: (payload) => {
          this.handleAction(payload)
        },
        [BrowserConstants.SEARCH_PRODUCT]: (payload) => {
          if (typeof payload.query !== 'undefined' && payload.query !== null) {
            this.handleAction(payload)
          } else {
            // Throw error?
          }
        },
        [BrowserConstants.LOAD_PRODUCT]: (payload) => {
          if (payload.category !== null && !Number.isNaN(payload.category)) {
            this.category = payload.category // Store category id
            // And adjust the endpoint accordingly...
            // TODO: Use a template to do this part...
            payload.config.src.transport.read.url = payload.config.src.transport.read.url.replace('{id}', payload.category.toString())
            this.handleAction(payload)
          } else {
            payload.config.src.transport.read.url = payload.config.src.transport.read.url
            this.handleAction(payload)
          }
        },
        [BrowserConstants.LOAD_PRODUCT_EXTENDED]: (payload) => {
          console.log('load extended item information')
        },
        [BrowserConstants.LOAD_PRODUCT_IMAGES]: (payload) => {
          //console.log('load item images')
          // Option data is nested in the item, we don't need to fetch anything
          //this.items['images'] = []

          // Using Object.keys lets us handle arrays and objects
          /*this.items['images'] = Object.keys(payload.options).map(key => {
           let option = payload.options[key]
           option['product'] = payload.product

           return option
           })*/ // Just set the key

          // Custom logic for deals - pass in vehicleId and dealId as orderId and itemId respectively
          // If id is a normal integer id
          //let orderId = payload.orderId

          //let itemId = payload.product[payload.idProp] // TODO: Use mappings
          //if (orderId !== null && !Number.isNaN(orderId) &&
          //itemId !== null && !Number.isNaN(itemId)) {
          //let url = payload.config.src.transport.read.url
          //url = UrlHelper.compile(url, { orderId: orderId, itemId: itemId })

          // Use a combination of vin and provider id instead
          let url = UrlHelper.compile(url)
          if (payload.hasOwnProperty('vin') && payload.hasOwnProperty('providerId')) {
            payload.config.src.transport.read.url = url + '&vin=' + payload.vin + '&providerId=' + payload.providerId
            this.handleAction(payload)
          }
          //}
        },
        [BrowserConstants.SELECT_PRODUCT]: (payload) => {
          this.emitChange()
        },
        [BrowserConstants.LOAD_QUANTITY]: (payload) => {
          this.handleAction(payload)
        },
        [BrowserConstants.SELECT_QUANTITY]: (payload) => {
          this.emitChange()
        }
      }
    },
    /**
     * Called when a product is clicked.
     * @param item
     */
    onItemClicked: (e, item) => {
      console.log('product clicked')
      console.log(item)

      e.preventDefault()
      e.stopPropagation()

      // If the Quick Add button was clicked
      if (e.target.type === 'button') {
        this.addToCartClicked(e, item)
        return
      }

      this.props.actions.product.setProduct(item)

      // TODO: Leave this in as log if debug mode
      console.log('opening product page for item:')
      console.log(item)
      window.location.hash = '#/product/' + item['product_id'] + '/' + item['name'] // TODO: Use mappings! And use websafe/SEO URL (currently unavailable)
    },
    onItemDropped: (item) => {

    }
  }
}

// This is important - execute on import!
export default StepDecorator(Product())
