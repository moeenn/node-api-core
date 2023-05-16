/** @typedef {"SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT"} Day */

export const Dates = {
  /** 
   * check if the provided string is a valid date
   * 
   * @param {string} date
   * @returns {boolean}
   */
  isDateValid(date) {
    const parsed = Date.parse(date)
    return isNaN(parsed) == false
  },

  /** 
   * provided a date as string, calculate the previous day's date
   * 
   * @param {string} dateString
   * @returns {Date}
   */
  previousDay(dateString) {
    const date = new Date(dateString)

    const previous = new Date(date.getTime())
    previous.setDate(date.getDate() - 1)

    return previous
  },

  /** 
   * get day name for specific date
   * 
   * @param {string} date
   * @returns {Day}
   */
  getDateDay(date) {
    const days = /** @type {const} */ (["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"])
    const d = new Date(date)
    return days[d.getDay()]
  },

  /** 
   * provided array of objects, group by field "date" (of type Date)
   * 
   * @param {{ date: Date }[]} data
   * @returns {Record<string, unknown[]>}
   */
  groupByDate(data) {
    const key = /** @type {const} */ ("date")
    const uniqueVals = data
      .map((d) => d[key])
      .sort(
        (a, b) => a.getTime() - b.getTime(),
      ) /** a - b means ascending sort */

    /** @type {Record<string, unknown[]>} */
    const result = {}
    for (const val of uniqueVals) {
      result[val.toISOString()] = data.filter(
        (d) => new Date(d[key]).getTime() === val.getTime(),
      )
    }

    return result
  },
}
