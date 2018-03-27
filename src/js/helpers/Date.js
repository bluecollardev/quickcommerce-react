import moment from "moment/moment"
import momentTimezone from "moment-timezone"

/**********************************************************
 * Namespace: QC.Helpers.Date
 **********************************************************/
export default class DateHelper {

    static createDateFromString = (string, format) => moment(string, format).toDate()

    static formatDateString = (string, format) => {
        ;
        let m = moment(string, format)
        return m._d.toISOString()
    }


    static createDateObjFromString = (string) => {
        if (!!!string) {
            return null
        }

        let date = new Date(string), dateObj = {}, momentDate


        momentDate = moment(string, 'YYYY-MM-DD')
        dateObj.value = momentDate._i
        dateObj.year = date.getUTCFullYear()
        dateObj.month = date.getMonth() + 1//date starts from zero
        dateObj.day = date.getUTCDay()
        dateObj.hour = date.getUTCHours()
        dateObj.minute = date.getUTCMinutes()
        dateObj.second = date.getUTCSeconds()

        dateObj.zone = moment.tz.guess()

        ;
        return dateObj;
    }
}