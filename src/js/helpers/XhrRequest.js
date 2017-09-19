const XhrRequestHelper = {
    setHeaders: function (request, headers, fn, context) {
        var	that = this,
            callback;
        
        context = context || that;
        
        //alert('attempting to set headers...');
        if (headers instanceof Array && headers.length > 0) {
            for (var idx = 0; idx < headers.length; idx++) {
                // TODO: Check for invalid headers
                //alert(headers[idx][0] + ': ' + headers[idx][1]);
                request.setRequestHeader(headers[idx][0], headers[idx][1]);
            }
            
            /*if (typeof callback === 'function') {
                callback = fn;
                fn = function () {													
                    var args = Array.prototype.slice.call(arguments, 0);
                    
                    callback.apply(context, args);
                }
                
                fn(request, headers, context);
            }*/
        }
        
        return request;
    }
};

module.exports = XhrRequestHelper;