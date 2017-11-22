import React, { Component } from 'react'

import FormHelper from '../helpers/Form.js'

function undoable(reducer) {
  // Call the reducer with an empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  }

  // Return a reducer that handles undo and redo
  return function (state = initialState, action) {
    const { past, present, future } = state

    switch (action.type) {
		case 'UNDO':
			const previous = past[past.length - 1]
			const newPast = past.slice(0, past.length - 1)

			return {
				past: newPast,
				present: previous,
				future: [present, ...future]
			}
		case 'REDO':
			const next = future[0]
			const newFuture = future.slice(1)
			return {
				past: [...past, present],
				present: next,
				future: newFuture
			}
		default:
			// Delegate handling the action to the passed reducer
			const newPresent = reducer(present, action)
			if (present === newPresent) {
				return state
			}
			return {
				past: [...past, present],
				present: newPresent,
				future: []
			}
    }
  }
}

const defaultState = {
	history: {
		past: [0, 1, 2, 3, 4, 5, 6, 7, 8],
		present: 9,
		future: [10]
	}
}

const history = (defaultState, action) => {
	switch (action.type) {
		case 'UNDO':
		  return { value: state.value + 1 }
		case 'REDO':
		  return { value: state.value - 1 }
		case 'FREEZE':
			return
		case 'THAW':
			return
		default:
		  return state
	}
	
}

// TODO: This component needs to be unit tested
export default (ComposedComponent) => {
    return class FormComponent extends Component {
        constructor(props) {
            super(props)
            this.state = { fields: {} }
        }
        
        /**
		 * We don't need redux but dropping in a simple dispatch mechanism
		 * will allow us to make/undo state changes in a sane manner
		 */
		dispatch(action) {
			this.setState({}) // Manage state of subforms
		}
		
		/**
		 * Freeze data, persisting it to localStorage
		 */
		freezeState() {
			
		}
		
		/**
		 * Thaw frozen data from localStorage, and hydrate the form(s)
		 */
		thawState() {
			
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
            value = (typeof value !== 'undefined') ? value : '' // TODO: Should I really default to an empty string?
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
        
		validate(callback) {
			return callback()
		}
		
		// Convenience method
		static getMappedValue(path, data) {
			return FormHelper.getMappedValue(path, data)
		}
		
		// Convenience method
		static getObjectPath(str) {
			return FormHelper.getObjectPath(path, data)
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
                    getMappedValue = {FormComponent.getMappedValue}
                    getObjectPath = {FormComponent.getObjectPath}
                    renderErrors = {this.renderErrors.bind(this)}
                    />
            )
        }
    }
}