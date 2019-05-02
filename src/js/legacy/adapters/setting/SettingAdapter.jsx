// TODO: Specify/inject adapter somewhere further up the chain
// I don't really like having to add custom driver support this deep into the hierarchy
// I'm going to have to refactor a bunch of stuff before I can do that though...
import QcSettingAdapter from './QcSettingAdapter.jsx'

function settingFactory(settingStore, adapter) {
    adapter = adapter || null
    
    switch (QC_SETTING_ADAPTER) {
        case 'custom':
            adapter = adapter
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