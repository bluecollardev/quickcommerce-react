/**********************************************************
 * Namespace: QC.Helpers.URL
 **********************************************************/
import pathToRegexp from 'path-to-regexp'
import parse from 'url-parse'

export default class UrlHelper {
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
	
    static getParam = (param, params) => {
        params = params || UrlHelper.getParams()
        
        if (params.hasOwnProperty(param)) {
            return params[param]
        }
        
        return null
    }
	
    static stripTrailingSlashes = (url, appendTrailing) => {
        appendTrailing = (appendTrailing === true) ? true : false
        url = url.replace(/\/+$/, '')
        return (appendTrailing) ? url + '/' : url
    }
	
	/**
	 * url-parse instance properties
	 *
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
		console.log(parsed.toString())
		
		return parsed.toString()
	}
}