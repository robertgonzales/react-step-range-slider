import '../styles/styles.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import StepRangeSlider from '../../dist'

const range = [
  { value: 0, step: 1 }, // treated as min
  { value: 10, step: 5 }, 
  { value: 30, step: 10 },
  { value: 100, step: 50 },
  { value: 500 } // treated as max
]

ReactDOM.render(
  <StepRangeSlider 
    value={5}
    range={range}
    onChange={value => console.log(value)}
  />,
  document.getElementById('app')
)