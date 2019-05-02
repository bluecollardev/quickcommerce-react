import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

/**
 * This higher-order component wraps an existing component, decorating it with methods needed to interact
 * with the shopping cart.
 */
export default (ComposedComponent) => {
    @inject(deps => ({
        actions: deps.actions,
        authService: deps.authService,
        customerService: deps.customerService,
        checkoutService: deps.checkoutService,
        settingService: deps.authService,
        loginStore: deps.loginStore,
        userStore: deps.userStore,
        customerStore: deps.customerStore,
        catalogStore: deps.catalogStore,
        cartStore: deps.cartStore,
        checkoutStore: deps.checkoutStore,
        starMicronicsStore: deps.starMicronicsStore,
        productStore: deps.productStore,
        settingStore: deps.settingStore,
        mappings: deps.mappings, // Per component or global scope?
        translations: deps.translations, // i8ln transations
        roles: deps.roles, // App level roles, general authenticated user (not customer!)
        userRoles: deps.userRoles, // Shortcut or implement via HoC?
        user: deps.user // Shortcut or implement via HoC?
    }))
    @observer
    class StepContext extends Component {
    }
    
    return StepContext
}