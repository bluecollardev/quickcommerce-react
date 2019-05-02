import LoginConstants from '../constants/LoginConstants.jsx'

export default (dispatcher) => {
    return {
        loginUser: (userToken) => {
            try {
                let savedToken = sessionStorage.getItem('userToken')
                userToken = (typeof userToken === 'string') ? userToken : userToken
                
                dispatcher.dispatch({
                    actionType: LoginConstants.LOGIN_USER,
                    userToken: userToken
                })
            
                if (savedToken !== userToken) {
                    sessionStorage.setItem('userToken', userToken)
                }
            } catch (err) {
                console.log(err)
            }        
        },
        logoutUser: () => {
            sessionStorage.removeItem('userToken')
            sessionStorage.removeItem('refreshToken')
            sessionStorage.removeItem('userCreds')
            sessionStorage.removeItem('user')
            
            dispatcher.dispatch({
                actionType: LoginConstants.LOGOUT_USER
            })
        },
		setCreds: () => {
            try {
                let savedCreds = sessionStorage.getItem('userCreds')
                userCreds = (typeof userCreds === 'string') ? userCreds : userCreds
                
                dispatcher.dispatch({
                    actionType: LoginConstants.SET_CREDS,
                    userCreds: userCreds
                })
            
                if (savedCreds !== userCreds) {
                    sessionStorage.setItem('userCreds', userCreds)
                }
            } catch (err) {
                console.log(err)
            } 
        }
    }
}