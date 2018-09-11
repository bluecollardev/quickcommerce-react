export default class SettingAdapter {
  /**
   * This constructor must be re-defined in inheriting classes.
   *
   * Providing methods to set the mappings, settings and driver properties
   * AFTER constructing a class instance is probably the most simple fix.
   * Leveraging flow interfaces is another solution, but I haven't had a chance
   * to switch to using flow typings...
   *
   * For now, inheriting classes should define a constructor that looks
   * something like the chunk of code below:
   *
   * constructor(mappings) {
   *   // Parent sets the store to use
   *   super(mappings)
   *   // Specify which settings driver to use
   *   this.driver = new IndigoUriDriver(this)
   * }
   *
   * @param driver
   * @param mappings
   */
  constructor(driver, mappings) {
    this.settings = {}

    // TODO: Type-check and throw errors if mappings are not provided!
    this.mappings = mappings
    // TODO: Type-check and throw errors if driver does not match an appropriate 'interface'/type
    this.driver = driver

    this.initializeSettings(this.settings)
  }

  /**
   * Loops over the class instance's mappings property (supplied via the constructor),
   * populating the instance's settings property with default values.
   *
   * @param settings
   */
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

    // Reference the passed-in settings object
    this.settings = settings
  }

  /**
   * Fetches settings from a data source using the supplied driver.
   *
   * @param onSuccess
   * @param onError
   */
  fetchSettings(onSuccess, onError) {
    // TODO: Type-check the driver!!!
    this.driver.fetchSettings((payload) => {
      this.onSettingsFetched(payload)

      if (typeof onSuccess === 'function') {
        onSuccess(payload)
      }
    }, onError)
  }

  /**
   * Populates the class instance's settings property with values fetched from a data source.
   * This method MUST be implemented in inheriting classes.
   *
   * Sample implementation in an inheriting class:
   *
   * onSettingsFetched(payload) {
   *   this.settings.countries = this.driver.parseCountries()
   * })
   *
   * @param payload
   */
  onSettingsFetched(payload) {
    throw new Error('onSettingsFetched is not implemented in the concrete adapter class')
  }
}
