export default class AbstractSettingAdapter {
    static driver = null
    
    constructor(settingStore) {
        this.store = settingStore
    }
}