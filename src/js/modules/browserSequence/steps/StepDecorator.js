import axios from 'axios'

import assign from 'object-assign'

//import { unwrapComponent, resolveComponent } from 'qc-react/components/form/AbstractFormComponent.jsx'

const StepDecorator = {
  handleAction: {
    value: function (payload) {
      // Indigo BrowserStore.handleAction
      let key = null

      try {
        this.setConfig(payload.config)
        if (typeof payload.config.key !== 'string') {
          throw new Error('Invalid configuration - payload data key was not provided.')
        } else {
          key = payload.config.key
        }

        let isLoaded = false
        let dataLoaded = payload.loaded || false

        // Check to see if the data has been loaded
        if (this.has(key) && dataLoaded) {
          isLoaded = true
        }

        if (!isLoaded) {
          // Filter by category ID
          let query = ''
          query = (payload.hasOwnProperty('query')) ? payload.query : query
          // Fetch data and trigger the change
          this.queryData(key, query, () => this.emitChange())
        } else {
          // No need to fetch, just trigger the change
          this.emitChange()
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  queryData: {
    value: function (key, query, onSuccess, onError) {
      let that = this
      let requestConfig = assign({}, this.config.src.transport.read, { data: query })

      axios(requestConfig)
        .then(response => {
          let payload = response.data
          let normalizedData = normalize(payload.content, that.config.schema)

          // Normalize our data and store the items
          if (typeof key === 'string' && key !== '') {
            this.items[key] = Object.keys(normalizedData.result).map(key => {
              let item = normalizedData.result[key]

              // TODO: Maybe there's a better way to clean/decode item names
              // Clean/decode name
              let elem = document.createElement('textarea')
              elem.innerHTML = item.name
              item.name = elem.value

              return item
            })
          } else {
            // Set to root
            this.items = Object.keys(normalizedData.result).map(key => normalizedData.result[key])
          }

          if (typeof onSuccess === 'function') {
            onSuccess()
          }
        }).catch(err => {
        if (typeof onError === 'function') {
          onError()
        }
        // Only if sample data is loaded...
        //let normalizedData = normalize(SampleItems.data, that.config.schema)
        //this.items = Object.keys(normalizedData.result).map(key => normalizedData.result[key])
      })
    }
  },
  fetchData: {
    value: function (key, onSuccess, onError) {
      this.queryData(key, '', onSuccess, onError)
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
  let wrappedComponent = WrappedComponent

  Object.defineProperties(wrappedComponent.prototype, StepDecorator)

  WrappedComponent = wrappedComponent

  // Return the decorated instance
  return WrappedComponent
}

export default enhancer
export { StepDecorator }
