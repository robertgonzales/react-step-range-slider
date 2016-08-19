
/* EXAMPLE

const breakpoints = [
  { breakpoint: 0, step: 1}, 
  { breakpoint: 20, step: 5 }, 
  { breakpoint: 100 }
]

const Breakpoints = configureBreakpoints(breakpoints)

Breakpoints.minStep // 0
Breakpoints.maxStep // 36
Breakpoints.getValueForStep(22) // 30
Breakpoints.getStepForValue(30) // 22

*/

export function configureBreakpoints(breakpoints) {
  // sort by ascending breakpoints.
  const sorted = _.sortBy(breakpoints, b => b.breakpoint)
  // calculates stepsSoFar on each breakpoint 
  // for easier value/step calulations later.
  const _breakpoints = _.reduce(sorted, (result, curr, key) => {
    // to calculate stepsSoFar we must get the
    // range of values from the previous breakpoint
    // to our current breakpoint.
    const prev = sorted[key - 1]
    if (prev) {
      // calculate number of steps to reach the 
      // breakpoint value.
      curr.stepsSoFar = ((curr.breakpoint - prev.breakpoint) / prev.step) + prev.stepsSoFar
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
  }, [])

  // min and max for easier calculations later
  const minStep = _.first(_breakpoints).stepsSoFar
  const maxStep = _.last(_breakpoints).stepsSoFar
  const minValue = _.first(_breakpoints).breakpoint
  const maxValue = _.last(_breakpoints).breakpoint

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
    const nearest = _.reduce(_breakpoints, (prev, curr) => (
      curr.stepsSoFar < step && curr.stepsSoFar > prev.stepsSoFar ? curr : prev
    ), _.first(_breakpoints))
    // determine value past nearest breakpoint value
    const additionalValue = (step - nearest.stepsSoFar) * nearest.step
    return nearest.breakpoint + additionalValue 
  }

  // calculates number of steps for current value
  const getStepForValue = value => {
    // find the nearest breakpoint behind current value
    const nearest = _.reduce(_breakpoints, (prev, curr) => (
      curr.breakpoint < value && curr.breakpoint > prev.breakpoint ? curr : prev
    ), _.first(_breakpoints))
    // determine number of steps past nearest breakpoint steps so far
    const additionalSteps = (value - nearest.breakpoint) / nearest.step
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


// effectively disables html5 default drag preview
let emptyImage = null
export function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image()
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  }
  return emptyImage
}