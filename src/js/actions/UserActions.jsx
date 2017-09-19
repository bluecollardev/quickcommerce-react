import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import UserConstants from '../constants/UserConstants.jsx';

export default {
    clearUser: () => {
        AppDispatcher.dispatch({
            actionType: UserConstants.CLEAR_USER
        })
    },
    setUser: (data) => {
        AppDispatcher.dispatch({
            actionType: UserConstants.SET_USER,
            user: data
        })
    }
}