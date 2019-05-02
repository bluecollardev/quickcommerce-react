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
    
    /**
     * Checks to see if one array contains all the members of another eg. [0,1,2,3] in [0,1,2,3,4]
     * This doesn't work if the array members are objects, and is designed to compare value types.
     */
    static containsAll = (arr1, arr2) => {
        return arr2.every(arr2Item => arr1.includes(arr2Item))
    }

    /**
     * Checks to see if two arrays have the same members eg. [2,1,2] <=> [1,2,2]
     * This doesn't work if the array members are objects, and is designed to compare value types.
     */
    static sameMembers = (arr1, arr2) => {
        return (ArrayHelper.containsAll(arr1, arr2) && ArrayHelper.containsAll(arr2, arr1))
    }
    
    /**
     * Quick and dirty way to compare arrays or objects without getting into too much detail.
     * This isn't the fastest solution by any means but it generally works.
     * I don't recommend using this to compare complex structures (it'll be slow).
     */
    static jsonSameMembers = (arr1, arr2) => {
        return JSON.stringify(arr1) === JSON.stringify(arr2) 
    }
}