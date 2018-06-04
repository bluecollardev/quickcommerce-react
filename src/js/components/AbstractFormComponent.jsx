import assign from 'object-assign'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

function isWrappedWithInjector(component) {
  return component.hasOwnProperty('wrappedInstance')
}

function isFormComponent(component) {
  return component.hasOwnProperty('component')
}

function resolveComponent(component) {
  if (isWrappedWithInjector(component)) {
    return component.wrappedInstance
  } else if (isFormComponent(component)) {
    return component.component
  }

  return component
}

function unwrapComponent(target) {
  if (typeof target === 'undefined' || target === null) {
    throw new Error('Cannot unwrap target - invalid target provided')
  }

  // If the target isn't wrapped, just return it, it's all good
  if (!isWrappedWithInjector(target) && !isFormComponent(target)) {
    return target
  }

  // Otherwise, resolve the component and test the result again
  return unwrapComponent(resolveComponent(target))
}

class AbstractFormComponent extends Component {
  static propTypes = {
    onCreate: PropTypes.func,
    onCreateSuccess: PropTypes.func,
    onUpdate: PropTypes.func,
    onUpdateSuccess: PropTypes.func,
    onSaveSuccess: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    onError: PropTypes.func
  }

  static defaultProps = {
    onCreate: () => {},
    onCreateSuccess: () => {},
    onUpdate: () => {},
    onUpdateSuccess: () => {},
    onSaveSuccess: () => {},
    onDelete: () => {},
    onDeleteSuccess: () => {},
    onCancel: () => {},
    onError: () => {}
  }

  constructor(props) {
    super(props)

    this.onCreate = this.onCreate.bind(this)
    this.onCreateSuccess = this.onCreateSuccess.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onUpdateSuccess = this.onUpdateSuccess.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onDelete = this.onCancel.bind(this)
    this.onDeleteSuccess = this.onDeleteSuccess.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onError = this.onError.bind(this)
    this.renderErrors = this.renderErrors.bind(this)
    this.getForm = this.getForm.bind(this)
    this.getFormData = this.getFormData.bind(this)
    this.registerSubform = this.registerSubform.bind(this)
    this.triggerAction = this.triggerAction.bind(this)

    // Ref names for subforms, required in inheriting classes
    this.subforms = []
  }

  onCreate(e) {
    e.preventDefault()
    e.stopPropagation()

    this.triggerAction((formData) => {
      if (typeof this.props.onCreate === 'function') {
        console.log('execute handler')
        let fn = this.props.onCreate
        fn(formData)
      }
    })
  }

  onCreateSuccess(response) {
    console.log('executing onCreateSuccess')
    if (typeof this.props.onCreateSuccess === 'function') {
      console.log('execute handler')
      let fn = this.props.onCreateSuccess
      fn(response)
    }
  }

  onUpdate(e) {
    e.preventDefault()
    e.stopPropagation()

    this.triggerAction((formData) => {
      if (typeof this.props.onUpdate === 'function') {
        console.log('execute handler')
        let fn = this.props.onUpdate
        fn(formData)
      }
    })
  }

  onUpdateSuccess(response) {
    console.log('executing onUpdateSuccess')
    if (typeof this.props.onUpdateSuccess === 'function') {
      console.log('execute handler')
      let fn = this.props.onUpdateSuccess
      fn(response)
    }
  }

  onSaveSuccess(response) {
    console.log('executing onSaveSuccess')
    if (typeof this.props.onSaveSuccess === 'function') {
      console.log('execute handler')
      let fn = this.props.onSaveSuccess
      fn(response)
    }
  }

  onDelete(e) {
    throw new Error('onDelete is not implemented in the concrete class')
  }

  onDeleteSuccess(response) {
    console.log('executing onDeleteSuccess')
    if (typeof this.props.onDeleteSuccess === 'function') {
      console.log('execute handler')
      let fn = this.props.onDeleteSuccess
      fn(response)
    }
  }

  onCancel(e) {
    e.preventDefault()
    e.stopPropagation()

    console.log('executing onCancel')
    if (typeof this.props.onCancel === 'function') {
      console.log('execute handler')
      let fn = this.props.onCancel
      fn(e)
    }
  }

  onError(response) {
    console.log('executing onError')
    if (typeof this.props.onError === 'function') {
      console.log('execute handler')
      let fn = this.props.onError
      fn(response)
    }

    this.setState({ errors: response.error })
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


  /**
   * Grab all subforms and assemble their data into a single object.
   */
  getForm(convertToEntities) {
    console.log('grabbing form data from all registered child components')
    let forms = this.subforms
    let formData = {}

    this.subforms.map((refName, idx) => {
      formData[refName] = this.getFormData(refName, convertToEntities)
    })

    console.log('dumping form data')
    console.log(formData)

    return formData
  }

  /**
   * TODO: I belong in a to-be-implemented 'IFormComponentWrapper' (for lack of a better name right now) interface.
   * TODO: Type check - we don't want to be calling getForm on a sub-form component that isn't a FormComponent.
   * There's no guarantee that markup in an inheriting component will contain the same references / subs.
   * @param refProperty
   * @returns {{}}
   */
  getFormData(refProperty, convertToEntities) {
    let formData = {}
    let formComponent = this[refProperty] || null

    formComponent = unwrapComponent(formComponent)

    // Grab the form data
    if (formComponent !== null &&
      formComponent.props.hasOwnProperty('getForm') &&
      typeof formComponent.props.getForm === 'function') {
      formData = formComponent.props.getForm(convertToEntities) || formData
      // Grab any subform data
      if (formComponent.subforms instanceof Array) {
        formComponent.subforms.map((refName) => {
          let subform = formComponent[refName] // Get the ref
          // Get its form data
          formData = assign(formData, subform.getForm(convertToEntities))
        })
      }
    }

    return formData
  }

  /**
   * Convenience method to register a callback ref for a subform.
   * @param refName
   * @returns {Function}
   */
  registerSubform(refName) {
    let that = this

    return (subform) => {
      // Only register if the ref doesn't exist
      if (that.subforms.indexOf(refName) === -1 &&
        typeof that[refName] === 'undefined') {
        that.subforms.push(refName)
        that[refName] = subform
      }
    }
  }

  /**
   * TODO: I belong in a to-be-implemented 'IFormComponentWrapper' (for lack of a better name right now) interface.
   * @param callback
   * @returns {*}
   */
  triggerAction(callback, convertToEntities) {
    return callback(this.getForm(convertToEntities))
  }
}

export default AbstractFormComponent




