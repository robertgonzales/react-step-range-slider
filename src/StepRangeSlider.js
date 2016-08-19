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
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  setInitialState(props) {
    const breakpoints = configureBreakpoints(props.breakpoints)
    const value = breakpoints.ensureValue(props.value)
    const currentStep = breakpoints.getStepForValue(value)
    this.setState({ value, breakpoints, currentStep })
  }

  componentWillMount() {
    this.handleChange = _.throttle(this.handleChange, this.props.throttleChange)
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

  handleChange() {
    const { value } = this.state
    const { onChange } = this.props
    _.isFunction(onChange) && onChange(value)
  }

  handleClick(e) {
    this.sliderRect = e.currentTarget.getBoundingClientRect()
    this.handleDrag(e)
  }

  handleDragStart(e) {
    this.sliderRect = e.currentTarget.parentNode.getBoundingClientRect()
    e.dataTransfer.setDragImage(getEmptyImage(e), 0, 0) 
  }

  handleDragEnd(e) {
    const { value } = this.state
    const { onChange } = this.props
    _.isFunction(onChange) && onChange(value)
  }

  handleDrag(e) {
    if (!e.clientX) {
      return
    } 
    const { breakpoints } = this.state
    const { width, left, right } = this.sliderRect

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
    
    this.setState({ value, currentStep }, () => {
      this.handleChange()
    })
  }

  render() {  
    const { children } = this.props
    const { value, breakpoints, currentStep } = this.state
    const position = currentStep / breakpoints.maxStep
    const offsetStyle = { left: `${position * 100}%` }

    return (
      <div className="StepRangeSlider" onClick={this.handleClick}>
        <div className="StepRangeSlider__fill" />
        <div 
          className="StepRangeSlider__drag"
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd} 
          onDrag={this.handleDrag} 
          style={offsetStyle}
          draggable>
          <div className="StepRangeSlider__drag_handle" />
          <div className="StepRangeSlider__drag_tooltip">
            {this.state.value}
            {children}
          </div>
        </div>
      </div>
    )
  }

}


StepRangeSlider.displayName = "StepRangeSlider"

StepRangeSlider.propTypes = {
  children: React.PropTypes.any,
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  throttleChange: React.PropTypes.number.isRequired,
  breakpoints: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      breakpoint: React.PropTypes.number.isRequired,
      step: React.PropTypes.number,
    }).isRequired
  ).isRequired
}

StepRangeSlider.defaultProps = {
  value: 0,
  throttleChange: 100,
  breakpoints: [{ breakpoint: 0, step: 1}, { breakpoint: 100 }]
}