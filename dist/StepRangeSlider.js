(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'lodash', 'react', 'react-dom', 'classnames', './slider-utils', './StepRangeSlider.css'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('lodash'), require('react'), require('react-dom'), require('classnames'), require('./slider-utils'), require('./StepRangeSlider.css'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodash, global.react, global.reactDom, global.classnames, global.sliderUtils, global.StepRangeSlider);
    global.StepRangeSlider = mod.exports;
  }
})(this, function (exports, _lodash, _react, _reactDom, _classnames, _sliderUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _react2 = _interopRequireDefault(_react);

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

  var StepRangeSlider = function (_React$Component) {
    _inherits(StepRangeSlider, _React$Component);

    function StepRangeSlider(props) {
      _classCallCheck(this, StepRangeSlider);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StepRangeSlider).call(this, props));

      _this.setInitialState = _this.setInitialState.bind(_this);
      _this.stepUp = _this.stepUp.bind(_this);
      _this.stepDown = _this.stepDown.bind(_this);
      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleChangeComplete = _this.handleChangeComplete.bind(_this);
      _this.handleTouchStart = _this.handleTouchStart.bind(_this);
      _this.handleTouchMove = _this.handleTouchMove.bind(_this);
      _this.handleTouchEnd = _this.handleTouchEnd.bind(_this);
      _this.handleDragStart = _this.handleDragStart.bind(_this);
      _this.handleDrag = _this.handleDrag.bind(_this);
      _this.handleDragEnd = _this.handleDragEnd.bind(_this);
      _this.handleSnap = _this.handleSnap.bind(_this);
      _this.handleMove = _this.handleMove.bind(_this);
      return _this;
    }

    _createClass(StepRangeSlider, [{
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
        if (nextProps.range && nextProps.range !== this.props.range) {
          this.setInitialState(nextProps);
        }
        if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
          var value = this.state.range.ensureValue(nextProps.value);
          this.setState({ value: value });
        }
      }
    }, {
      key: 'setInitialState',
      value: function setInitialState(props) {
        var range = (0, _sliderUtils.configureRange)(props.range);
        var value = range.ensureValue(props.value || props.defaultValue);
        var currentStep = range.getStepForValue(value);
        this.setState({ value: value, range: range, currentStep: currentStep });
      }
    }, {
      key: 'stepUp',
      value: function stepUp(amount) {
        var _state = this.state;
        var range = _state.range;
        var currentStep = _state.currentStep;

        var nextStep = currentStep + amount;
        if (nextStep <= range.maxStep) {
          var nextValue = range.getValueForStep(nextStep);
          this.setState({ currentStep: nextStep, value: nextValue });
        }
      }
    }, {
      key: 'stepDown',
      value: function stepDown(amount) {
        var _state2 = this.state;
        var range = _state2.range;
        var currentStep = _state2.currentStep;

        var nextStep = currentStep - amount;
        if (nextStep >= range.minStep) {
          var nextValue = range.getValueForStep(nextStep);
          this.setState({ currentStep: nextStep, value: nextValue });
        }
      }
    }, {
      key: 'handleChange',
      value: function handleChange() {
        var value = this.state.value;
        var onChange = this.props.onChange;

        _lodash2.default.isFunction(onChange) && onChange(value);
      }
    }, {
      key: 'handleChangeComplete',
      value: function handleChangeComplete() {
        var value = this.state.value;
        var onChangeComplete = this.props.onChangeComplete;

        _lodash2.default.isFunction(onChangeComplete) && onChangeComplete(value);
      }
    }, {
      key: 'handleTouchStart',
      value: function handleTouchStart(e) {
        this.sliderRect = e.currentTarget.parentNode.getBoundingClientRect();
      }
    }, {
      key: 'handleTouchEnd',
      value: function handleTouchEnd(e) {
        this.handleChangeComplete();
      }
    }, {
      key: 'handleTouchMove',
      value: function handleTouchMove(e) {
        e.preventDefault();
        this.handleDrag(e.touches[0]);
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
        var _this2 = this;

        this.handleMove(e.clientX, function () {
          _this2.handleChange();
        });
      }
    }, {
      key: 'handleDragEnd',
      value: function handleDragEnd(e) {
        this.handleChangeComplete();
      }
    }, {
      key: 'handleSnap',
      value: function handleSnap(e) {
        var _this3 = this;

        this.sliderRect = e.currentTarget.getBoundingClientRect();
        this.handleMove(e.clientX, function () {
          _this3.handleChange();
          _this3.handleChangeComplete();
        });
      }
    }, {
      key: 'handleMove',
      value: function handleMove(clientX, callback) {
        var disabled = this.props.disabled;
        var range = this.state.range;
        var _sliderRect = this.sliderRect;
        var width = _sliderRect.width;
        var left = _sliderRect.left;
        var right = _sliderRect.right;


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

        if (value !== this.state.value || currentStep !== this.state.currentStep) {
          this.setState({ value: value, currentStep: currentStep }, callback);
        }
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
        var className = _props.className;
        var _state3 = this.state;
        var value = _state3.value;
        var range = _state3.range;
        var currentStep = _state3.currentStep;


        var offset = currentStep / range.maxStep * 100;
        var offsetStyle = { left: offset + '%' };

        return _react2.default.createElement(
          'div',
          { className: (0, _classnames2.default)("StepRangeSlider", className), onMouseDown: this.handleSnap },
          _react2.default.createElement('div', { className: 'StepRangeSlider__track' }),
          _react2.default.createElement(
            'div',
            { className: 'StepRangeSlider__handle',
              onTouchStart: this.handleTouchStart,
              onTouchMove: this.handleTouchMove,
              onTouchEnd: this.handleTouchEnd,
              onDragStart: this.handleDragStart,
              onDragEnd: this.handleDragEnd,
              onDrag: this.handleDrag,
              style: offsetStyle,
              draggable: true },
            _react2.default.createElement('div', {
              className: 'StepRangeSlider__thumb',
              'aria-valuemin': range.minValue,
              'aria-valuemax': range.maxValue,
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
    disabled: _react2.default.PropTypes.bool,
    onChange: _react2.default.PropTypes.func,
    onChangeComplete: _react2.default.PropTypes.func,
    range: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
      value: _react2.default.PropTypes.number.isRequired,
      step: _react2.default.PropTypes.number
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