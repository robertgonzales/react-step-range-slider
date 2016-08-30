react-step-range-slider
=========

Use this component like a range input with dynamic steps. Fully responsive and supports touch.

## Install

`$ npm install react-step-range-slider --save`

## Example

![react-step-range-slider](https://cloud.githubusercontent.com/assets/7729885/17833926/e06462f6-66f9-11e6-8e88-c3dba1ee591e.gif)

Usage:

```jsx
import StepRangeSlider from 'react-step-range-slider'

const range = [
  { value: 0, step: 1 }, // acts as min value
  { value: 20, step: 5 }, 
  { value: 50, step: 10 },
  { value: 100, step: 50 },
  { value: 500 } // acts as max value
]

<StepRangeSlider 
  value={5} 
  range={range} 
  onChange={value => console.log(value)}
/>
```


## Props

#### `range` : `array`
Configures min and max values as well as the step for each value breakpoint. Required.

#### `value` : `number`
Determines the position of the drag handle. Should be divisible by the step at the appropriate value breakpoint.

#### `defaultValue` : `number`
Determines initial position of the drag handle.

#### `onChange` : `function`
Callback called on value change.

#### `onChangeComplete` : `function`
Callback called on drag end or on click.

#### `disabled` : `bool`
Prevent value change.

#### `className` : `string`
Provide your own class for the outer element.

#### `children` : `any`
Display whatever you want in the drag tooltip. Defaults to a tooltip.


## Methods

#### `stepDown()`
Decrements the step of the slider by the specified number.

#### `stepUp()`
Increments the step of the slider by the specified number.
