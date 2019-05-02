/**********************************************************
 * Namespace: QC.Helpers.JSON
 **********************************************************/
const JSONHelper = {
    /**
     * Method: App.Helpers.JSON.find
     *
     * Searches for and returns a given node in a JSON dataset
     *
     * @node Object
     * @data JSON Object: Any valid JSON object
     *
     * @return
     */
    find: function (expr, data) {
        return jsonPath(data, expr, {resultType: 'VALUE'})
    },
    /**
     * Method: App.Helpers.JSON.findNode
     *
     * Returns a given node in a JSON dataset
     *
     * @node Object
     * @data JSON Object: Any valid JSON object
     *
     * @return
     */
    findNode: function (node, data) {
        let expr
        
        // Build expression from node
        expr = "$..*[?(@.name=='TypeOfLoss')]" // TODO: Implement!
        
        return JSONHelper.find(expr, data)
    },
    /**
     * Method: App.Helpers.JSON.pathTo
     *
     * Returns the path to a given node in a JSON dataset
     *
     * @expr String
     * @data JSON Object: Any valid JSON object
     *
     * @return
     */
    pathTo: function (expr, data) {
        return jsonPath(data, expr, {resultType: 'PATH'})
    },
    /**
     * Method: App.Helpers.JSON.pathToNode
     *
     * Searches for and returns the path to a node belonging to a JSON dataset
     *
     * @expr String
     * @data JSON Object: Any valid JSON object
     *
     * @return
     */
    pathToNode: function (node, data) {
        let expr
        
        // Build expression from node
        expr = "$..*[?(@.name=='TypeOfLoss')]" // TODO: Implement!
        
        return JSONHelper.pathTo(expr, data)
    }
}

module.exports = JSONHelper