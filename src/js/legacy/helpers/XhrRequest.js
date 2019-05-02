export default class XhrRequestHelper {
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
}