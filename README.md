react-step-range-slider
=========

Use this component like a range input. Supports dynamic steps with breakpoints. Fully responsive.


## Example

![react-step-range-slider](https://cloud.githubusercontent.com/assets/7729885/17827653/c1311dd0-664e-11e6-9a36-fee276eeb188.gif)

Usage:

```jsx
const breakpoints = [
  { breakpoint: 0, step: 1 }, // acts as min value
  { breakpoint: 20, step: 5 }, 
  { breakpoint: 50, step: 10 },
  { breakpoint: 100, step: 50 },
  { breakpoint: 500 } // acts as max value
]

<StepRangeSlider 
  value={30} 
  breakpoints={breakpoints} 
  onChange={value => console.log(value)}
/>
```


## Props

#### `breakpoints` : `array`
Configures the step for each breakpoint as well as the min and max step/values. Required.

#### `value` : `number`
Determines the position of the drag handle. Should be divisible by the step value at the appropriate breakpoint.

#### `defaultValue` : `number`
Determines initial position of the drag handle.

#### `onChange` : `function`
Callback called on value change.

#### `onChangeComplete` : `function`
Callback called onDragEnd or onClick.

#### `disabled` : `bool`
Prevent value change.

#### `children` : `any`
Display whatever you want in the drag tooltip.


## Methods

#### `stepDown()` : `number`
Decrements the value of the slider control by a specified number.

#### `stepUp()` : `number`
Increments the value of the slider control by a specified number.
