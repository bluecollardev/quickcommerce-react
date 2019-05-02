/**********************************************************
 * Namespace: QC.Helpers.Form
 **********************************************************/

export default class FormHelper {
    static getMappedValue(path, data) {
        if (typeof data === 'undefined' || data === null) {
            return null
        }
        
        // Access static methods using constructor property
        let chunks = FormHelper.getObjectPath(path)
        
        let arrayExpr = /(\[\]|\[(.*)\])$/g
        let isArray = false
        
        let currentChunk = chunks.shift() // Shift the first element off the array
        isArray = arrayExpr.test(currentChunk)
        
        /*if (isArray) {
            console.log(currentChunk + ' is an array')
        } else {
            console.log(currentChunk + ' is not an array')
        }*/
        
        if (chunks.length > 0) {
            //console.log('processing path chunk: ' + currentChunk)
            let prop = currentChunk
            
            if (isArray) {
                // Bust the [] off the string so we're left with just the property key                
                prop = prop.replace(arrayExpr, '')
                
                // Get the index of the array item we're targeting
                // Not sure if there's ever a case where we wouldn't use an index (myProp[])? How would that work?
                let arrIdx = parseInt(arrayExpr.exec(currentChunk)[2]) // Just get the number
                //console.log(JSON.stringify(data[prop][arrIdx]))
                
                // IMPORTANT! Re-escape the chunks before recursing or the result will not be what you expected
                chunks = chunks.map(chunk => {
                    return chunk.replace('.', '\\\\.')
                })
                
                return FormHelper.getMappedValue(chunks.join('.'), data[prop][arrIdx])
            }
            
            //console.log(JSON.stringify(data[prop]))
            return FormHelper.getMappedValue(chunks.join('.'), data[prop])
        } else {
            return data[currentChunk]
        }        
    }
    
    static getObjectPath(str) {
        // ([^\\]) Negative capturing group to make sure we don't pick up escape slashes
        // (\\\\)* Match backslash character
        // \. Grab any unescaped dots
        
        if (!(typeof str === 'string')) {
            throw new Error('Invalid object path, getObjectPath expected a string')
        }
        
        let merged = []
        
        // Credits to https://github.com/wankdanker/node-object-mapper/blob/master/src/set-key-value.js for this approach to parsing object paths
        let dotExpr = /([^\\])(\\\\)*\./g // Matches all unescaped dots in the provided string
        let chunks = str.split(dotExpr) // Explode the string into an array of path chunks
        
        for (let i = 0; i < chunks.length; i++) {
            if ((i - 1) % 3 === 0) {
                // Every third match is the character of the first group [^\\] which needs to be merged in again
                // That comment doesn't really make sense... let's work on it eh?
                let tmpKey = chunks[i - 1] + chunks[i]
                merged.push(tmpKey.replace('\\.', '.'))
            }
            
            // Add part after last dot
            if (i === chunks.length - 1) {
                merged.push(chunks[i].replace('\\.', '.'))
            }
        }
        
        chunks = merged
        
        //console.log(JSON.stringify(chunks))
        
        return chunks
    }
}