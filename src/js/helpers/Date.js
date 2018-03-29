import moment from 'moment/moment'
import momentTimezone from 'moment-timezone'

/**********************************************************
 * Namespace: QC.Helpers.Date
 **********************************************************/
export default class DateHelper {

  static createDateFromString = (string, format) => moment(string, format).toDate()

  static formatDateString = (string, format) => {
        
    let m = moment(string, format)
    return m._d.toISOString()
  }

  /**
   * Pass in a string date, typically use this with a html date picker
   * @returns {ZoneDateDTO}
   */
  static createDateObjFromString = (string) => {
      
    if (!string) {
      return null
    }
    let dateObj = {}, momentDate

    momentDate = moment(string, 'YYYY-MM-DD')
    dateObj.value = momentDate._i
    dateObj.year = momentDate._a[0]
    dateObj.month = momentDate._a[1]+1//date starts from zero
    dateObj.day = momentDate._a[2]
    dateObj.hour = momentDate._a[3]
    dateObj.minute = momentDate._a[4]
    dateObj.second = momentDate._a[5]
    dateObj.zone = moment.tz.guess()

    return dateObj
  }

  /**
   * Pass in a string date, typically use this with a react-calendar date picker
   * @returns {ZoneDateDTO}
   */
  static createDateObjFromDate = (date) => {
    let string, dateObj = {}, momentDate
    if (!date) {
      return null
    }
    string = date.toLocaleString()

    momentDate = moment(string, '"YYYY-MM-DD HH:mm Z"')
    dateObj.value = momentDate._i
    dateObj.year = momentDate._a[0]
    dateObj.month = momentDate._a[1]+1//date starts from zero
    dateObj.day = momentDate._a[2]
    dateObj.hour = momentDate._a[3]
    dateObj.minute = momentDate._a[4]
    dateObj.second = momentDate._a[5]
    dateObj.zone = moment.tz.guess()

    return dateObj
  }
}