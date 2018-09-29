import { schema } from 'normalizr'

let image = new schema.Entity('data', {}, { idAttribute: 'id' })

/**
 * These configs could use a bit of tweaking, but I don't see a reason to change
 * the axios implemenation used in BrowserStore. I'd like ProductBrowser and
 * related components to be able to bind to a non-Swagger enabled endpoint.
 * ProductBrowser will eventually be split out into a module and will be
 * self-contained.
 */
export default {
  key: 'images',
  type: 'select',
  src: {
    transport: {
      read: {
        //url: 'data/product.json',
        url: '', // TODO: Usage of URL compile in these steps isn't consistentIf there are extra params
        // I have to compile the URL in the BrowserStore... I need to decide on how to continue with this going forward
        // Maybe a factory for these steps?
        method: 'get', //type: 'GET',
        responseType: 'json' //dataType: 'json',
        /*beforeSend: function (request) {
         page.setHeaders(request)
         request.setRequestHeader('X-Oc-Merchant-Language', 'en')
         }*/
      }
    },
    pageSize: 30,
    batch: true
  },
  entityName: 'OcProductImage',
  schema: { images: [image] },
  selectOnClick: true
}
