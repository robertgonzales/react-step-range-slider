import './StepRangeSlider.css'
import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { configureBreakpoints , getEmptyImage } from './slider-utils'


export default class StepRangeSlider extends React.Component {

  constructor(props) {
    super(props)
    this.setInitialState = this.setInitialState.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  setInitialState(props) {
    const breakpoints = configureBreakpoints(props.breakpoints)
    const value = breakpoints.ensureValue(props.value || props.defaultValue)
    const currentStep = breakpoints.getStepForValue(value)
    this.setState({ value, breakpoints, currentStep })
  }

  componentWillMount() {
    this.handleChange = _.throttle(this.handleChange, 100)
    this.setInitialState(this.props)
  }

  componentWillUnmount() {
    this.handleChange.cancel()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.breakpoints && nextProps.breakpoints !== this.props.breakpoints) {
      this.setInitialState(nextProps)
    }
  }

  stepUp(amount) {
    const { breakpoints, currentStep } = this.state
    const nextStep = currentStep + amount
    if (nextStep <= breakpoints.maxStep) {
      this.setState({ currentStep: nextStep })
    }
  }

  stepDown(amount) {
    const { breakpoints, currentStep } = this.state
    const nextStep = currentStep - amount
    if (nextStep >= breakpoints.minStep) {
      this.setState({ currentStep: nextStep })
    }
  }

  handleChange(value) {
    const { onChange } = this.props
    _.isFunction(onChange) && onChange(value)
  }

  handleDragStart(e) {
    this.sliderRect = e.currentTarget.parentNode.getBoundingClientRect()
    e.dataTransfer.setDragImage(getEmptyImage(e), 0, 0) 
  }

  handleDrag(e) {
    const { disabled } = this.props
    const { breakpoints } = this.state
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
    const currentStep = Math.round(position / width * breakpoints.maxStep)
    const value = breakpoints.getValueForStep(currentStep)
    
    this.setState({ value, currentStep })
    this.handleChange(value)
  }

  handleDragEnd(e) {
    const { value } = this.state
    const { onChangeComplete } = this.props
    _.isFunction(onChangeComplete) && onChangeComplete(value)
  }

  handleClick(e) {
    const { value } = this.state
    const { onChangeComplete } = this.props
    this.sliderRect = e.currentTarget.getBoundingClientRect()
    this.handleDrag(e)
    _.isFunction(onChangeComplete) && onChangeComplete(value)
  }

  render() {  
    const { id, name, disabled, tooltip, children } = this.props
    const { value, breakpoints, currentStep } = this.state
    const offset = currentStep / breakpoints.maxStep * 100
    const offsetStyle = { left: `${offset}%` }

    return (
      <div className="StepRangeSlider" onClick={this.handleClick}>
        <div className="StepRangeSlider__track" />
        <div className="StepRangeSlider__handle"
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd} 
          onDrag={this.handleDrag} 
          style={offsetStyle}
          draggable>
          <div 
            className="StepRangeSlider__thumb"
            aria-valuemin={breakpoints.minValue}
            aria-valuemax={breakpoints.maxValue}
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
  onChange: React.PropTypes.func,
  onChangeComplete: React.PropTypes.func,
  breakpoints: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      breakpoint: React.PropTypes.number.isRequired,
      step: React.PropTypes.number,
    }).isRequired
  ).isRequired
}

StepRangeSlider.defaultProps = {
  defaultValue: 0,
  breakpoints: [{ breakpoint: 0, step: 1}, { breakpoint: 100 }],
  children: value => (
    <div className="StepRangeSlider__tooltip">{value}</div>
  )
}