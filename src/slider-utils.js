import sortBy from 'lodash/sortBy'
import reduce from 'lodash/reduce'
import head from 'lodash/head'
import last from 'lodash/last'

/* EXAMPLE

const range = [
  { value: 0, step: 1},
  { value: 20, step: 5 },
  { value: 100 }
]

const Range = configureRange(range)

Range.minStep // 0
Range.maxStep // 36
Range.getValueForStep(22) // 30
Range.getStepForValue(30) // 22

*/

export function configureRange(range) {
  // sort by ascending value.
  const sorted = sortBy(range, b => b.value)
  // calculates stepsSoFar on each value breakpoint
  // for easier value/step calulations later.
  const breakpoints = reduce(
    sorted,
    (result, curr, key) => {
      // to calculate stepsSoFar we must get the
      // range of values from the previous breakpoint
      // to our current breakpoint.
      const prev = sorted[key - 1]
      if (prev) {
        // calculate number of steps to reach the
        // breakpoint value.
        curr.stepsSoFar =
          (curr.value - prev.value) / prev.step + prev.stepsSoFar
      } else {
        // the first breakpoint represents min value
        // so stepsSoFar will always be 0.
        curr.stepsSoFar = 0
      }
      // final breakpoint represents max value
      // so user isn't forced to set a step
      // even though we need it here.
      if (typeof curr.step === typeof undefined) {
        curr.step = 1
      }
      result.push(curr)
      return result
    },
    []
  )

  // min and max for easier calculations later
  const minStep = head(breakpoints).stepsSoFar
  const maxStep = last(breakpoints).stepsSoFar
  const minValue = head(breakpoints).value
  const maxValue = last(breakpoints).value

  // return value within min and max value range
  const ensureValue = value => {
    if (value > maxValue) {
      return maxValue
    } else if (value < minValue) {
      return minValue
    } else {
      return value
    }
  }

  // calculates value for current steps
  const getValueForStep = step => {
    // find the nearest breakpoint behind current step
    const nearest = reduce(
      breakpoints,
      (prev, curr) =>
        curr.stepsSoFar < step && curr.stepsSoFar > prev.stepsSoFar
          ? curr
          : prev,
      head(breakpoints)
    )
    // determine value past nearest breakpoint value
    const additionalValue = (step - nearest.stepsSoFar) * nearest.step
    return nearest.value + additionalValue
  }

  // calculates number of steps for current value
  const getStepForValue = value => {
    // find the nearest breakpoint behind current value
    const nearest = reduce(
      breakpoints,
      (prev, curr) =>
        curr.value < value && curr.value > prev.value ? curr : prev,
      head(breakpoints)
    )
    // determine number of steps past nearest breakpoint steps so far
    const additionalSteps = (value - nearest.value) / nearest.step
    return nearest.stepsSoFar + additionalSteps
  }

  return {
    minStep,
    maxStep,
    minValue,
    maxValue,
    ensureValue,
    getValueForStep,
    getStepForValue,
  }
}
