/**
 * Create a namespaced function
 */
function createFunction(ns, fn) {
    var nsArray = ns.split(/\./),
        currentNode = this._root,
        newNS
        
    while (nsArray.length > 1) {
        newNS = nsArray.shift()

        if (typeof currentNode[newNS] === "undefined") {
            currentNode[newNS] = {}
        }
        
        currentNode = currentNode[newNS]
    }

    if (fn) {
        currentNode[nsArray.shift()] = fn
    } else {
        currentNode[nsArray.shift()] = {}
    }
}

export default createFunction