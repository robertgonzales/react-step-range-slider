import '../styles/styles.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import StepRangeSlider from '../../dist'

const breakpoints = [
  { breakpoint: 0, step: 1 }, // treated as min
  { breakpoint: 10, step: 5 }, 
  { breakpoint: 30, step: 10 },
  { breakpoint: 100, step: 50 },
  { breakpoint: 500 } // treated as max
]

ReactDOM.render(
  <StepRangeSlider 
    value={70} 
    breakpoints={breakpoints} 
    onChange={value => console.log(value)}
  />,
  document.getElementById('app')
)