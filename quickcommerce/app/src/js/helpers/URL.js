/**********************************************************
 * Namespace: QC.Helpers.URL
 **********************************************************/
const UrlHelper = {
    getParams: function (query) {
        let params = {},
            param,
            idx;
        
        query = query || window.location.search.substr(1).split('&');
        
        if (query === "") {
            return params;
        }
        
        for (idx = 0; idx < query.length; ++idx) {
            param = query[idx].split('=');
            
            if (param.length !== 2) {
                continue;
            }
            
            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }
        
        return params;
    },
    getParam: function (param, params) {
        params = params || this.getParams();
        
        if (params.hasOwnProperty(param)) {
            return params[param];
        }
        
        return null;
    },
    stripTrailingSlashes: function (url, appendTrailing) {
        appendTrailing = (appendTrailing === true) ? true : false;
        url = url.replace(/\/+$/, '');
        return (appendTrailing) ? url + '/' : url;
    }
};

module.exports = UrlHelper;