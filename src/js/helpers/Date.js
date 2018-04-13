/* eslint-disable linebreak-style */
import moment from 'moment/moment'
import momentTimezone from 'moment-timezone'

/**********************************************************
 * Namespace: QC.helpers.Date
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

    momentDate = moment(string, 'L')
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
   * adjust month by -1 since month is zero based index
   * ie March is 2 but we store 3 in the database
   */
  static adjustMonthforDisplay = (string, format)=> {
    if (!String) {
      return null
    }
    let momentDate = moment(string, format)
    momentDate.subtract(1, 'months')

    return momentDate._d.toDateString()

  }

  static createDateFromDateDTO = (dateDTO)=>{
    //if the dto is already a date return the date
    if(dateDTO instanceof Date && !isNaN(dateDTO.valueOf())){
      return dateDTO
    }
    if(!dateDTO || !dateDTO.value){
      return null
    }
    let dateString = dateDTO.value, timestamp, arr
    arr = dateString.split('[')

    timestamp = Date.parse(arr[0])
    return new Date(timestamp)
  }
}