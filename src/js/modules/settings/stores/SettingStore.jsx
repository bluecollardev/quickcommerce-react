import assign from 'object-assign'

import SettingConstants from '../constants/SettingConstants.jsx'
// In this special instance (because Settings will eventually become a quickcommerce-react module)
// it's okay to directly import mappings. At a future time, maybe we'll inject the mappings...
import SettingMappings from '../mappings/SettingMappings.jsx'

import BaseStore from '../../../stores/BaseStore.jsx'
import HashProxy from '../../../utils/HashProxy.js'

/**
 * Initialize this store in the following manner:
 * const settingAdapter = new MySettingAdapter(settingMappings)
 * const settingStore = new SettingStore(dispatcher, settingAdapter)
 */
class AbstractSettingStore extends BaseStore {
  /**
   * @param dispatcher The flux dispatcher instance used by the application
   * @param adapter A setting adapter
   */
  constructor(dispatcher, adapter) {
    super(dispatcher)

    adapter = adapter || undefined
    if (adapter === undefined) {
      throw new Error('Error constructing AbstractSettingStore - no adapter supplied')
    }

    this.adapter = adapter

    this.subscribe(() => this.registerToActions.bind(this))
  }

  registerToActions(action) {
    switch (action.actionType) {
      case SettingConstants.FETCH_SETTINGS:
        this.fetchSettings()
        break
      case SettingConstants.SET_SETTINGS:
        //this.setSettings(action.settings)
        break
      case SettingConstants.FETCH_STORES:
        //this.fetchStores()
        break
      case SettingConstants.FETCH_STORE:
        //this.fetchStore(action.storeId)
        break
      default:
        break
    }
  }

  getSettings() {
    return this.adapter.settings
  }

  fetchSettings() {
    try {
      this.adapter.fetchSettings((settings) => {
        // On success
        this.emit('settings-loaded', settings)
      }, () => {
        // On error
        this.emit('settings-loaded-error')
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Saves default app (POS) settings to localStorage.
   * TODO: localForage is probably a better long term solution...
   */
  freezeSettings(settings) {
    //localStorage.setItem('settings', JSON.stringify(settings))
  }

  /**
   * Retreives default app (POS) settings from localStorage.
   * TODO: localForage is probably a better long term solution...
   */
  unfreezeSettings() {
    //if (typeof localStorage.getItem('settings') === 'string') {
    //this.settings = JSON.parse(localStorage.getItem('settings'))
    //}
  }
}

/**
 * Wrap SettingStore in a Proxy in order to facilitate what feels like 'direct'
 * access to the settings property on the adapter.
 *
 * @param dispatcher
 * @param adapter
 * @returns {AbstractSettingStore}
 * @constructor
 */
function SettingStore(dispatcher, adapter) {
  return new Proxy(new AbstractSettingStore(dispatcher, adapter), {
    get: (instance, prop) => {
      if (typeof instance.adapter.settings[prop] !== 'undefined') {
        return instance.adapter.settings[prop]
      }

      return instance[prop]
    },
    apply: (instance, context, argumentsList) => {
      return instance.apply(context, argumentsList)
    }
  })
}

export default SettingStore
export { SettingStore, AbstractSettingStore }


