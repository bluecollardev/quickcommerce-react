/* eslint-disable linebreak-style */
/**********************************************************
 * Namespace: QC.Helpers.JSON
 **********************************************************/
const JSONHelper = {
  isJSON: function (str){
    try {
      let o = JSON.parse(str)

      if (o && typeof o === 'object') {
        return true
      }
    }
    catch (e) {
      // Do something
      //console.log(e)
    }

    return false
  },
  /**
   * Method: App.helpers.JSON.find
   *
   * Searches for and returns a given node in a JSON dataset
   *
   * @node Object
   * @data JSON Object: Any valid JSON object
   *
   * @return
   */
  find: function (expr, data) {
    return jsonPath(data, expr, { resultType: 'VALUE' })
  },
  /**
   * Method: App.helpers.JSON.findNode
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
    expr = '$..*[?(@.name==\'TypeOfLoss\')]' // TODO: Implement!

    return JSONHelper.find(expr, data)
  },
  /**
   * Method: App.helpers.JSON.pathTo
   *
   * Returns the path to a given node in a JSON dataset
   *
   * @expr String
   * @data JSON Object: Any valid JSON object
   *
   * @return
   */
  pathTo: function (expr, data) {
    return jsonPath(data, expr, { resultType: 'PATH' })
  },
  /**
   * Method: App.helpers.JSON.pathToNode
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
    expr = '$..*[?(@.name==\'TypeOfLoss\')]' // TODO: Implement!

    return JSONHelper.pathTo(expr, data)
  }
}

export default JSONHelper
