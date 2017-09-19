import React, { Component } from 'react';

import FormComponent from './FormComponent.jsx'

/**
 * Proxy form handler for RESTful services
 */
export default (ComposedComponent) => {
    return class RestFormComponent extends ComposedComponent {
        get() {
            let form = this.getForm()
            this.formatRequest({
                data: form
            })
        }
        
        post() {
            let form = this.getForm()
            console.log('rest req')
            console.log(form)
            this.formatRequest({
                data: form
            })
        }
        
        put() {
            let form = this.getForm()
            console.log('rest req')
            console.log(form)
            this.formatRequest({
                data: form
            })
        }
        
        patch() {
            let form = this.getForm()
            console.log('rest req')
            console.log(form)
            this.formatRequest('PATCH', {
                data: form
            })
        }
        
        formatRequest(method, data) {
            
        }
        
        handleRequest(onSuccess, onError) {
            
        }
        
        onSuccess() {
            
        }
        
        onError() {
            
        }
        
        render() {
            return super.render()
        }
    }
}