/**
 * @deprecated Use the settings module!
 */
export default class AbstractSettingAdapter {
  static driver = null

  constructor(settingStore) {
    this.store = settingStore
  }
}
