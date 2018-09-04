export default class AbstractSettingAdapter {
  constructor(mappings) {
    this.mappings = mappings || {}
    this.settings = undefined
    this.driver = undefined
  }

  initializeSettings(settings) {
    // Initialize default properties
    for (let mapping in this.mappings) {
      if (this.mappings.hasOwnProperty(mapping)) {
        settings[this.mappings[mapping].property] = [
          {
            id: null,
            code: '',
            value: '',
            data: {}
          }
        ]
      }
    }

    this.settings = settings
  }
}
