import Keycloak from 'keycloak-js'

import assign from 'object-assign'

const DEFAULT_TOKENS = {
  token: '',
  refreshToken: ''
}

const TOKEN_SESSION_VAR = 'keycloak_token'
//const TOKEN_SESSION_PARSED_VAR = 'keycloak_tokenParsed'
const REFRESH_TOKEN_SESSION_VAR = 'keycloak_refreshToken'
//const REFRESH_TOKEN_SESSION_PARSED_VAR = 'keycloak_refreshTokenParsed'

class OAuth2KeycloakDriver {
  constructor(keycloak) {
    this.keycloak = (keycloak instanceof Keycloak) ? keycloak : new Keycloak(keycloak)
  }

  /**
   * @returns {Promise<any>}
   */
  authenticate() {
    return this.initialize().then(() => {
      this.updateStoredTokens()
    })
  }

  /**
   * @returns {Promise<any>}
   */
  initialize() {
    return new Promise((resolve, reject) => {
      let storedTokens = this.getStoredTokens()

      this.keycloak
        .init({
          onLoad: 'login-required',
          checkLoginIframe: false,
          responseMode: 'query',
          token: storedTokens.token,
          refreshToken: storedTokens.refreshToken
        })
        .then((authenticated) => {
          if (authenticated) {
            this.updateStoredTokens()
            console.log('Keycloak has authenticated')

            resolve({
              adapter: this.keycloak,
              token: this.keycloak.token,
              refreshToken: this.keycloak.refreshToken,
              idToken: this.keycloak.idToken
            })
          }

          reject()
        })
        .catch((error) => {
          console.log('Keycloak failed to authenticate')
          console.log(error)

          reject({
            adapter: this.keycloak,
            token: this.keycloak.token,
            refreshToken: this.keycloak.refreshToken,
            idToken: this.keycloak.idToken,
            error: true
          })
        })
    })
  }

  updateStoredTokens() {
    let keycloakTokens = assign({}, DEFAULT_TOKENS, {
      token: this.keycloak.token,
      //access: this.keycloak.token,
      refreshToken: this.keycloak.refreshToken
    })

    this.setStoredTokens(keycloakTokens)
  }

  /**
   * @param keycloakTokens
   */
  setStoredTokens(keycloakTokens) {
    keycloakTokens = keycloakTokens || DEFAULT_TOKENS
    if (keycloakTokens.hasOwnProperty('token') && typeof keycloakTokens.token === 'string') {
      sessionStorage.setItem(TOKEN_SESSION_VAR, keycloakTokens.token)
    }

    if (keycloakTokens.hasOwnProperty('refreshToken') && typeof keycloakTokens.refreshToken === 'string') {
      sessionStorage.setItem(REFRESH_TOKEN_SESSION_VAR, keycloakTokens.refreshToken)
    }
  }

  /**
   * @returns {any}
   */
  getStoredTokens() {
    let sessionTokens = assign({}, DEFAULT_TOKENS)

    if (sessionStorage.hasOwnProperty(TOKEN_SESSION_VAR)) {
      sessionTokens.token = sessionStorage.getItem(TOKEN_SESSION_VAR)
    }

    if (sessionStorage.hasOwnProperty(REFRESH_TOKEN_SESSION_VAR)) {
      sessionTokens.refreshToken = sessionStorage.getItem(REFRESH_TOKEN_SESSION_VAR)
    }

    return sessionTokens
  }

  clearStoredTokens() {
    if (sessionStorage.hasOwnProperty(TOKEN_SESSION_VAR)) {
      sessionStorage.removeItem(TOKEN_SESSION_VAR)
    }

    if (sessionStorage.hasOwnProperty(REFRESH_TOKEN_SESSION_VAR)) {
      sessionStorage.removeItem(REFRESH_TOKEN_SESSION_VAR)
    }
  }

  /**
   * @returns {bluebird|*}
   */
  refreshTokenIfExpired() {
    return new Promise((resolve, reject) => {
      this.keycloak.updateToken(5)
        .then((refreshed) => {
          if (refreshed) {
            this.updateStoredTokens()
            console.log('Keycloak token was successfully refreshed')
          }

          resolve({
            timestamp: new Date(),
            adapter: this.keycloak,
            token: this.keycloak.token,
            refreshToken: this.keycloak.refreshToken,
            idToken: this.keycloak.idToken,
            refreshed: refreshed
          })
        })
        .catch(() => {
          console.log('Failed to refresh the token, or the session has expired')
          this.keycloak.login()

          reject({
            adapter: this.keycloak,
            token: this.keycloak.token,
            refreshToken: this.keycloak.refreshToken,
            idToken: this.keycloak.idToken,
            refreshed: false,
            error: true
          })
        })
    })
  }
}

export default OAuth2KeycloakDriver
