import React, { Component } from 'react'

import RangeSlider from 'react-rangeslider'

/**
 * Include this component below a FormComponent input to control its value.
 * Supported input types are limited to scalar values.
 */
class InputValueSlider extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = { sliderValue: Number(props.value) }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ sliderValue: Number(newProps.value) })
  }

  handleChange = value => {
    this.setState({ sliderValue: value })
    console.log('changed slider value to: ' + value)

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value)
    }
  }

  render () {
    const { sliderValue } = this.state
    const { labels, formatValue, handleLabel, minValue, maxValue, stepIncrement } = this.props
    let handleLabelValue = handleLabel || sliderValue
    let stepValue = !isNaN(stepIncrement) ? stepIncrement : 1

    return (
      <div className='slider input-value-slider custom-labels'>
        <RangeSlider
          min={minValue}
          max={maxValue}
          step={stepValue}
          value={sliderValue}
          labels={labels}
          format={formatValue}
          handleLabel={handleLabelValue}
          onChange={this.handleChange}
        />
        {!!handleLabel && typeof formatValue === 'function' && (
          <div className='value'>{formatValue(sliderValue)}</div>
        )}
      </div>
    )
  }
}

export default InputValueSlider
