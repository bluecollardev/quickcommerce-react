class BasicAuthAdapter {
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

    if (authConfig.username || authConfig.password) {
      requestConfig.auth = {
        username: authConfig.username || '',
        password: authConfig.password || ''
      }
    }

    requestConfig.headers = Object.assign((requestConfig.headers || {}), authHeaders)
  }
}

export default BasicAuthAdapter
