import './StepRangeSlider.css'
import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
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
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleSnap = this.handleSnap.bind(this)
    this.handleMove = this.handleMove.bind(this)
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
    if (nextProps.value !== this.props.value && 
        nextProps.value !== this.state.value) {
      const value = this.state.range.ensureValue(nextProps.value)
      this.setState({ value })
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

  handleChange() {
    const { value } = this.state
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

  handleDrag(e) {
    this.handleMove(e.clientX, () => {
      this.handleChange()
    })
  }

  handleDragEnd(e) {
    this.handleChangeComplete()
  }

  handleSnap(e) {
    this.sliderRect = e.currentTarget.getBoundingClientRect()
    this.handleMove(e.clientX, () => {
      this.handleChange()
      this.handleChangeComplete()
    })
  }

  handleMove(clientX, callback) {
    const { disabled } = this.props
    const { range } = this.state
    const { width, left, right } = this.sliderRect

    if (!clientX || disabled) return

    let position;
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
      this.setState({ value, currentStep }, callback)
    }   
  }

  render() {  
    const { id, name, disabled, tooltip, children, className } = this.props
    const { value, range, currentStep } = this.state

    const offset = currentStep / range.maxStep * 100
    const offsetStyle = { left: `${offset}%` }

    return (
      <div className={classnames("StepRangeSlider", className)} onMouseDown={this.handleSnap}>
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