(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.sliderUtils = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configureBreakpoints = configureBreakpoints;
  exports.getEmptyImage = getEmptyImage;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

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

  function configureBreakpoints(breakpoints) {
    // sort by ascending breakpoints.
    var sorted = _.sortBy(breakpoints, function (b) {
      return b.breakpoint;
    });
    // calculates stepsSoFar on each breakpoint 
    // for easier value/step calulations later.
    var _breakpoints = _.reduce(sorted, function (result, curr, key) {
      // to calculate stepsSoFar we must get the
      // range of values from the previous breakpoint
      // to our current breakpoint.
      var prev = sorted[key - 1];
      if (prev) {
        // calculate number of steps to reach the 
        // breakpoint value.
        curr.stepsSoFar = (curr.breakpoint - prev.breakpoint) / prev.step + prev.stepsSoFar;
      } else {
        // the first breakpoint represents min value
        // so stepsSoFar will always be 0.
        curr.stepsSoFar = 0;
      }
      // final breakpoint represents max value 
      // so user isn't forced to set a step
      // even though we need it here.
      if (_typeof(curr.step) === (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) {
        curr.step = 1;
      }
      result.push(curr);
      return result;
    }, []);

    // min and max for easier calculations later
    var minStep = _.first(_breakpoints).stepsSoFar;
    var maxStep = _.last(_breakpoints).stepsSoFar;
    var minValue = _.first(_breakpoints).breakpoint;
    var maxValue = _.last(_breakpoints).breakpoint;

    // return value within min and max value range
    var ensureValue = function ensureValue(value) {
      if (value > maxValue) {
        return maxValue;
      } else if (value < minValue) {
        return minValue;
      } else {
        return value;
      }
    };

    // calculates value for current steps
    var getValueForStep = function getValueForStep(step) {
      // find the nearest breakpoint behind current step
      var nearest = _.reduce(_breakpoints, function (prev, curr) {
        return curr.stepsSoFar < step && curr.stepsSoFar > prev.stepsSoFar ? curr : prev;
      }, _.first(_breakpoints));
      // determine value past nearest breakpoint value
      var additionalValue = (step - nearest.stepsSoFar) * nearest.step;
      return nearest.breakpoint + additionalValue;
    };

    // calculates number of steps for current value
    var getStepForValue = function getStepForValue(value) {
      // find the nearest breakpoint behind current value
      var nearest = _.reduce(_breakpoints, function (prev, curr) {
        return curr.breakpoint < value && curr.breakpoint > prev.breakpoint ? curr : prev;
      }, _.first(_breakpoints));
      // determine number of steps past nearest breakpoint steps so far
      var additionalSteps = (value - nearest.breakpoint) / nearest.step;
      return nearest.stepsSoFar + additionalSteps;
    };

    return {
      minStep: minStep,
      maxStep: maxStep,
      minValue: minValue,
      maxValue: maxValue,
      ensureValue: ensureValue,
      getValueForStep: getValueForStep,
      getStepForValue: getStepForValue
    };
  }

  // effectively disables html5 default drag preview
  var emptyImage = null;
  function getEmptyImage() {
    if (!emptyImage) {
      emptyImage = new Image();
      emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }
    return emptyImage;
  }
});