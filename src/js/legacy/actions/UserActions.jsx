import UserConstants from '../constants/UserConstants.jsx'

export default (dispatcher) => {
    return {
        clearUser: () => {
            dispatcher.dispatch({
                actionType: UserConstants.CLEAR_USER
            })
        },
        setUser: (data) => {
            dispatcher.dispatch({
                actionType: UserConstants.SET_USER,
                user: data
            })
        }
    }
}