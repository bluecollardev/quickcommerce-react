/**********************************************************
 * Namespace: QC.Helpers.SpringDate
 **********************************************************/

export default class SpringDateHelper {
    static convertToDate = (obj) => {
        let date = new Date(obj.year, obj.month, obj.day).toDateString()
        return (date === 'Invalid Date') ? '' : date
    }
}