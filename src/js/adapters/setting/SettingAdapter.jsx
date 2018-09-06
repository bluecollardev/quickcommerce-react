// TODO: Specify/inject adapter somewhere further up the chain
// I don't really like having to add custom driver support this deep into the hierarchy
// I'm going to have to refactor a bunch of stuff before I can do that though...
import QcSettingAdapter from './QcSettingAdapter.jsx'

/**
 * This has become obsolete; initialize at application root in the following manner:
 * const settingAdapter = new MySettingAdapter(settingMappings)
 * const settingStore = new SettingStore(dispatcher, settingAdapter)
 *
 * @deprecated Use the settings module!
 * @param settingStore
 * @param adapter
 * @returns {*}
 */
function settingFactory(settingStore, adapter) {
  adapter = adapter || null

  switch (QC_SETTING_ADAPTER) {
    case 'custom':
      break
    default:
      adapter = QcSettingAdapter
      break
  }

  if (adapter !== null) {
    return new adapter(settingStore)
  }

  return adapter
}

export default settingFactory
