/* eslint-disable linebreak-style */
class DOMElementHelper {
  /**
   * Method: App.helpers.Object.isEmpty
   */
  static isEmpty = (obj) => {
    obj = obj || null

    if (obj === null) return true

    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && obj.prop !== null) return false
    }

    return true
  }

  static generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}

export default DOMElementHelper
