const VARIANTS = {
  ORIGINAL: 'ORIGINAL',
  THUMBNAIL: 'THUMBNAIL',
  POSTER: 'POSTER',
  ALL: 'ALL'
}

const DEFAULT_TYPE_KEY = 'variantTypeCode'

class ImageHelper {
  static isBase64Encoded = (string) => {
    return (/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(string))
  }

  static base64BgImage(url, mimeType) {
    return 'url("data:' + mimeType + ';base64,' + url + '")'
  }

  /**
   * TODO: This method sucks right now
   * @param data
   * @param imageProperty
   * @param mimeTypeProperty
   * @returns {string}
   */
  static base64ImageOrPlaceholder = (data, imageProperty, mimeTypeProperty) => {
    let image = ''
    mimeTypeProperty = mimeTypeProperty || 'mimeType'

    // TODO: Detect base64 encoding?
    if (data.hasOwnProperty(imageProperty) && typeof data[imageProperty] === 'string' && data[imageProperty] !== '') {
      image = 'data:' + data[mimeTypeProperty] + ';base64,' + data[imageProperty]
    } else {
      // Load default image
      image = APP_IMAGES_URI + NO_PRODUCT_IMAGE
    }

    return image
  }

  static primaryImageOrPlaceholder = (data, imageProperty) => {
    let image = ''

    if (data.hasOwnProperty(imageProperty) && typeof data[imageProperty] === 'string' && data[imageProperty] !== '') {
      if (ImageHelper.isBase64Encoded(data[imageProperty])) {
        image = ImageHelper.base64ImageOrPlaceholder(data, imageProperty)
      } else {
        image = data[imageProperty]
      }
    } else {
      // Load default image
      image = APP_IMAGES_URI + NO_PRODUCT_IMAGE
    }

    return image
  }

  /*
   Sample object:
   datetime: null,
   description: 'photo 0',
   height: 240,
   id: 3,
   image: '',
   mileage: false,
   mimeType: 'image/jpeg',
   perspective: {id: 3, version: 0, effectiveDate: null, expiryDate: null, effective: true, …},
   primary: true,
   size: 10366,
   tags: (3) ['hot', 'new', 'fast'],
   vin: true,
   width: 240
   */
  static primaryImageOrPlaceholderFromObject = (data, propertyName, relative = false) => {
    // Load default image
    let base = relative ? APP_IMAGES_PATH : APP_IMAGES_URI
    let image = base + NO_PRODUCT_IMAGE

    data = data || null

    // TODO: Duck-type object properties properly
    if (data !== null && data.hasOwnProperty(propertyName) && data[propertyName] !== null && typeof data[propertyName]['image'] === 'string' && data[propertyName]['image'] !== '') {
      image = 'data:' + data[propertyName]['mimeType'] + ';base64,' + data[propertyName]['image']
    }

    return image
  }

  static primaryImageOrPlaceholderFromObjectTemp = (data, propertyName, relative = false) => {
    // Load default image
    let base = relative ? APP_IMAGES_PATH : APP_IMAGES_URI
    let image = base + NO_PRODUCT_IMAGE

    data = data || null

    // TODO: Duck-type object properties properly
    if (data !== null && typeof data['image'] === 'string' && data['image'] !== '') {
      image = 'data:' + data['mimeType'] + ';base64,' + data['image']
    }

    return image
  }

  static primaryImageOrPlaceholderFromProperty = (data) => {
    return ImageHelper.primaryImageOrPlaceholderFromObjectTemp(data, 'image')
  }

  static getImagesByVariantFromCollection = (variantMappings, collection, type, typeKey) => {
    type = type || variantMappings.POSTER

    typeKey = (typeof typeKey === 'string') ? typeKey : DEFAULT_TYPE_KEY

    let results = []

    if (collection instanceof Array && collection.length > 0) {
      results = collection

      // TODO: Use mappings?
      switch (type) {
        case variantMappings.ORIGINAL:
          results = results.filter((item) => {
            return (item && item[typeKey] === type)
          })

          break
        case variantMappings.THUMBNAIL:
          results = results.filter((item) => {
            return (item && item[typeKey] === type)
          })

          break
        case variantMappings.POSTER:
          collection = collection.filter((item) => {
            return (item && item[typeKey] === type)
          })

          break
        case variantMappings.ALL:
          break
      }
    }

    return results
  }
}

export default ImageHelper

export { VARIANTS as variants }
