class ImageHelper {
  static primaryImageOrPlaceholder = (data, imageProperty) => {
    let thumbnail = ''

    if (data.hasOwnProperty(imageProperty) && typeof data[imageProperty] === 'string' && data[imageProperty] !== '') {
      if (ImageHelper.isBase64Encoded(data[imageProperty])) {
        thumbnail = ImageHelper.base64ImageOrPlaceholder(data, imageProperty)
      } else {
        thumbnail = data[imageProperty]
      }
    } else {
      // Load default thumbnail
      thumbnail = APP_IMAGES_URI + NO_PRODUCT_IMAGE
    }

    return thumbnail
  }

  /**
   * TODO: This method sucks right now
   * @param data
   * @param imageProperty
   * @param mimeTypeProperty
   * @returns {string}
   */
  static base64ImageOrPlaceholder = (data, imageProperty, mimeTypeProperty) => {
    let thumbnail = ''
    mimeTypeProperty = mimeTypeProperty || 'mimeType'

    // TODO: Detect base64 encoding?
    if (data.hasOwnProperty(imageProperty) && typeof data[imageProperty] === 'string' && data[imageProperty] !== '') {
      thumbnail = 'data:' + data[mimeTypeProperty] + ';base64,' + data[imageProperty]
    } else {
      // Load default thumbnail
      thumbnail = APP_IMAGES_URI + NO_PRODUCT_IMAGE
    }

    return thumbnail
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
    // Load default thumbnail
    let base = relative ? APP_IMAGES_PATH : APP_IMAGES_URI
    let thumbnail = base + NO_PRODUCT_IMAGE

    data = data || null

    // TODO: Duck-type object properties properly
    if (data !== null && data.hasOwnProperty(propertyName) && data[propertyName] !== null && typeof data[propertyName]['image'] === 'string' && data[propertyName]['image'] !== '') {
      thumbnail = 'data:' + data[propertyName]['mimeType'] + ';base64,' + data[propertyName]['image']
    }

    return thumbnail
  }

  static primaryImageOrPlaceholderFromObjectTemp = (data, propertyName, relative = false) => {
    // Load default thumbnail
    let base = relative ? APP_IMAGES_PATH : APP_IMAGES_URI
    let thumbnail = base + NO_PRODUCT_IMAGE

    data = data || null

    // TODO: Duck-type object properties properly
    if (data !== null && typeof data['image'] === 'string' && data['image'] !== '') {
      thumbnail = 'data:' + data['mimeType'] + ';base64,' + data['image']
    }

    return thumbnail
  }

  static primaryImageOrPlaceholderFromProperty = (data) => {
    return ImageHelper.primaryImageOrPlaceholderFromObjectTemp(data, 'image')
  }

  static isBase64Encoded = (string) => {
    return (/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(string))
  }
}

export default ImageHelper
