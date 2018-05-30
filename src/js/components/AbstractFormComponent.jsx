import React, { Component } from 'react'
import assign from 'object-assign'

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
  constructor(props) {
    super(props)
  }

  /**
   * TODO: I belong in a to-be-implemented 'IFormComponentWrapper' (for lack of a better name right now) interface.
   * Grab all subforms and assemble their data into a single object.
   */
  getForm() {
    console.log('grabbing form data from child form components')
    // Always use getSubform to get sub-form data
    let itemFormData = this.getFormData(this.subforms[0])

    let formData = {
      item: assign({}, itemFormData),
      /*addresses: [
        assign({}, this.getSubform('billingAddress'))
      ],
      billingAddress: assign({}, this.getSubform('billingAddress'))*/
    }

    console.log('dumping getForm form data')
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
  getFormData(refProperty) {
    let formData = {}
    let formComponent = this[refProperty] || null

    formComponent = unwrapComponent(formComponent)

    // Grab the form data
    formData = formComponent.props.getForm() || formData
    // Grab any subform data
    if (formComponent.subforms instanceof Array) {
      formComponent.subforms.map((refName) => {
        let subform = formComponent[refName] // Get the ref
        // Get its form data
        formData = assign(formData, subform.getForm())
      })
    }


    return formData
  }

  /**
   * TODO: I belong in a to-be-implemented 'IFormComponentWrapper' (for lack of a better name right now) interface.
   * @param callback
   * @returns {*}
   */
  triggerAction(callback) {
    return callback(this.getForm())
  }
}

export default AbstractFormComponent




