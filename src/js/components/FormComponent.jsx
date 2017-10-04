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
        
        getField(fieldName, defaultValue) {
            defaultValue = defaultValue || '' // TODO: Handle types other than string
            let field = this.state.fields[fieldName] || null
            
            if (field === null || typeof event === 'undefined') {
                // If we're initializing a new field
                this.state.fields[fieldName] = {
                    name: fieldName,
                    value: defaultValue,
                    onChange: (event) => {
                        //console.log('setting FormComponent field value to "' + event.target.value + '"')
                        this.state.fields[fieldName].value = event.target.value
                        this.forceUpdate()
                    }
                }
            } else if (field !== null && fieldName === event.target.name) {
                // If we're udpating or clearing a field
                this.state.fields[fieldName] = {
                    name: fieldName,
                    value: event.target.value,
                    onChange: (event) => {
                        //console.log('setting FormComponent field value to "' + event.target.value + '"')
                        this.state.fields[fieldName].value = event.target.value
                        this.forceUpdate()
                    }
                }
            }

            return {
                name: fieldName,
                value: this.state.fields[fieldName].value,
                onChange: this.state.fields[fieldName].onChange
            }
        }
        
        setField(fieldName, value) {
            value = value || '' // TODO: Handle types other than string
            let field = this.state.fields[fieldName] || null
            
            // TODO: Sanitize string value!
            if (field !== null) {
                this.state.fields[fieldName] = {
                    name: fieldName,
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
                name: fieldName,
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
        
        renderErrors() {
            let errors = []
            let count = Object.keys(this.state.errors).length
            let idx = 1
            
            if (typeof this.state.errors !== 'string' && count > 0) {
                for (let error in this.state.errors) {
                    errors.push(<strong>{this.state.errors[error]}</strong>)
                    if (idx < count) {
                        errors.push(<br/>)
                    }
                    
                    idx++
                }
            } else if (typeof this.state.errors === 'string') {
                errors.push(<strong>{this.state.errors}</strong>)
            }
            
            return errors
        }
        
        render() {
            let props = Object.assign({}, this.props, {
                fields: this.getField.bind(this),
                field: this.setField.bind(this)
            })
            
            return (
                <ComposedComponent
                    {...props}
                    ref = {(component) => this.component = component}
                    getForm = {this.getForm.bind(this)}
                    triggerAction = {this.triggerAction.bind(this)}
                    renderErrors = {this.renderErrors.bind(this)}
                    />
            )
        }
    }
}