class ApiKeyAuthAdapter {
  constructor(driver) {
    this.driver = driver
  }

  /**
   * @returns {*}
   */
  authenticate() {
    return Promise.resolve()
  }

  /**
   * Applies authentication headers to the requestConfig.
   */
  applyAuthToRequest(authConfig, requestConfig) {
    let authHeaders = null

    if (authConfig.apiKey) {
      let data = {}
      if (authConfig.apiKeyPrefix) {
        data[authConfig.name] = authConfig.apiKeyPrefix + ' ' + authConfig.apiKey
      } else {
        data[authConfig.name] = authConfig.apiKey
      }

      if (authConfig['in'] === 'header') {
        authHeaders = data
      } else {
        requestConfig.params = data
      }
    }

    requestConfig.headers = Object.assign((requestConfig.headers || {}), authHeaders)
  }
}

export default ApiKeyAuthAdapter
