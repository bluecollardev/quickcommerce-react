/**********************************************************
 * Namespace: QC.Helpers.URL
 **********************************************************/
export default class UrlHelper {
    static getParams = (query) => {
        let params = {}
		let param
		let idx
        
        query = query || window.location.search.substr(1).split('&')
        
        if (query === "") {
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
}