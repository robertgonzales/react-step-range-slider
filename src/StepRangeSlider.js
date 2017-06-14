import './StepRangeSlider.css'
import throttle from 'lodash/throttle'
import isFunction from 'lodash/isFunction'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import { configureRange } from './slider-utils'

export default class StepRangeSlider extends Component {
  componentWillMount() {
    this.handleChange = throttle(this.handleChange, 200)
    this.setInitialState(this.props)
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove)
    window.addEventListener('touchend', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount() {
    this.handleChange.cancel()
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('touchend', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.range && nextProps.range !== this.props.range) {
      this.setInitialState(nextProps)
    }
    if (
      nextProps.value !== this.props.value &&
      nextProps.value !== this.state.value
    ) {
      const value = this.state.range.ensureValue(nextProps.value)
      this.setState({ value })
    }
  }

  setInitialState = props => {
    const range = configureRange(props.range)
    const value = range.ensureValue(props.value || props.defaultValue)
    const currentStep = range.getStepForValue(value)
    this.setState({ value, range, currentStep })
  }

  stepUp = amount => {
    const { range, currentStep } = this.state
    const nextStep = currentStep + amount
    if (nextStep <= range.maxStep) {
      const nextValue = range.getValueForStep(nextStep)
      this.setState({ currentStep: nextStep, value: nextValue })
    }
  }

  stepDown = amount => {
    const { range, currentStep } = this.state
    const nextStep = currentStep - amount
    if (nextStep >= range.minStep) {
      const nextValue = range.getValueForStep(nextStep)
      this.setState({ currentStep: nextStep, value: nextValue })
    }
  }

  handleChange = () => {
    const { value } = this.state
    const { onChange } = this.props
    isFunction(onChange) && onChange(value)
  }

  handleChangeComplete = () => {
    const { value } = this.state
    const { onChangeComplete } = this.props
    isFunction(onChangeComplete) && onChangeComplete(value)
  }

  handleMouseUp = e => {
    if (this.state.pressed) {
      this.setState({ pressed: false })
      this.handleChangeComplete()
    }
  }

  handleMouseMove = e => {
    if (this.state.pressed) {
      this.handleMove(e)
    }
  }

  handleMouseDown = e => {
    e.preventDefault()
    this.handlePress()
    this.handleMove(e)
  }

  handleTouchMove = e => {
    if (this.state.pressed) {
      e.preventDefault()
      this.handleMouseMove(e.touches[0])
    }
  }

  handleTouchStart = e => {
    this.handlePress()
    this.handleMove(e.touches[0])
  }

  handlePress = () => {
    this.sliderRect = this.slider.getBoundingClientRect()
    this.setState({ pressed: true })
  }

  handleMove = e => {
    const { clientX } = e
    const { disabled } = this.props
    const { range } = this.state
    const { width, left, right } = this.sliderRect

    if (!clientX || disabled) return

    let position
    if (clientX < left) {
      position = 0
    } else if (clientX > right) {
      position = right - left
    } else {
      position = clientX - left
    }
    const currentStep = Math.round(position / width * range.maxStep)
    const value = range.getValueForStep(currentStep)

    if (value !== this.state.value || currentStep !== this.state.currentStep) {
      this.setState({ value, currentStep }, this.handleChange)
    }
  }

  render() {
    const { id, name, disabled, tooltip, children, className } = this.props
    const { value, range, currentStep } = this.state

    const offset = currentStep / range.maxStep * 100
    const offsetStyle = { left: `${offset}%` }

    return (
      <div
        className={classnames('StepRangeSlider', className)}
        onMouseDown={this.handleMouseDown}
        ref={node => (this.slider = node)}>
        <div className="StepRangeSlider__track" />
        <div
          className="StepRangeSlider__handle"
          onTouchStart={this.handleTouchStart}
          onMouseDown={this.handleMouseDown}
          style={offsetStyle}>
          <div
            className="StepRangeSlider__thumb"
            aria-valuemin={range.minValue}
            aria-valuemax={range.maxValue}
            aria-valuenow={value}
            role="slider"
          />
          {isFunction(children) ? children(value) : children}
        </div>
        <input type="hidden" id={id} name={name} disabled={disabled} />
      </div>
    )
  }
}

StepRangeSlider.displayName = 'StepRangeSlider'

StepRangeSlider.propTypes = {
  children: PropTypes.any,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeComplete: PropTypes.func,
  range: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      step: PropTypes.number,
    }).isRequired
  ).isRequired,
}

StepRangeSlider.defaultProps = {
  defaultValue: 0,
  range: [{ value: 0, step: 1 }, { value: 100 }],
  children: value => <div className="StepRangeSlider__tooltip">{value}</div>,
}
