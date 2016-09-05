import React from 'react'
import ReactDOM from 'react-dom'
import StepRangeSlider from '../../dist'

export default class Example extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: 5
    }
  }

  handleChange(value) {
    this.setState({ value })
  }

  render() {
    const range = [
      { value: 0, step: 1 }, // treated as min
      { value: 10, step: 5 }, 
      { value: 30, step: 10 },
      { value: 100, step: 50 },
      { value: 500 } // treated as max
    ]

    return (
      <div>
        <StepRangeSlider 
          className="ExampleSlider"
          range={range}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    )
  }

}