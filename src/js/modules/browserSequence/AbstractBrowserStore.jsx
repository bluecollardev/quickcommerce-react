

//import UrlHelper from 'qc-react/helpers/URL.js'

import BaseCollectionStore from 'qc-react/stores/BaseCollectionStore.jsx'

//import BrowserConstants from './BrowserConstants.jsx'

class AbstractBrowserStore extends BaseCollectionStore {
  // BrowserStore constructor
  constructor(dispatcher) {
    super()

    this.stepForward = false
    this.config = null

    this.dispatcher = dispatcher

    this.items = {}

    this.subscribe(() => this.registerToActions.bind(this))
  }

  subscribe(actionSubscribe) {
    this.dispatchToken = this.dispatcher.register(actionSubscribe())
  }

  buildDataStore() {
    if (this.config === null) {
      throw new Error('Invalid configuration - cannot build datastore')
    }
  }

  // Temporary function to refactor
  setConfig(config) {
    this.config = config
  }

  getConfig() {
    return this.config
  }

  // TODO: Update path replace {id} stuff to use url-parse
  registerToActions(action) {
    let payload = JSON.parse(JSON.stringify(action)) // Clone the action so we can modify it as necessary

    switch (action.actionType) {
      // onLoad actions
    }
  }

  handleAction(payload) {
    throw new Error('handleAction has not been implemented')
  }
  // Indigo BrowserStore.fetchData
  fetchData(key, onSuccess, onError) {
    throw new Error('fetchData has not been implemented')
  }

  // Indigo BrowserStore.queryData
  queryData(key, query, onSuccess, onError) {
    throw new Error('queryData has not been implemented')
  }
}

export default AbstractBrowserStore
export { AbstractBrowserStore }
