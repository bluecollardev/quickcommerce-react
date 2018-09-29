import { schema } from 'normalizr'

import BrowserConstants from 'qc-react/modules/browserSequence/BrowserConstants'

import StepDecorator from '../StepDecorator.js'

let data = []

let option = new schema.Entity('data', {}, { idAttribute: 'id' })

/**
 * These configs could use a bit of tweaking, but I don't see a reason to change
 * the axios implemenation used in BrowserStore. I'd like ProductBrowser and
 * related components to be able to bind to a non-Swagger enabled endpoint.
 * ProductBrowser will eventually be split out into a module and will be
 * self-contained.
 */
const ProductOption = () => {
  return {
    entityName: 'OcProductOption',
    schema: { options: [option] },
    key: 'options',
    type: 'select',
    selectOnClick: true,
    data: data,
    /*src: {
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
    },*/
    registerDecorators: () => {
      this.configureSteps = this.configureSteps.bind(this)
      //this.setStep = this.setStep.bind(this)
      //this.stepClicked = this.stepClicked.bind(this)
      this.onItemClicked = this.onItemClicked.bind(this)
      this.onItemDropped = this.onItemDropped.bind(this)
    },
    registerActions: (payload) => {
      return {
        [BrowserConstants.LOAD_OPTION]: (payload) => {
          //console.log('load option')
          // Option data is nested in the product, we don't need to fetch anything
          this.items['options'] = []

          // Using Object.keys lets us handle arrays and objects
          this.items['options'] = Object.keys(payload.options).map(key => {
            let option = payload.options[key]
            option['product'] = payload.product

            return option
          }) // Just set the key

          this.handleAction(payload)
        },
        [BrowserConstants.SELECT_OPTION]: (payload) => {
          this.emitChange()
        }
      }
    },
    /**
     * Called when a product option is clicked.
     * @param item
     */
    onItemClicked: (item) => {
      console.log('option clicked')
      console.log(item)

      let product = this.state.item

      this.stepper.addOption(item['product_option_value_id'], 1, item, product)
      this.forceUpdate() // Redraw, options have changed
    },
    onItemDropped: (item) => {

    }
  }
}

export default StepDecorator(ProductOption())
