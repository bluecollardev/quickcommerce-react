const OcRequestHelper = {
    setHeaders(request, area, sessId, storeId) {
        var    that = this,
            headers = []
        
        area = area || 'catalog'
            
        if (sessId) {
            console.log('session: ' + sessId)
            headers.push(['X-Oc-Session', sessId])
        }
        
        //headers.push(['X-Oc-Merchant-Language', 'en'])
        switch (area) {
            case 'catalog':
                headers.push(['X-Oc-Merchant-Id', 'demo'])
                if (storeId) headers.push(['X-Oc-Store-Id', storeId])
                break
            case 'admin': 
                headers.push(['X-Oc-Restadmin-Id', 'demo'])
                break
        }
        
        //App.Helpers.XhrRequest.setHeaders(request, headers, null, that)
        
        return request
        
    }
}

module.exports = OcRequestHelper