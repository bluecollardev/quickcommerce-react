import Keycloak from 'keycloak-js'

const initialToken = {
  'access_token': 'ACCESS_1',
  'expires_in': 300,
  'refresh_expires_in': 1800,
  'refresh_token': '',
  'token_type': 'bearer',
  'id_token': 'ID_TOKEN',
  'not-before-policy': 1524157635,
  'session_state': '66f5971e-503e-48fa-a9f2-09de263767b4',
  'scope': ''
}

const refreshedToken = {
  'access_token': 'ACCESS_2',
  'expires_in': 300,
  'refresh_expires_in': 1800,
  'refresh_token': 'REFRESH_1',
  'token_type': 'bearer',
  'id_token': 'ID_TOKEN_2',
  'not-before-policy': 1524157635,
  'session_state': '66f5971e-503e-48fa-a9f2-09de263767b4',
  'scope': ''
}

class OAuth2KeycloakDriver {
  constructor(keycloak) {
    this.keycloak = (keycloak instanceof Keycloak) ? keycloak : new Keycloak(keycloakConfig)
  }

  /**
   * @returns {Promise<any>}
   */
  authenticate() {
    return this.initialize((keycloakInstance) => {
      this.setToken(keycloakInstance)
    })
  }

  /**
   * @param onSuccess
   * @returns {Promise<any>}
   */
  initialize(onSuccess) {
    this.keycloak.token = initialToken

    return new Promise((resolve, reject) => {
      if (typeof onSuccess === 'function') {
        //console.log('Keycloak token: ' + this.keycloak.token)
        //console.log(this.keycloak)
        onSuccess(this.keycloak)
      }

      resolve(this.keycloak.token)
    })
  }

  /**
   * @param authTokens
   */
  setToken(authTokens) {
    authTokens = authTokens || null

    if (typeof authTokens === 'string') {
      // TODO: Validate string/JWT token and store
      sessionStorage.setItem('authTokens', authTokens)
      // TODO: Duck type or flow type the keycloak response object
    } else if (typeof authTokens === 'object' && authTokens !== null) {
      sessionStorage.setItem('authTokens', JSON.stringify(authTokens))
    } else if (authTokens === null) {
      // Some other JWT lib?
    }
  }

  /**
   * @returns {any}
   */
  getToken() {
    if (sessionStorage.hasOwnProperty('authTokens')) {
      return JSON.parse(sessionStorage.getItem('authTokens'))
    }
  }

  clearToken() {
    if (sessionStorage.hasOwnProperty('authTokens')) {
      sessionStorage.removeItem('authTokens')
    }
  }

  /**
   * @returns {bluebird|*}
   */
  refreshTokenIfExpired() {
    let that = this

    return new Promise((resolve, reject) => {
      const storedToken = this.getToken()
      let tokenProps = [
        'idToken',
        'idTokenParsed',
        'refreshToken',
        'refreshTokenParsed',
        'token',
        'tokenParsed'
      ]

      for (let prop in storedToken) {
        if (!storedToken.hasOwnProperty(prop)) {
          continue
        }

        if (tokenProps.indexOf(prop) > -1) {
          that.keycloak[prop] = storedToken[prop]
        }
      }

      this.keycloak.token = refreshedToken

      this.setToken(that.keycloak)
      console.log('Keycloak token was successfully refreshed')

      resolve()
    })
  }
}

export default OAuth2KeycloakDriver
