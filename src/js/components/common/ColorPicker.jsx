import React from 'react'
import { GithubPicker } from 'react-color'

// Wrap the component in <div className={'color-picker'}> colorpicker </div>
// import an array of 12 colours
class ColorPicker extends React.Component {
  state = {
    colors: [
      '#B80000',
      '#DB3E00',
      '#FCCB00',
      '#008B02',
      '#006B76',
      '#1273DE',
      '#004DCF',
      '#5300EB',
      '#EB9694',
      '#FAD0C3',
      '#FEF3BD'
    ]
  }

  render() {
    return (
      <GithubPicker
        colors={this.state.colors}
      />
    )
  }
}

export default ColorPicker
