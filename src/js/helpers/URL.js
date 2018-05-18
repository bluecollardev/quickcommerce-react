/**********************************************************
 * Namespace: QC.Helpers.URL
 **********************************************************/
import pathToRegexp from 'path-to-regexp'
import parse from 'url-parse'

class UrlHelper {
  /**
   * Enumeration of collection format separator strategies.
   *
   * @enum {String}
   * @readonly
   */
  static CollectionFormatEnum = {
    /**
     * Comma-separated values. Value: <code>csv</code>
     * @const
     */
    CSV: ',',

    /**
     * Space-separated values. Value: <code>ssv</code>
     * @const
     */
    SSV: ' ',

    /**
     * Tab-separated values. Value: <code>tsv</code>
     * @const
     */
    TSV: '\t',

    /**
     * Pipe(|)-separated values. Value: <code>pipes</code>
     * @const
     */
    PIPES: '|',

    /**
     * Native array. Value: <code>multi</code>
     * @const
     */
    MULTI: 'multi'
  }

  /**
   * Builds a string representation of an array-type actual parameter, according to the given collection format.
   *
   * @param {Array} param An array parameter.
   * @param {module:IndigoCommonApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
   * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
   * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
   */
  static buildCollectionParam(param, collectionFormat) {
    if (param === null) {
      return null
    }

    switch (collectionFormat) {
      case 'csv':
        return param.map(UrlHelper.paramToString).join(',')
      case 'ssv':
        return param.map(UrlHelper.paramToString).join(' ')
      case 'tsv':
        return param.map(UrlHelper.paramToString).join('\t')
      case 'pipes':
        return param.map(UrlHelper.paramToString).join('|')
      case 'multi':
        //return the array directly as SuperAgent will handle it as expected
        return param.map(UrlHelper.paramToString)
      default:
        throw new Error('Unknown collection format: ' + collectionFormat)
    }
  }

  /**
   * Returns an object containing parameters from the current browser URL's query string.
   *
   * @param query
   */
  static getParams = (query) => {
    let params = {}
    let param
    let idx

    query = query || window.location.search.substr(1).split('&')

    if (query === '') {
      return params
    }

    for (idx = 0; idx < query.length; ++idx) {
      param = query[idx].split('=')

      if (param.length !== 2) {
        continue
      }

      params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, ' '))
    }

    return params
  }

  /**
   * Returns a parameter from the current browser's URL query string by name.
   *
   * @param param
   * @param params
   * @returns {*}
   */
  static getParam = (param, params) => {
    params = params || UrlHelper.getParams()

    if (params.hasOwnProperty(param)) {
      return params[param]
    }

    return null
  }

  /**
   * Returns a string representation for an actual parameter.
   *
   * @param param The actual parameter.
   * @returns {String} The string representation of param.
   */
  static paramToString(param) {
    if (param == undefined || param == null) {
      return ''
    }
    if (param instanceof Date) {
      return param.toJSON()
    }

    return param.toString()
  }

  /**
   * Checks whether the given parameter value represents file-like content.
   *
   * @param param The parameter to check.
   * @returns {boolean} True if param represents a file.
   */
  static isFileParam(param) {
    // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
    if (typeof require === 'function') {
      let fs
      try {
        fs = require('fs')
      } catch (err) {}
      if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
        return true
      }
    }

    // Buffer in Node.js
    if (typeof Buffer === 'function' && param instanceof Buffer) {
      return true
    }

    // Blob in browser
    if (typeof Blob === 'function' && param instanceof Blob) {
      return true
    }

    // File in browser (it seems File object is also instance of Blob, but keep this for safe)
    if (typeof File === 'function' && param instanceof File) {
      return true
    }

    return false
  }

  /**
   * Normalizes parameter values - removes nulls and keeps files and arrays in place.
   * Format to string with `paramToString` for other cases.
   *
   * @param {Object.<String, Object>} params The parameters as object properties.
   * @returns {Object.<String, Object>} normalized parameters.
   */
  static normalizeParams(params) {
    let newParams = {}
    for (let key in params) {
      if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
        let value = params[key]
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value
        } else {
          newParams[key] = this.paramToString(value)
        }
      }
    }

    return newParams
  }

  /**
   * I think it's pretty clear what this does.
   *
   * @param url
   * @param appendTrailing
   * @returns {*}
   */
  static stripTrailingSlashes = (url, appendTrailing) => {
    appendTrailing = (appendTrailing === true) ? true : false
    url = url.replace(/\/+$/, '')
    return (appendTrailing) ? url + '/' : url
  }

  /**
   * Compile a URL using a url-parse path and optional args.
   *
   * url-parse instance properties:
   * protocol: The protocol scheme of the URL (e.g. http:).
   * slashes: A boolean which indicates whether the protocol is followed by two forward slashes (//).
   * auth: Authentication information portion (e.g. username:password).
   * username: Username of basic authentication.
   * password: Password of basic authentication.
   * host: Host name with port number.
   * hostname: Host name without port number.
   * port: Optional port number.
   * pathname: URL path.
   * query: Parsed object containing query string, unless parsing is set to false.
   * hash: The "fragment" portion of the URL including the pound-sign (#).
   * href: The full URL.
   * origin: The origin of the URL.
   */
  static compile = (path, args) => {
    let parsed = parse(path)

    let compileFn = pathToRegexp.compile(parsed.pathname)
    parsed.set('pathname', compileFn(args))
    //console.log(parsed.toString())

    return parsed.toString()
  }

  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * This is similar to the UrlHelper.compile method, which is probably a better overall solution. This method remains in place to support
   * an existing api client.
   *
   * NOTE: query parameters are not handled here!
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @returns {String} The encoded path with parameter values substituted.
   */
  static buildUrl(path, pathParams) {
    // TODO: Fill in missing slashes
    /*if (!path.match(/^\//)) {
      path = '/' + path
  }*/

    let url = path
    url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
      let value
      if (pathParams.hasOwnProperty(key)) {
        value = UrlHelper.paramToString(pathParams[key])
      } else {
        value = fullMatch
      }

      return encodeURIComponent(value)
    })

    return url
  }
}

export default UrlHelper
