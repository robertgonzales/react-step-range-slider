(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './StepRangeSlider'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./StepRangeSlider'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.StepRangeSlider);
    global.index = mod.exports;
  }
})(this, function (exports, _StepRangeSlider) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_StepRangeSlider).default;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});