class OAuth2TokenDriver {
  constructor(apiClient, adapter) {
    this.adapter = adapter
    this.apiClient = apiClient
  }

  /**
   * @param authTokens
   */
  static setToken(authTokens) {
    throw new Error('setToken is not implemented in this driver')
  }

  /**
   * @returns {any}
   */
  static getToken() {
    throw new Error('getToken is not implemented in this driver')
  }

  static clearToken() {
    throw new Error('clearToken is not implemented in this driver')
  }

  /**
   * @returns {bluebird|*}
   */
  refreshTokenIfExpired() {
    throw new Error('refreshTokenIfExpired is not implemented in this driver')
  }
}

export default OAuth2TokenDriver
