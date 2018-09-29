import { schema } from 'normalizr'

import UrlHelper from 'qc-react/helpers/URL.js'

import BrowserConstants from 'qc-react/modules/browserSequence/BrowserConstants'

import StepDecorator from '../StepDecorator.js'

let category = new schema.Entity('data', {}, { idAttribute: 'id' })

/**
 * These configs could use a bit of tweaking, but I don't see a reason to change
 * the axios implemenation used in BrowserStore. I'd like ProductBrowser and
 * related components to be able to bind to a non-Swagger enabled endpoint.
 * ProductBrowser will eventually be split out into a module and will be
 * self-contained.
 */
const Category = () => {
  return {
    entityName: 'OcCategory',
    schema: { categories: [category] },
    key: 'categories',
    type: 'select',
    selectOnClick: true,
    src: {
      transport: {
        read: {
          url: UrlHelper.compile(''),
          method: 'get',
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
        [BrowserConstants.LOAD_CATEGORY]: (payload) => {
          this.handleAction(payload)
        },
        [BrowserConstants.SELECT_CATEGORY]: (payload) => {
          this.handleAction(payload)
        }
      }
    },
    /**
     * Called when a category is clicked.
     * @param item
     */
    onItemClicked: (e, item) => {
      console.log('category clicked')
      console.log(item)

      e.preventDefault()
      e.stopPropagation()

      this.catalogBrowser.actions.loadProducts(item['category_id'])
    },
    onItemDropped: (item) => {

    }
  }
}

export default StepDecorator(Category())
