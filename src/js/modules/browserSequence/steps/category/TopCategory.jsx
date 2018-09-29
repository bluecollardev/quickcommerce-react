import { schema } from 'normalizr'

let data = []

let category = new schema.Entity('data', {}, { idAttribute: 'id' })

/**
 * These configs could use a bit of tweaking, but I don't see a reason to change
 * the axios implemenation used in BrowserStore. I'd like ProductBrowser and
 * related components to be able to bind to a non-Swagger enabled endpoint.
 * ProductBrowser will eventually be split out into a module and will be
 * self-contained.
 */
export default {
  key: 'categories',
  type: 'select',
  src: {
    transport: {
      read: {
        url: '', //QC_RESOURCE_API + 'category?top=1',
        method: 'get', //type: 'GET',
        responseType: 'json' //dataType: 'json',
        /*beforeSend: function (request) {
         page.setHeaders(request)
         request.setRequestHeader('X-Oc-Merchant-Language', 'en')
         }*/
      }
    }
  },
  data: data, // Inject dummy data, just patch it in above if you want...
  entityName: 'OcCategory',
  schema: { categories: [category] },
  selectOnClick: true // TODO: Fix this later, for now just define for every step
}
