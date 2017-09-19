import React, { Component } from 'react';

export default (ComposedComponent) => {
    return class FormComponent extends Component {
        constructor(props) {
            super(props)
            this.state = { fields: {} }
        }
        
        /**
         * Forcefully flushes out any stale state artifacts when the form receives new props
         */
        componentWillReceiveProps() {
            this.setState({ fields: {} })
        }

        getField(fieldName, value) {
            value = value || '' // TODO: Handle types other than string
            
            // TODO: Sanitize string value!
            if (!this.state.fields[fieldName] || (this.state.fields[fieldName].value === '' && value !== '')) {
                this.state.fields[fieldName] = {
                    value: value,
                    onChange: (event) => {
                        this.state.fields[fieldName].value = event.target.value
                        this.forceUpdate()
                    }
                }
            }

            return {
                value: this.state.fields[fieldName].value,
                onChange: this.state.fields[fieldName].onChange
            }
        }
        
        setField(fieldName, value) {
            value = value || '' // TODO: Handle types other than string
            
            // TODO: Sanitize string value!
            if (typeof this.state.fields[fieldName] !== 'undefined') {
                this.state.fields[fieldName] = {
                    value: value,
                    onChange: (event) => {
                        this.state.fields[fieldName].value = event.target.value
                        this.forceUpdate()
                    }
                }
            } else {
                // If the field doesn't exist create it
                this.getField(fieldName, value)
            }

            return {
                value: this.state.fields[fieldName].value,
                onChange: this.state.fields[fieldName].onChange
            }
        }
        
        getForm() {
            // Normalize fields
            let formData = {}
            
            for (let name in this.state.fields) {
                formData[name] = this.state.fields[name].value
            }
            
            if (!Object.keys(formData).length > 0) return null 
            
            return formData
        }
        
        triggerAction(callback) {
            return callback(this.getForm())
        }
        
        render() {
            let props = Object.assign({}, this.props, {
                fields: this.getField.bind(this),
                field: this.setField.bind(this)
            })
            
            return (
                <ComposedComponent
                    {...props}
                    getForm = {this.getForm.bind(this)}
                    triggerAction = {this.triggerAction.bind(this)}
                    />
            )
        }
    }
}