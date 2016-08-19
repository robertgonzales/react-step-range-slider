react-step-range-slider
=========

Use this component like a range input. Supports dynamic steps with breakpoints. Fully responsive.

## Example

![step-slider-slider](https://cloud.githubusercontent.com/assets/7729885/17811378/68bd0140-65f0-11e6-9475-c9dc6fd457ed.gif)

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
  value={70} 
  breakpoints={breakpoints} 
  onChange={value => console.log(value)}
/>
```

Generates the following html:

```html
<div class="StepRangeSlider">
  <div class="StepRangeSlider__fill"></div>
  <div class="StepRangeSlider__drag" style="left:62%" draggable="true">
    <div class="StepRangeSlider__drag_handle"></div>
    <div class="StepRangeSlider__drag_tooltip">70</div>
  </div>
</div>
```


## Props

#### `breakpoints` : `Array`
Configures the step for each breakpoint as well as the min and max step/values. Required.

#### `value` : `Number`
Determines the position of the drag handle. Should be divisble by the step value at the appropriate breakpoint. Required.

#### `onChange` : `Function`
Callback called on value change. Required.

#### `throttleChange` : `Number`
Rate at which to throttle onChange event. Defaults to 100ms. Required.

#### `children` : `Any`
Display whatever you want in the drag tooltip.
