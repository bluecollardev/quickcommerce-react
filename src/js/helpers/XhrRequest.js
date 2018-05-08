class XhrRequestHelper {
  static setHeaders = (request, headers, fn, context) => {
    let callback

    if (headers instanceof Array && headers.length > 0) {
      for (let idx = 0; idx < headers.length; idx++) {
        request.setRequestHeader(headers[idx][0], headers[idx][1])
      }

      /*if (typeof callback === 'function') {
       callback = fn
       fn = function () {
       let args = Array.prototype.slice.call(arguments, 0)

       callback.apply(context, args)
       }

       fn(request, headers, context)
       }*/
    }

    return request
  }

  /**
   * Checks whether the given content type represents JSON.
   * JSON content type examples:
   * application/json
   * application/json; charset=UTF8
   * APPLICATION/JSON
   * @param {String} contentType The MIME content type to check.
   * @returns {boolean} True if contentType represents JSON, otherwise false
   */
  static isJsonMime(contentType) {
    return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i))
  }

  /**
   * Chooses a content type from the given array, with JSON preferred i.e. return JSON if included, otherwise return the first.
   *
   * @param c{Array.<String>} contentTypes
   * @returns {String} The chosen content type, preferring JSON.
   */
  static jsonPreferredMime(contentTypes) {
    for (let i = 0; i < contentTypes.length; i++) {
      if (XhrRequestHelper.isJsonMime(contentTypes[i])) {
        return contentTypes[i]
      }
    }

    return contentTypes[0]
  }
}

export default XhrRequestHelper
