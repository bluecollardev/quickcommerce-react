class NumberHelper {
  static isInteger = (value) => {
    if (typeof value === 'undefined' || value === null) {
      return false
    }

    let n = Math.floor(Number(value))
    return String(n) === String(value) && n >= 0
  }

  /**
   * Standard implementation of euclidean algorithm to get greatest common denominator in the most efficient way possible.
   */
  static greatestCommonDivisor = (a, b) => {
    return (b === 0) ? a : NumberHelper.greatestCommonDivisor(b, a % b)
  }

  static isInRange = (number, rangeMin, rangeMax, inclusive) => {
    inclusive = (typeof inclusive === 'boolean') ? inclusive : true

    if (inclusive) {
      return (Math.min(rangeMin, rangeMax) <= number && Math.max(rangeMin, rangeMax) >= number)
    }

    return (Math.min(rangeMin, rangeMax) < number && Math.max(rangeMin, rangeMax) > number)
  }
}

export default NumberHelper
