//import assign from 'object-assign'

//import { unwrapComponent, resolveComponent } from 'qc-react/components/form/AbstractFormComponent.jsx'

// If you want to extend an existing decorator use the commented out code
// Import the decorator 'definition' without the 'enhancer' wrapper
import { SampleComponentDecorator as SampleBaseComponentDecorator } from 'SampleComponentDecorator.jsx'

const SampleComponentDecorator = {
  sampleMethod: {
    value: function () {
    }
  }
}

/**
 *
 * @param WrappedComponent
 * @returns {*}
 */
function enhancer(WrappedComponent) {
  /**
   * It doesn't matter what the wrapped component is - to have access to mappings,
   * it has to be wrapped in a mobx 'Injector'. There's a more dependable way to do this using
   * the commented out imports above (unwrapComponent, resolveComponent), but it still needs work.
   */
  let wrappedComponent = WrappedComponent.wrappedComponent

  // If you want to extend an existing decorator use the commented out code
  //Object.defineProperties(wrappedComponent.prototype, SampleComponentDecorator, SampleBaseComponentDecorator)
  Object.defineProperties(wrappedComponent.prototype, SampleComponentDecorator)

  WrappedComponent.wrappedComponent = wrappedComponent

  // Return the decorated instance
  return WrappedComponent
}

export default enhancer
export { SampleComponentDecorator }
