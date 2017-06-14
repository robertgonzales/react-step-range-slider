(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'lodash/throttle', 'lodash/isFunction', 'react', 'prop-types', 'react-dom', 'classnames', './slider-utils', './StepRangeSlider.css'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('lodash/throttle'), require('lodash/isFunction'), require('react'), require('prop-types'), require('react-dom'), require('classnames'), require('./slider-utils'), require('./StepRangeSlider.css'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.throttle, global.isFunction, global.react, global.propTypes, global.reactDom, global.classnames, global.sliderUtils, global.StepRangeSlider);
    global.StepRangeSlider = mod.exports;
  }
})(this, function (exports, _throttle, _isFunction, _react, _propTypes, _reactDom, _classnames, _sliderUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _throttle2 = _interopRequireDefault(_throttle);

  var _isFunction2 = _interopRequireDefault(_isFunction);

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _classnames2 = _interopRequireDefault(_classnames);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var StepRangeSlider = function (_Component) {
    _inherits(StepRangeSlider, _Component);

    function StepRangeSlider() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, StepRangeSlider);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StepRangeSlider.__proto__ || Object.getPrototypeOf(StepRangeSlider)).call.apply(_ref, [this].concat(args))), _this), _this.setInitialState = function (props) {
        var range = (0, _sliderUtils.configureRange)(props.range);
        var value = range.ensureValue(props.value || props.defaultValue);
        var currentStep = range.getStepForValue(value);
        _this.setState({ value: value, range: range, currentStep: currentStep });
      }, _this.stepUp = function (amount) {
        var _this$state = _this.state,
            range = _this$state.range,
            currentStep = _this$state.currentStep;

        var nextStep = currentStep + amount;
        if (nextStep <= range.maxStep) {
          var nextValue = range.getValueForStep(nextStep);
          _this.setState({ currentStep: nextStep, value: nextValue });
        }
      }, _this.stepDown = function (amount) {
        var _this$state2 = _this.state,
            range = _this$state2.range,
            currentStep = _this$state2.currentStep;

        var nextStep = currentStep - amount;
        if (nextStep >= range.minStep) {
          var nextValue = range.getValueForStep(nextStep);
          _this.setState({ currentStep: nextStep, value: nextValue });
        }
      }, _this.handleChange = function () {
        var value = _this.state.value;
        var onChange = _this.props.onChange;

        (0, _isFunction2.default)(onChange) && onChange(value);
      }, _this.handleChangeComplete = function () {
        var value = _this.state.value;
        var onChangeComplete = _this.props.onChangeComplete;

        (0, _isFunction2.default)(onChangeComplete) && onChangeComplete(value);
      }, _this.handleMouseUp = function (e) {
        if (_this.state.pressed) {
          _this.setState({ pressed: false });
          _this.handleChangeComplete();
        }
      }, _this.handleMouseMove = function (e) {
        if (_this.state.pressed) {
          _this.handleMove(e);
        }
      }, _this.handleMouseDown = function (e) {
        e.preventDefault();
        _this.handlePress();
        _this.handleMove(e);
      }, _this.handleTouchMove = function (e) {
        if (_this.state.pressed) {
          e.preventDefault();
          _this.handleMouseMove(e.touches[0]);
        }
      }, _this.handleTouchStart = function (e) {
        _this.handlePress();
        _this.handleMove(e.touches[0]);
      }, _this.handlePress = function () {
        _this.sliderRect = _this.slider.getBoundingClientRect();
        _this.setState({ pressed: true });
      }, _this.handleMove = function (e) {
        var clientX = e.clientX;
        var disabled = _this.props.disabled;
        var range = _this.state.range;
        var _this$sliderRect = _this.sliderRect,
            width = _this$sliderRect.width,
            left = _this$sliderRect.left,
            right = _this$sliderRect.right;


        if (!clientX || disabled) return;

        var position = void 0;
        if (clientX < left) {
          position = 0;
        } else if (clientX > right) {
          position = right - left;
        } else {
          position = clientX - left;
        }
        var currentStep = Math.round(position / width * range.maxStep);
        var value = range.getValueForStep(currentStep);

        if (value !== _this.state.value || currentStep !== _this.state.currentStep) {
          _this.setState({ value: value, currentStep: currentStep }, _this.handleChange);
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(StepRangeSlider, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.handleChange = (0, _throttle2.default)(this.handleChange, 200);
        this.setInitialState(this.props);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.handleChange.cancel();
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleMouseUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.range && nextProps.range !== this.props.range) {
          this.setInitialState(nextProps);
        }
        if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
          var value = this.state.range.ensureValue(nextProps.value);
          this.setState({ value: value });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            id = _props.id,
            name = _props.name,
            disabled = _props.disabled,
            tooltip = _props.tooltip,
            children = _props.children,
            className = _props.className;
        var _state = this.state,
            value = _state.value,
            range = _state.range,
            currentStep = _state.currentStep;


        var offset = currentStep / range.maxStep * 100;
        var offsetStyle = { left: offset + '%' };

        return _react2.default.createElement(
          'div',
          {
            className: (0, _classnames2.default)('StepRangeSlider', className),
            onMouseDown: this.handleMouseDown,
            ref: function ref(node) {
              return _this2.slider = node;
            } },
          _react2.default.createElement('div', { className: 'StepRangeSlider__track' }),
          _react2.default.createElement(
            'div',
            {
              className: 'StepRangeSlider__handle',
              onTouchStart: this.handleTouchStart,
              onMouseDown: this.handleMouseDown,
              style: offsetStyle },
            _react2.default.createElement('div', {
              className: 'StepRangeSlider__thumb',
              'aria-valuemin': range.minValue,
              'aria-valuemax': range.maxValue,
              'aria-valuenow': value,
              role: 'slider'
            }),
            (0, _isFunction2.default)(children) ? children(value) : children
          ),
          _react2.default.createElement('input', { type: 'hidden', id: id, name: name, disabled: disabled })
        );
      }
    }]);

    return StepRangeSlider;
  }(_react.Component);

  exports.default = StepRangeSlider;


  StepRangeSlider.displayName = 'StepRangeSlider';

  StepRangeSlider.propTypes = {
    children: _propTypes2.default.any,
    value: _propTypes2.default.number,
    defaultValue: _propTypes2.default.number,
    disabled: _propTypes2.default.bool,
    onChange: _propTypes2.default.func,
    onChangeComplete: _propTypes2.default.func,
    range: _propTypes2.default.arrayOf(_propTypes2.default.shape({
      value: _propTypes2.default.number.isRequired,
      step: _propTypes2.default.number
    }).isRequired).isRequired
  };

  StepRangeSlider.defaultProps = {
    defaultValue: 0,
    range: [{ value: 0, step: 1 }, { value: 100 }],
    children: function children(value) {
      return _react2.default.createElement(
        'div',
        { className: 'StepRangeSlider__tooltip' },
        value
      );
    }
  };
});