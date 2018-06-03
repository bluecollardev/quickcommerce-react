import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import validator from 'validator'

import FormHelper from '../helpers/Form.js'

function undoable(reducer) {
  // Call the reducer with an empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  }

  // Return a reducer that handles undo and redo
  return function (state = initialState, action) {
    const { past, present, future } = state

    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)

        return {
          past: newPast,
          present: previous,
          future: [
            present,
            ...future
          ]
        }

        break
      case 'REDO':
        const next = future[0]
        const newFuture = future.slice(1)

        return {
          past: [
            ...past,
            present
          ],
          present: next,
          future: newFuture
        }

        break
      default:
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state
        }

        return {
          past: [
            ...past,
            present
          ],
          present: newPresent,
          future: []
        }

        break
    }
  }
}

const defaultState = {
  history: {
    past: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    present: 9,
    future: [10]
  }
}

const history = (defaultState, action) => {
  switch (action.type) {
    case 'UNDO':
      return { value: state.value + 1 }
    case 'REDO':
      return { value: state.value - 1 }
    case 'FREEZE':
      return
    case 'THAW':
      return
    default:
      return state
  }

}

/**
 * This HoC is quickcommerce-react way of enriching React forms.
 * - 2-way binds form data from inputs in a FormComponent wrapped form to their respective Dtos.
 * - Provides helper methods for accessing using primitive or typed form data using mapped properties.
 * - Provides a getField method which registers and adds a field and it's initial value to FormComponent's 'fields' registry.
 *   getField returns a JSX string that can be used to bind any input, select, checkbox, radio or textarea field (etc.) to
 *   FormComponent for simplified form manipulation. TODO: Detail what...
 * - Provides a simple getForm method which returns the content of the wrapped form and any linked FormComponent sub-forms.
 * - Provides a
 *
 *   This component needs to be unit tested like a mofo!
 *
 *
 *
 */
export default (ComposedComponent) => {
  return class FormComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        fields: {},
        isSubmitting: false,
        isValid: true
      }

      this.dispatch = this.dispatch.bind(this)
      this.freezeState = this.freezeState.bind(this)
      this.thawState = this.thawState.bind(this)
      this.findInput = this.findInput.bind(this)
      this.getFieldValue = this.getFieldValue.bind(this)
      this.getField = this.getField.bind(this)
      this.setField = this.setField.bind(this)
      this.onFieldChange = this.onFieldChange.bind(this)
      this.resetForm = this.resetForm.bind(this)
      this.getForm = this.getForm.bind(this)
      this.triggerAction = this.triggerAction.bind(this)
      this.validate = this.validate.bind(this)
      this.validateForm = this.validateForm.bind(this)
      this.setErrorsOnFields = this.setErrorsOnFields.bind(this)
      this.renderErrors = this.renderErrors.bind(this)
    }

    /**
     * Convenience method.
     * @param path
     * @param data
     * @returns {*}
     */
    static getMappedValue(mapping, data, resolve) {
      return FormHelper.getMappedValue(mapping, data, resolve)
    }

    /**
     * Convenience method.
     * @param path
     * @param data
     */
    static getObjectPath(path, data) {
      return FormHelper.getObjectPath(path, data)
    }

    /**
     * We don't need redux but dropping in a simple dispatch mechanism
     * will allow us to make/undo state changes in a sane manner.
     */
    dispatch(action) {
      this.setState({}) // Manage state of subforms
    }

    /**
     * Freeze data, persisting it to localStorage.
     */
    freezeState() {

    }

    /**
     * Thaw frozen data from localStorage, and hydrate the form(s).
     */
    thawState() {

    }

    /**
     * Forcefully flushes out any stale state artifacts when the form receives new props.
     */
    componentWillReceiveProps() {
      this.setState({ fields: {} })
    }

    getFieldValue(fieldName) {
      if (!(typeof fieldName === 'string') || !(fieldName.length > 0)) {
        return
      }

      if (typeof this.state.fields[fieldName] === 'undefined') {
        return
      }

      // Auto-resolve
      // TODO: This is incomplete, resolve using true types
      const storedValue = this.state.fields[fieldName].value
      let fieldValue = null

      switch (typeof storedValue) {
        case 'undefined':
          break
        case 'object':
          // TODO: null check and type check
          if (!(storedValue === null)) {
            // TODO: This is a stupid way now that we have DTOs
            // It'll do for a proof-of-concept though...
            // Is it a code type?
            if (storedValue.hasOwnProperty('code')) {
              // Just use the name for now
              fieldValue = storedValue.name
            }

            // TODO: Again, use the correct type
            if (storedValue.hasOwnProperty('year')) {
              fieldValue = storedValue.value
            }
          }

          break
        case 'string':
          fieldValue = storedValue
          break
        case 'number':
          fieldValue = storedValue
          break
        case 'boolean':
          fieldValue = storedValue
          break
      }

      return fieldValue
    }

    /**
     * Registers and adds a field and it's initial value to this component's 'fields' registry.
     * Returns a set of props used to initialize the input field that calls this method.
     */
    getField(fieldName, defaultValue, validations) {
      defaultValue = defaultValue || '' // TODO: Handle types other than string
      let field = this.state.fields[fieldName] || null
      let isValid = null

      if (field === null || typeof event === 'undefined') {
        // If we're initializing a new field
        this.state.fields[fieldName] = {
          name: fieldName,
          value: defaultValue,
          onChange: (event) => {
            this.onFieldChange(event, fieldName)
          },
          validations: validations
        }
      } else if (field !== null && fieldName === event.target.name) {
        // If we're udpating or clearing a field
        this.state.fields[fieldName] = {
          name: fieldName,
          value: event.target.value,
          onChange: (event) => {
            //console.log('setting FormComponent field value to "' + event.target.value + '"')
            this.onFieldChange(event, fieldName)
          },
          validations: validations
        }
      }

      // Auto-resolve
      // TODO: This is incomplete, resolve using true types
      let fieldValue = this.getFieldValue(fieldName)

      // These props are injected into the JSX element
      return {
        name: fieldName,
        value: fieldValue,
        onChange: this.state.fields[fieldName].onChange
      }
    }

    /**
     * ReactDOM.findDOMNode isn't working in newer versions of React, and they're deprecating it ffs...
     * This method was mostly used to bind and render validations for inputs. I'll have to figure out a new way to do it.
     * @deprecated
     * @param fieldName
     * @returns {Element | any}
     */
    findInput(fieldName) {
      const component = this.component.hasOwnProperty('wrappedInstance') ? this.component.wrappedInstance : this.component
      const node = ReactDOM.findDOMNode(component)
      const input = node.querySelector('[name="' + fieldName + '"]')

      return input
    }

    /**
     *
     * @param fieldName
     * @param value
     * @param validations
     * @returns {{name: *, value: *}}
     */
    setField(fieldName, value, validations) {
      value = (typeof value !== 'undefined') ? value : '' // TODO: Should I really default to an empty string?
      let field = this.state.fields[fieldName] || null
      let isValid = false

      // TODO: Sanitize string value!
      if (field !== null) {
        this.state.fields[fieldName] = {
          name: fieldName,
          value: value, //required: false,
          onChange: (event) => {
            this.onFieldChange(event, fieldName)
          },
          validations: validations
        }
      } else {
        // If the field doesn't exist create it
        this.getField(fieldName, value)
      }

      isValid = this.validate(fieldName, this.state.fields[fieldName].value)

      // Grab wrapping formgroup and set success/error status
      let validationState = (isValid === true) ? 'success' : 'error'
      // TODO: This type of validation no longer seems to work with newer versions (16.2+) of React
      // Sounds like it's deprecated going to have to find another solution
      //this.findInput(fieldName).closest('.form-group').setAttribute('validationState', validationState)

      // Auto-resolve
      // TODO: This is incomplete, resolve using true types
      let fieldValue = this.getFieldValue(fieldName)
      
      return {
        name: fieldName,
        value: fieldValue
      }
    }

    onFieldChange(event, fieldName) {
      //console.log('setting FormComponent field value to "' + event.target.value + '"')
      this.state.fields[fieldName].value = event.target.value
      this.forceUpdate()

      // Validate the input when we attach it to the form so the form maintains the correct state?
      // I'm thinking maybe not...
      //this.validate(fieldName, this.state.fields[fieldName].value)
      isValid = this.validate(fieldName, this.state.fields[fieldName].value)
      console.log(fieldName + ' is valid? ' + isValid)

      // Grab wrapping formgroup and set success/error status
      let validationState = (isValid === true) ? 'has-success' : 'has-error'

      // TODO: This type of validation no longer seems to work with newer versions (16.2+) of React
      // Sounds like it's deprecated going to have to find another solution
      //let group = this.findInput(fieldName).closest('.form-group')

      // Clear any existing statuses
      //group.classList.remove('has-success')
      //group.classList.remove('has-error')

      // Set validation status
      //group.classList.add(validationState)
    }

    /**
     * TODO: We need to be able to reset the form using a configuration object or something (defaults)...
     * Clears the form. This method is passed to the wrapped component instance via props.
     */
    resetForm() {
      for (let name in this.state.fields) {
        this.state.fields[name].value = null
      }

      this.forceUpdate() // TODO: Temporary hack to re-render
    }

    getForm(convertToEntities) {
      // Normalize fields
      let formData = {}

      for (let name in this.state.fields) {
        formData[name] = this.state.fields[name].value
      }

      if (!Object.keys(formData).length > 0) return null

      if (convertToEntities && this.props.hasOwnProperty('entityType')) {
        // Duck-type
        if (this.props.entityType.hasOwnProperty('constructFromObject')) {
          formData = this.props.entityType.constructFromObject(formData)
        }
      }

      return formData
    }

    /**
     * TODO: I belong in a to-be-implemented 'IFormComponentWrapper' (for lack of a better name right now) interface.
     * TODO: Type check - we don't want to be calling getForm on a sub-form component that isn't a FormComponent.
     * There's no guarantee that markup in an inheriting component will contain the same references / subs.
     * @param subformComponent
     * @returns {{}}
     */
    getSubform(subformComponent, convertToEntities) {
      // TODO: Accept a callback!?
      // 1) Just call, getForm should NEVER accept any parameters!
      // 2) Don't use call or apply, there's no need to override 'this'
      // 3) Return an empty object, this method shouldn't try to break stuff
      let subformData = {}

      if (subformComponent instanceof FormComponent) {
        subformData = subformComponent.component.wrappedInstance.getForm(convertToEntities)
      }

      return subformData
    }

    /**
     *
     * @param callback
     * @returns {*}
     */
    triggerAction(callback, convertToEntities) {
      return callback(this.getForm(convertToEntities))
    }

    validateForm() {
      // We set allIsValid to true and flip it if we find any
      // invalid input components
      let allIsValid = true

      // If no validations property, do not validate
      if (!this.state.fields) {
        return
      }

      // Now we run through the fields registered and flip our state
      // if we find an invalid input component
      let fields = this.state.fields

      Object.keys(fields).forEach(function (name) {
        if (!fields[name].state.isValid) {
          allIsValid = false
        }
      })

      // And last, but not least, we set the valid state of the
      // form itself
      this.setState({isValid: allIsValid})
    }

    /**
     * The validate method grabs what it needs from the component,
     * validates the component and then validates the form.
     * @param fieldName
     * @param value
     * @param onSuccess
     * @param onError
     * @returns {boolean}
     */
    validate(fieldName, value, onSuccess, onError) {
      // If no validations property, do not validate
      if (!this.state.fields) {
        return
      }

      // We initially set isValid to true and then flip it if we
      // run a validator that invalidates the input
      let isValid = true

      let field = this.state.fields[fieldName]

      // We only validate if the input has value or if it is required
      if ((value || field.required) && typeof field.validations === 'string') {
        // We split on comma to iterate the list of validation rules
        field.validations.split(',').forEach((validation) => {

          // By splitting on ":"" we get an array of arguments that we pass
          // to the validator. ex.: isLength:5 -> ['isLength', '5']
          let args = validation.split(':')

          // We remove the top item and are left with the method to
          // call the validator with ['isLength', '5'] -> 'isLength'
          let validateMethod = args.shift()

          // We use JSON.parse to convert the string values passed to the
          // correct type. Ex. 'isLength:1' will make '1' actually a number
          args = args.map((arg) => {
            return JSON.parse(arg)
          })

          // We then merge two arrays, ending up with the value
          // to pass first, then options, if any. ['valueFromInput', 5]
          args = [value].concat(args)

          // So the next line of code is actually:
          // validator.isLength('valueFromInput', 5)
          if (!validator[validateMethod].apply(validator, args)) {
            isValid = false
          }
        })
      }

      return isValid
    }

    /**
     *
     * @param errors
     */
    setErrorsOnFields(errors) {
      // We go through the errors
      Object.keys(errors).forEach((fieldName, index) => {
        // We grab the component by using the key from errors
        let component = this.fields[fieldName]

        // TODO: Refactor and re-attach
        // We change the state
        /*component.setState({
         isValid: false,
         serverError: errors[name] // We use a new state here to indicate a server error
         })

         // And after changing the state of the form,
         // we validate it
         this.setState({
         isSubmitting: false
         }, this.validateForm)*/
      })
    }

    renderErrors() {
      let errors = []
      let count = Object.keys(this.state.errors).length
      let idx = 1

      if (typeof this.state.errors !== 'string' && count > 0) {
        for (let error in this.state.errors) {
          errors.push(<strong>{this.state.errors[error]}</strong>)
          if (idx < count) {
            errors.push(<br/>)
          }

          idx++
        }
      } else if (typeof this.state.errors === 'string') {
        errors.push(<strong>{this.state.errors}</strong>)
      }

      return errors
    }

    render() {
      let props = Object.assign({}, this.props, {
        fields: this.getField.bind(this),
        field: this.setField.bind(this),
        value: this.getFieldValue.bind(this)
      })

      return (
        <ComposedComponent
          {...props}
          ref={(component) => this.component = component}
          getForm={this.getForm}
          getSubform={this.getSubform}
          resetForm={this.resetForm}
          triggerAction={this.triggerAction}
          renderErrors={this.renderErrors}
          validate={this.validate}
          getMappedValue={FormComponent.getMappedValue}
          getObjectPath={FormComponent.getObjectPath}
          renderErrors={this.renderErrors}
        />
      )
    }
  }
}
