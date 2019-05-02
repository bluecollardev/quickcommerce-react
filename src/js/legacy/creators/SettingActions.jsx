import SettingConstants from '../constants/SettingConstants.jsx'

export default (dispatcher) => {
    return {
        fetchSettings: () => {
            dispatcher.dispatch({
                actionType: SettingConstants.FETCH_SETTINGS
            })
        },
        setSettings: (settings) => {
            dispatcher.dispatch({
                actionType: SettingConstants.SET_SETTINGS,
                settings: settings
            })
        },
        setConfig: (config) => {
            dispatcher.dispatch({
                actionType: SettingConstants.SET_CONFIG,
                config: config
            })
        },
        fetchStores: (id) => {
            dispatcher.dispatch({
                actionType: SettingConstants.FETCH_STORES
            })
        },
        fetchStore: (id) => {
            dispatcher.dispatch({
                actionType: SettingConstants.FETCH_STORE,
                storeId: id
            })
        }
    }
}