// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import CSSClassnames from '../../utils/CSSClassnames'
import Button from './Button'

const CLASS_ROOT = CSSClassnames.NUMBER_INPUT
const INPUT = CSSClassnames.INPUT

export default class NumberInput extends Component {

  constructor(props, context) {
    super(props, context);

    this.onAdd = this.onAdd.bind(this);
    this.onSubtract = this.onSubtract.bind(this);
  }

  fireChange () {
    let event;
    try {
      event = new Event('change', {
        'bubbles': true,
        'cancelable': true
      });
    } catch (e) {
      // IE11 workaround.
      event = document.createEvent('Event');
      event.initEvent('change', true, true);
    }
    // We use dispatchEvent to have the browser fill out the event fully.
    this.inputRef.dispatchEvent(event);
    // Manually dispatched events aren't delivered by React, so we notify too.
    this.props.onChange(event);
  }

  onAdd () {
    const { max, step } = this.props;
    const input = this.inputRef;
    try {
      input.stepUp();
    } catch (e) {
      // IE11 workaround. See known issue #5 at
      // http://caniuse.com/#search=number
      let value = (parseFloat(input.value) || 0) + (step || 1);
      if (max !== undefined) {
        value = Math.min(value, max);
      }
      input.value = value;
    }
    this.fireChange();
  }

  onSubtract () {
    const { min, step } = this.props;
    const input = this.inputRef;
    try {
      input.stepDown();
    } catch (e) {
      // IE11 workaround. See known issue #5 at
      // http://caniuse.com/#search=number
      let value = (parseFloat(input.value) || 0) - (step || 1);
      if (min !== undefined) {
        value = Math.max(value, min);
      }
      input.value = value;
    }
    this.fireChange();
  }

  render () {
    const { className, disabled, ...props } = this.props;

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--disabled`]: disabled
      },
      className
    );

    const onSubtract = (! disabled ? this.onSubtract : undefined);
    const onAdd = (! disabled ? this.onAdd : undefined);

    return (
      <span className={classes}>
        <input ref={ref => this.inputRef = ref} {...props}
          className={`${INPUT} ${CLASS_ROOT}__input`}
          type="number" tabIndex="0"
          disabled={disabled} />

        <Button icon={<SubtractIcon />}
          className={`${CLASS_ROOT}__subtract`} onClick={onSubtract} />

        <Button icon={<AddIcon />}
          className={`${CLASS_ROOT}__add`} onClick={onAdd} />
      </span>
    );
  }

}

NumberInput.propTypes = {
  defaultValue: PropTypes.number,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};