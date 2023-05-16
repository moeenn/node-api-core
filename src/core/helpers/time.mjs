export class Time {
  /** @type {number} */
  hours

  /** @type {number} */
  minutes

  /**
   *
   * @param {number} hours
   * @param {number} minutes
   */
  constructor(hours, minutes) {
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`invalid time: ${hours}:${minutes}`)
    }

    this.hours = hours
    this.minutes = minutes
  }

  /**
   * parse provided string as Time
   *
   * @param {string} time
   * @returns {Time | undefined}
   */
  static parseString(time) {
    const pieces = time.split(":")
    if (pieces.length !== 2) return

    /**
     *
     * @param {string} raw
     * @returns {number | undefined}
     */
    const parse = (raw) => (!isNaN(parseInt(raw)) ? parseInt(raw) : undefined)
    const hours = parse(pieces[0])
    const minutes = parse(pieces[1])

    if (hours == undefined || hours < 0 || hours > 23) return
    if (minutes == undefined || minutes < 0 || minutes > 59) return

    return new Time(hours, minutes)
  }

  /**
   * @returns {string}
   */
  toString() {
    /** @param {number} n */
    const pad = (n) => n.toString().padStart(2, "0")
    return `${pad(this.hours)}:${pad(this.minutes)}`
  }

  /**
   * calculate cumulative minutes for the day from parsed time
   *
   * @returns {number}
   */
  toMins() {
    return this.hours * 60 + this.minutes
  }

  /**
   *
   * @param {number} durationHours
   * @param {number} durationMinutes
   * @returns {Time}
   */
  addDuration(durationHours, durationMinutes) {
    const mins = this.minutes + durationMinutes

    return new Time(
      ((this.hours + durationHours) % 24) + Math.floor(mins / 60),
      mins % 60,
    )
  }

  /**
   *
   * @param {string} startTime
   * @param {number} durationHours
   * @param {number} durationMinutes
   * @returns {string | undefined}
   */
  static addDurationToTimeString(startTime, durationHours, durationMinutes) {
    const parsedStart = this.parseString(startTime)
    if (!parsedStart) return

    const endTime = parsedStart.addDuration(durationHours, durationMinutes)

    return endTime.toString()
  }

  /**
   * calculate difference between two Time objects
   *
   * @param {Time} start
   * @param {Time} end
   * @returns {Time}
   */
  static timeDelta(start, end) {
    const startMins = start.toMins()
    const endMins = end.toMins()

    let delta = endMins - startMins
    if (delta < 0) {
      const midnightMins = new Time(23, 59).toMins() + 1
      delta = Math.abs(delta + midnightMins)
    }

    return new Time(Math.floor(delta / 60) % 24, delta % 60)
  }

  /**
   *
   * @param {Time} time
   * @returns {Time}
   */
  static timeToMidnight(time) {
    const midnight = new Time(23, 59)
    midnight.minutes += 1
    return this.timeDelta(time, midnight)
  }

  /**
   * start and end minutes are included
   *
   * @param {Time} start
   * @param {Time} end
   * @param {Time} current
   * @returns {boolean}
   */
  static isWithinTimeRange(start, end, current) {
    const currentMins = current.toMins()
    return currentMins >= start.toMins() && currentMins <= end.toMins()
  }
}
