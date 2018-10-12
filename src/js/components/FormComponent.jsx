import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import validator from 'validator'

import JSONHelper from '../helpers/JSON.js'
import FormHelper from '../helpers/Form.js'
import DateHelper from '../helpers/Date.js'
import PropsHelper from '../helpers/Props.js'

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
 *
 * More documentation to come...
 */
export default (ComposedComponent) => {
  return class FormComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        initialized: false,
        fields: {},
        isSubmitting: false,
        isValid: true
      }

      this.subscribers = []

      this.dispatch = this.dispatch.bind(this)
      this.freezeState = this.freezeState.bind(this)
      this.thawState = this.thawState.bind(this)
      // findInput is/was only used for legacy validation
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

    subscribe(subscriber) {
      this.subscribers.push(subscriber)

      return () => {
        this.subscribers = this.subscribers.filter((s) => {
          return s !== subscriber
        })
      }
    }

    getSubscribers() {
      return this.subscribers
    }

    notifySubscribers() {
      console.log('Warning! FormComponent.notifySubscribers is a temporary update mechanism for parent components!')
      this.subscribers.forEach((callback) => {
        return callback(this.state.fields)
      })
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
     * Forcefully flushes out any stale state artifacts
     * when the form receives new props.
     */
    componentWillReceiveProps(newProps) {
      //console.log('FormComponent debug mode disabled')
      //PropsHelper.compare(this.props, newProps)
      //console.log('data: ', this.props.data)

      // TODO: I am verifying this, but don't reset!
      //this.setState({ fields: {} })
    }

    componentDidMount() {
      //console.log('WHOO! FormComponent rendered')
    }

    /**
     * ReactDOM.findDOMNode isn't working in newer versions of React (for our use caes).
     * This method was mostly used to bind and render validations for inputs.
     * I'll have to figure out a new way to do it.
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
     * TODO: Make me f***ing configurable with custom types already!!!
     * TODO: Custom f***ing types need custom configurable resolvers!
     * If a Swagger model is provided as the type argument,
     * we can leverage its constructFromObject method
     * @param fieldName
     * @param type Swagger model
     * @returns {*}
     */
    getFieldValue(fieldName, type) {
      type = type || null

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
            // TODO: Use command pattern to create field type parsers
            // That way we can keep this implementation generic

            if (storedValue.hasOwnProperty('code')) {
              // Just use the name for now
              fieldValue = storedValue.name
            } else if (storedValue.hasOwnProperty('year')) {
              // TODO: Again, use the correct type
              fieldValue = storedValue.value
            } else if (storedValue.hasOwnProperty('currency')) {
              // TODO: Again, use the correct type
              fieldValue = storedValue.value
            } else if (storedValue.hasOwnProperty('rgbHex')) {
              // TODO: Again, use the correct type
              fieldValue = storedValue.name
            } else if (storedValue.hasOwnProperty('e164')) {
              // TODO: Again, use the correct type
              fieldValue = storedValue.e164
            } else if (storedValue.hasOwnProperty('name')) {
              fieldValue = storedValue.name
            }

            // TODO: Use command pattern to create field type parsers
            // That way we can keep this implementation generic
            /*let model = null
             // TODO: Use flow interfaces
             if (type !== null && type.hasOwnProperty('constructFromObject')) {
             model = type.constructFromObject(storedValue)
             if (model.hasOwnProperty('year') && model.hasOwnProperty('zone')) {
             let dateTimeString = model.value.substring(0, model.value.indexOf('.'))
             let zonedDateTime = DateHelper.createDateFromString(dateTimeString)
             console.log('getting field value for zoned datetime:')
             //console.log(storedValue)
             //console.log(model)
             //console.log(zonedDateTime.toISOString())onSelectFieldChange
             fieldValue = zonedDateTime.toISOString()
             }
             }*/
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
    getField(fieldName, fieldValue, type, events, validations) {
      events = events || {
        onChange: null,
        onSelect: null
      }

      let field = this.state.fields[fieldName] || null
      let isValid = null

      let storeValue = fieldValue || ''
      // Note: event doesn't need to be declared as it will exist
      // due to event bubbling from the onChange event passed to the
      // input element or component via props
      if (field !== null) {
        if (typeof event !== 'undefined') {
          // If we have just udpated or cleared a field, its event
          // will bubble up and we can grab the form input's value
          if (fieldName === event.target.name) {
            //storeValue = event.target.value
            // NOTE: This chunk of code is duplicated on purpose - we need to save the input value & trigger the callback
            let targetElement = event.target
            // Detect the type of input that triggered the event
            switch (targetElement.tagName) {
              // TODO: use constants!

              case 'SELECT':
                // TODO: Doesn't support multiple selections yet
                this.forEachSelectedOption(targetElement, (element, option, attributes, value) => {
                  storeValue = value
                })

                break
              case 'INPUT':
                if (targetElement.type.toLowerCase() === 'number') {
                  if (typeof targetElement.step === 'string' &&
                    targetElement.step === '0.01') {
                    // We're most likely dealing with a currency object
                    // TODO: Multiple currency support
                    storeValue = {
                      value: Number(targetElement.value),
                      currency: 'CAD' // Pass in as special attribute
                    }
                  } else {
                    // Standard numeric input
                    storeValue = Number(targetElement.value)
                  }
                } else {
                  // Treat as text input
                  storeValue = targetElement.value
                }

                break

              default:
                storeValue = targetElement.value

                break
            }
          }
        } else {
          // No event to grab input data from, this is likely a props update
          // Use the stored field value
          storeValue = this.getFieldValue(fieldName, type)
        }
      }

      if (field === null) {
        /*let msg = '' +
         'initializing [' + fieldName + '] ' +
         'with default value of [' + JSON.stringify(fieldValue) + ']'

         console.log(msg)*/
      }

      this.createOrUpdateFieldState(fieldName, storeValue, events, validations)

      if (typeof event !== 'undefined') {
        if (fieldName === event.target.name) {
          // TODO: This is a temporary mechanism to notify subscribers (parent components) of changes
          this.notifySubscribers()
        }
      }

      // Be safe grab the value using our getter
      fieldValue = this.getFieldValue(fieldName, type)
      // These props are injected into the JSX element
      return {
        name: fieldName,
        value: fieldValue,
        onChange: this.state.fields[fieldName].onChange
      }
    }

    /**
     *
     * @param fieldName
     * @param value
     * @param validations
     * @returns {{name: *, value: *}}
     */
    setField(fieldName, value, events, validations) {
      events = events || {
        onChange: null,
        onSelect: null
      }

      value = (typeof value !== 'undefined') ? value : '' // TODO: Should I really default to an empty string?
      let field = this.state.fields[fieldName] || null
      let isValid = false

      // TODO: Sanitize string value!
      if (field !== null) {
        this.createOrUpdateFieldState(fieldName, value, events, validations)

        this.notifySubscribers()
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

      // TODO: This is incomplete, resolve using true types
      // Be safe grab the value using our getter
      let fieldValue = this.getFieldValue(fieldName)
      // These props are injected into the JSX element
      return {
        name: fieldName,
        value: fieldValue
      }

    }

    createOrUpdateFieldState(fieldName, value, events, validations) {
      this.state.fields[fieldName] = {
        name: fieldName,
        value: value,
        //required: false,
        onChange: (event) => {
          this.onFieldChange(event, fieldName, events.onChange)
        },
        validations: validations
      }
    }

    onFieldChange(event, fieldName, callback) {
      //console.log('setting FormComponent field value to "' + event.target.value + '"')
      // NOTE: This chunk of code is duplicated on purpose - we need to save the input value & trigger the callback
      // TODO: If it's possible, kill the value-setting here... I may be able to set it above, in setField
      let targetElement = event.target
      // Detect the type of input that triggered the event
      switch (targetElement.tagName) {
        // TODO: use constants!
        case 'SELECT':
          this.onSelectFieldChange(targetElement, fieldName)
          break
        case 'INPUT':
          this.onInputFieldChange(targetElement, fieldName)
          break
        default:
          this.state.fields[fieldName].value = targetElement.value
          break
      }

      if (typeof callback === 'function') {
        callback(event, this.state.fields[fieldName].value)
      }

      this.validateState(fieldName)

      this.forceUpdate()
    }

    forEachSelectedOption(targetElement, callback) {
      if (targetElement.selectedOptions instanceof HTMLCollection &&
        targetElement.selectedOptions.length > 0) {
        // TODO: No way to handle multiple selects yet!
        for (let idx = 0; idx < targetElement.selectedOptions.length; idx++) {
          // TODO: Use an adapter!
          let selectedOption = targetElement.selectedOptions[idx]
          let optionAttributes = selectedOption.attributes

          let optionValue = this.getRawAttributeValue(optionAttributes) || targetElement.value

          callback(targetElement, selectedOption, optionAttributes, optionValue)
        }
      }
    }

    getRawAttributeValue(attributes) {
      let rawDataAttribute = attributes.getNamedItem('raw') || undefined // This won't work on IE 8 or lower
      let rawAttributeValue = undefined

      if (rawDataAttribute !== undefined) {
        if (JSONHelper.isJSON(rawDataAttribute.value)) {
          rawAttributeValue = JSON.parse(rawDataAttribute.value)
        }
      }

      if (rawAttributeValue !== undefined &&
        rawAttributeValue.hasOwnProperty('data')) {
        // Custom attribute for code-types
        return rawAttributeValue.data
      }

      return undefined
    }

    /**
     * Select adapter, we can move this out later...
     */
    onSelectFieldChange(targetElement, fieldName, callback) {
      this.forEachSelectedOption(targetElement, (element, option, attributes, value) => {
        this.state.fields[fieldName].value = value
      })
    }

    onInputFieldChange(targetElement, fieldName) {
      if (targetElement.type.toLowerCase() === 'number') {
        if (typeof targetElement.step === 'string' &&
          targetElement.step === '0.01') {
          // We're most likely dealing with a currency object
          // TODO: Multiple currency support
          this.state.fields[fieldName].value = {
            value: Number(targetElement.value),
            currency: 'CAD' // Pass in as special attribute
          }
        } else {
          // Standard numeric input
          this.state.fields[fieldName].value = Number(targetElement.value)
        }
      } else if (targetElement.type.toLowerCase() === 'date') {
        // Treat as date input
        // TODO: Accept some sort of formatting argument?
        let dateString = targetElement.value
        let dateObj = new Date(dateString) // TODO: Moment or something? Dunno...
        // TODO: Do I not have something generic for this anyway?
        this.state.fields[fieldName].value = {
          day: dateObj.getUTCDate(),
          month: dateObj.getUTCMonth() + 1,
          year: dateObj.getUTCFullYear(),
          value: dateString
        }
      } else {
        // Treat as text input
        this.state.fields[fieldName].value = targetElement.value
      }
    }

    validateState(fieldName) {
      // Validate the input when we attach it to the form so the form maintains the correct state?
      // I'm thinking maybe not...
      //this.validate(fieldName, this.state.fields[fieldName].value)
      let isValid = this.validate(fieldName, this.state.fields[fieldName].value)
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
          validate={this.validate}
          getMappedValue={FormComponent.getMappedValue}
          getObjectPath={FormComponent.getObjectPath}
          renderErrors={this.renderErrors}
        />
      )
    }
  }
}
