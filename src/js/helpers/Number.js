class NumberHelper {
  static isInteger(value) {
    if (typeof value === 'undefined' || value === null) {
      return false
    }

    let n = Math.floor(Number(value))
    return String(n) === String(value) && n >= 0
  }
}

export default NumberHelper
