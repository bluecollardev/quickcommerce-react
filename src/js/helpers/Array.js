/**********************************************************
 * Namespace: QC.Helpers.Array
 **********************************************************/

export default class ArrayHelper {
    /**
     * Method: App.Helpers.Array.recursiveMap
     *
     */
    static recursiveMap = (fn, list) => {
        //return !list.length ? []: [fn(list[0])].concat(ArrayHelper.recursiveMap(fn, list.slice(1)))
        if (!list.length) {
            return []   
        } else {
            [fn(list[0])].concat(ArrayHelper.recursiveMap(fn, list.slice(1)))
        }
    }
    
    /**
     * Method: App.Helpers.Array.recursiveReduce
     *
     */
    static recursiveReduce = (fn, value, list) => {
        //return !list.length ? value : ArrayHelper.recursiveReduce(fn, fn(value, list[0], list.slice(1)))
        if (!list.length) {
            return value
        } else {
            ArrayHelper.recursiveReduce(fn, fn(value, list[0], list.slice(1)))
        }
    }
    
    /**
     * Method: App.Helpers.Array.recursiveReduce
     *
     */
    static recursiveFilter = (predicate,list) => {
        return !list.length ? []: (predicate(list[0]) ? [list[0]] : []).concat(filter(predicate,list.slice(1)))
    }

    /**
     * Method: App.Helpers.Array.intersect
     *
     */
    static intersect = (a, b) => {
        let ai = 0, bi = 0, result = []

        while (ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                ai++
            } else if (a[ai] > b[bi]) {
                bi++
            } else {
                result.push(a[ai])
                ai++
                bi++
            }
        }

        return result
    }
    
    /**
     * Method: App.Helpers.Array.intersectDestructive
     *
     */
    static intersectDestructive = (str) => {
        let result = []

        while (a.length > 0 && b.length > 0) {
            if (a[0] < b[0]) {
                a.shift()
            } else if (a[0] > b[0]) {
                b.shift()
            } else {
                result.push(a.shift())
                b.shift()
            }
        }

        return result
    }
}

module.exports = ArrayHelper