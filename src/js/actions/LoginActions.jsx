import AppDispatcher from '../dispatcher/AppDispatcher.jsx'
import LoginConstants from '../constants/LoginConstants.jsx'

export default {
    loginUser: (userToken) => {
        try {
            let savedToken = sessionStorage.getItem('userToken')
            userToken = (typeof userToken === 'string') ? userToken : userToken
            
            AppDispatcher.dispatch({
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
        sessionStorage.removeItem('user')
        
        AppDispatcher.dispatch({
            actionType: LoginConstants.LOGOUT_USER
        })
    },
    setUser: (data) => {
        AppDispatcher.dispatch({
            actionType: LoginConstants.SET_USER,
            user: data
        })
    }
}