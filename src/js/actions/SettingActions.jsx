import AppDispatcher from '../dispatcher/AppDispatcher.jsx'
import SettingConstants from '../constants/SettingConstants.jsx'

export default {
    fetchSettings: () => {
        AppDispatcher.dispatch({
            actionType: SettingConstants.FETCH_SETTINGS
        })
    },
    setSettings: (settings) => {
        AppDispatcher.dispatch({
            actionType: SettingConstants.SET_SETTINGS,
            settings: settings
        })
    },
    setConfig: (config) => {
        AppDispatcher.dispatch({
            actionType: SettingConstants.SET_CONFIG,
            config: config
        })
    },
    fetchStores: (id) => {
        AppDispatcher.dispatch({
            actionType: SettingConstants.FETCH_STORES
        })
    },
    fetchStore: (id) => {
        AppDispatcher.dispatch({
            actionType: SettingConstants.FETCH_STORE,
            storeId: id
        })
    }
}