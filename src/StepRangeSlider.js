import './StepRangeSlider.css'
import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { configureRange , getEmptyImage } from './slider-utils'


export default class StepRangeSlider extends React.Component {

  constructor(props) {
    super(props)
    this.setInitialState = this.setInitialState.bind(this)
    this.stepUp = this.stepUp.bind(this)
    this.stepDown = this.stepDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeComplete = this.handleChangeComplete.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleSnap = this.handleSnap.bind(this)
  }

  componentWillMount() {
    this.handleChange = _.throttle(this.handleChange, 100)
    this.setInitialState(this.props)
  }

  componentWillUnmount() {
    this.handleChange.cancel()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.range && nextProps.range !== this.props.range) {
      this.setInitialState(nextProps)
    }
  }

  setInitialState(props) {
    const range = configureRange(props.range)
    const value = range.ensureValue(props.value || props.defaultValue)
    const currentStep = range.getStepForValue(value)
    this.setState({ value, range, currentStep })
  }

  stepUp(amount) {
    const { range, currentStep } = this.state
    const nextStep = currentStep + amount
    if (nextStep <= range.maxStep) {
      const nextValue = range.getValueForStep(nextStep)
      this.setState({ currentStep: nextStep, value: nextValue })
    }
  }

  stepDown(amount) {
    const { range, currentStep } = this.state
    const nextStep = currentStep - amount
    if (nextStep >= range.minStep) {
      const nextValue = range.getValueForStep(nextStep)
      this.setState({ currentStep: nextStep, value: nextValue })
    }
  }

  handleChange(value) {
    const { onChange } = this.props
    _.isFunction(onChange) && onChange(value)
  }

  handleChangeComplete() {
    const { value } = this.state
    const { onChangeComplete } = this.props
    _.isFunction(onChangeComplete) && onChangeComplete(value)
  }

  handleTouchStart(e) {
    this.sliderRect = e.currentTarget.parentNode.getBoundingClientRect()
  }

  handleTouchEnd(e) {
    this.handleChangeComplete()
  }

  handleTouchMove(e) {
    e.preventDefault()  
    this.handleDrag(e.touches[0])
  }

  handleDragStart(e) {
    this.sliderRect = e.currentTarget.parentNode.getBoundingClientRect()
    e.dataTransfer.setDragImage(getEmptyImage(e), 0, 0) 
  }

  handleDragEnd(e) {
    this.handleChangeComplete()
  }

  handleDrag(e) {
    const { disabled } = this.props
    const { range } = this.state
    const { width, left, right } = this.sliderRect

    if (!e.clientX || disabled) return

    let position;
    if (e.clientX < left) {
      position = 0
    } else if (e.clientX > right) {
      position = right - left
    } else {
      position = e.clientX - left
    }
    const positionPercent = position / width
    const currentStep = Math.round(position / width * range.maxStep)
    const value = range.getValueForStep(currentStep)
    
    if (value !== this.state.value || currentStep !== this.state.currentStep) {
      this.setState({ value, currentStep })
      this.handleChange(value)
    }
  }

  handleSnap(e) {
    this.sliderRect = e.currentTarget.getBoundingClientRect()
    this.handleDrag(e)
    this.handleChangeComplete()
  }

  render() {  
    const { id, name, disabled, tooltip, children } = this.props
    const { value, range, currentStep } = this.state
    const offset = currentStep / range.maxStep * 100
    const offsetStyle = { left: `${offset}%` }

    return (
      <div className="StepRangeSlider" onMouseDown={this.handleSnap}>
        <div className="StepRangeSlider__track" />
        <div className="StepRangeSlider__handle"
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd} 
          onDrag={this.handleDrag} 
          style={offsetStyle}
          draggable>
          <div 
            className="StepRangeSlider__thumb"
            aria-valuemin={range.minValue}
            aria-valuemax={range.maxValue}
            aria-valuenow={value} 
            role="slider"
          />
          {_.isFunction(children) ? children(value) : children}
        </div>
        <input type="hidden" id={id} name={name} disabled={disabled} />
      </div>
    )
  }

}


StepRangeSlider.displayName = "StepRangeSlider"

StepRangeSlider.propTypes = {
  children: React.PropTypes.any,
  value: React.PropTypes.number,
  defaultValue: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onChangeComplete: React.PropTypes.func,
  range: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      value: React.PropTypes.number.isRequired,
      step: React.PropTypes.number,
    }).isRequired
  ).isRequired
}

StepRangeSlider.defaultProps = {
  defaultValue: 0,
  range: [{ value: 0, step: 1}, { value: 100 }],
  children: value => (
    <div className="StepRangeSlider__tooltip">{value}</div>
  )
}