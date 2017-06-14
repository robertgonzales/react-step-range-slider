(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'lodash/sortBy', 'lodash/reduce', 'lodash/head', 'lodash/last'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('lodash/sortBy'), require('lodash/reduce'), require('lodash/head'), require('lodash/last'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.sortBy, global.reduce, global.head, global.last);
    global.sliderUtils = mod.exports;
  }
})(this, function (exports, _sortBy, _reduce, _head, _last) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configureRange = configureRange;

  var _sortBy2 = _interopRequireDefault(_sortBy);

  var _reduce2 = _interopRequireDefault(_reduce);

  var _head2 = _interopRequireDefault(_head);

  var _last2 = _interopRequireDefault(_last);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

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

  function configureRange(range) {
    // sort by ascending value.
    var sorted = (0, _sortBy2.default)(range, function (b) {
      return b.value;
    }
    // calculates stepsSoFar on each value breakpoint
    // for easier value/step calulations later.
    );var breakpoints = (0, _reduce2.default)(sorted, function (result, curr, key) {
      // to calculate stepsSoFar we must get the
      // range of values from the previous breakpoint
      // to our current breakpoint.
      var prev = sorted[key - 1];
      if (prev) {
        // calculate number of steps to reach the
        // breakpoint value.
        curr.stepsSoFar = (curr.value - prev.value) / prev.step + prev.stepsSoFar;
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
    }, []

    // min and max for easier calculations later
    );var minStep = (0, _head2.default)(breakpoints).stepsSoFar;
    var maxStep = (0, _last2.default)(breakpoints).stepsSoFar;
    var minValue = (0, _head2.default)(breakpoints).value;
    var maxValue = (0, _last2.default)(breakpoints).value;

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
      var nearest = (0, _reduce2.default)(breakpoints, function (prev, curr) {
        return curr.stepsSoFar < step && curr.stepsSoFar > prev.stepsSoFar ? curr : prev;
      }, (0, _head2.default)(breakpoints)
      // determine value past nearest breakpoint value
      );var additionalValue = (step - nearest.stepsSoFar) * nearest.step;
      return nearest.value + additionalValue;
    };

    // calculates number of steps for current value
    var getStepForValue = function getStepForValue(value) {
      // find the nearest breakpoint behind current value
      var nearest = (0, _reduce2.default)(breakpoints, function (prev, curr) {
        return curr.value < value && curr.value > prev.value ? curr : prev;
      }, (0, _head2.default)(breakpoints)
      // determine number of steps past nearest breakpoint steps so far
      );var additionalSteps = (value - nearest.value) / nearest.step;
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
});