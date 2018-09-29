import assign from 'object-assign'

//import { unwrapComponent, resolveComponent } from 'qc-react/components/form/AbstractFormComponent.jsx'

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

  Object.defineProperties(wrappedComponent.prototype, SampleComponentDecorator)

  WrappedComponent.wrappedComponent = wrappedComponent

  // Return the decorated instance
  return WrappedComponent
}

export default enhancer
export { SampleComponentDecorator }
