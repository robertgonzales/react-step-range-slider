(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'lodash', 'react', 'react-dom', './slider-utils', './StepRangeSlider.css'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('lodash'), require('react'), require('react-dom'), require('./slider-utils'), require('./StepRangeSlider.css'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodash, global.react, global.reactDom, global.sliderUtils, global.StepRangeSlider);
    global.StepRangeSlider = mod.exports;
  }
})(this, function (exports, _lodash, _react, _reactDom, _sliderUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

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

  var StepRangeSlider = function (_React$Component) {
    _inherits(StepRangeSlider, _React$Component);

    function StepRangeSlider(props) {
      _classCallCheck(this, StepRangeSlider);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StepRangeSlider).call(this, props));

      _this.setInitialState = _this.setInitialState.bind(_this);
      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleDragStart = _this.handleDragStart.bind(_this);
      _this.handleDrag = _this.handleDrag.bind(_this);
      _this.handleDragEnd = _this.handleDragEnd.bind(_this);
      _this.handleClick = _this.handleClick.bind(_this);
      return _this;
    }

    _createClass(StepRangeSlider, [{
      key: 'setInitialState',
      value: function setInitialState(props) {
        var breakpoints = (0, _sliderUtils.configureBreakpoints)(props.breakpoints);
        var value = breakpoints.ensureValue(props.value || props.defaultValue);
        var currentStep = breakpoints.getStepForValue(value);
        this.setState({ value: value, breakpoints: breakpoints, currentStep: currentStep });
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.handleChange = _lodash2.default.throttle(this.handleChange, 100);
        this.setInitialState(this.props);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.handleChange.cancel();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.breakpoints && nextProps.breakpoints !== this.props.breakpoints) {
          this.setInitialState(nextProps);
        }
      }
    }, {
      key: 'stepUp',
      value: function stepUp(amount) {
        var _state = this.state;
        var breakpoints = _state.breakpoints;
        var currentStep = _state.currentStep;

        var nextStep = currentStep + amount;
        if (nextStep <= breakpoints.maxStep) {
          this.setState({ currentStep: nextStep });
        }
      }
    }, {
      key: 'stepDown',
      value: function stepDown(amount) {
        var _state2 = this.state;
        var breakpoints = _state2.breakpoints;
        var currentStep = _state2.currentStep;

        var nextStep = currentStep - amount;
        if (nextStep >= breakpoints.minStep) {
          this.setState({ currentStep: nextStep });
        }
      }
    }, {
      key: 'handleChange',
      value: function handleChange(value) {
        var onChange = this.props.onChange;

        _lodash2.default.isFunction(onChange) && onChange(value);
      }
    }, {
      key: 'handleDragStart',
      value: function handleDragStart(e) {
        this.sliderRect = e.currentTarget.parentNode.getBoundingClientRect();
        e.dataTransfer.setDragImage((0, _sliderUtils.getEmptyImage)(e), 0, 0);
      }
    }, {
      key: 'handleDrag',
      value: function handleDrag(e) {
        var disabled = this.props.disabled;
        var breakpoints = this.state.breakpoints;
        var _sliderRect = this.sliderRect;
        var width = _sliderRect.width;
        var left = _sliderRect.left;
        var right = _sliderRect.right;


        if (!e.clientX || disabled) return;

        var position = void 0;
        if (e.clientX < left) {
          position = 0;
        } else if (e.clientX > right) {
          position = right - left;
        } else {
          position = e.clientX - left;
        }
        var positionPercent = position / width;
        var currentStep = Math.round(position / width * breakpoints.maxStep);
        var value = breakpoints.getValueForStep(currentStep);

        this.setState({ value: value, currentStep: currentStep });
        this.handleChange(value);
      }
    }, {
      key: 'handleDragEnd',
      value: function handleDragEnd(e) {
        var value = this.state.value;
        var onChangeComplete = this.props.onChangeComplete;

        _lodash2.default.isFunction(onChangeComplete) && onChangeComplete(value);
      }
    }, {
      key: 'handleClick',
      value: function handleClick(e) {
        var value = this.state.value;
        var onChangeComplete = this.props.onChangeComplete;

        this.sliderRect = e.currentTarget.getBoundingClientRect();
        this.handleDrag(e);
        _lodash2.default.isFunction(onChangeComplete) && onChangeComplete(value);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var id = _props.id;
        var name = _props.name;
        var disabled = _props.disabled;
        var tooltip = _props.tooltip;
        var children = _props.children;
        var _state3 = this.state;
        var value = _state3.value;
        var breakpoints = _state3.breakpoints;
        var currentStep = _state3.currentStep;

        var offset = currentStep / breakpoints.maxStep * 100;
        var offsetStyle = { left: offset + '%' };

        return _react2.default.createElement(
          'div',
          { className: 'StepRangeSlider', onClick: this.handleClick },
          _react2.default.createElement('div', { className: 'StepRangeSlider__track' }),
          _react2.default.createElement(
            'div',
            { className: 'StepRangeSlider__handle',
              onDragStart: this.handleDragStart,
              onDragEnd: this.handleDragEnd,
              onDrag: this.handleDrag,
              style: offsetStyle,
              draggable: true },
            _react2.default.createElement('div', {
              className: 'StepRangeSlider__thumb',
              'aria-valuemin': breakpoints.minValue,
              'aria-valuemax': breakpoints.maxValue,
              'aria-valuenow': value,
              role: 'slider'
            }),
            _lodash2.default.isFunction(children) ? children(value) : children
          ),
          _react2.default.createElement('input', { type: 'hidden', id: id, name: name, disabled: disabled })
        );
      }
    }]);

    return StepRangeSlider;
  }(_react2.default.Component);

  exports.default = StepRangeSlider;


  StepRangeSlider.displayName = "StepRangeSlider";

  StepRangeSlider.propTypes = {
    children: _react2.default.PropTypes.any,
    value: _react2.default.PropTypes.number,
    defaultValue: _react2.default.PropTypes.number,
    onChange: _react2.default.PropTypes.func,
    onChangeComplete: _react2.default.PropTypes.func,
    breakpoints: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
      breakpoint: _react2.default.PropTypes.number.isRequired,
      step: _react2.default.PropTypes.number
    }).isRequired).isRequired
  };

  StepRangeSlider.defaultProps = {
    defaultValue: 0,
    breakpoints: [{ breakpoint: 0, step: 1 }, { breakpoint: 100 }],
    children: function children(value) {
      return _react2.default.createElement(
        'div',
        { className: 'StepRangeSlider__tooltip' },
        value
      );
    }
  };
});