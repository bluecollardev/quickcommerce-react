import React, { Component } from 'react'

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
		
		static getMappedValue(path, data) {
			if (typeof data === 'undefined' || data === null) {
				return null
			}
			
			// Access static methods using constructor property
			let chunks = FormComponent.getObjectPath(path)
			
			let arrayExpr = /(\[\]|\[(.*)\])$/g
			let isArray = false
			
			let currentChunk = chunks.shift() // Shift the first element off the array
			isArray = arrayExpr.test(currentChunk)
			
			/*if (isArray) {
				console.log(currentChunk + ' is an array')
			} else {
				console.log(currentChunk + ' is not an array')
			}*/
			
			if (chunks.length > 0) {
				//console.log('processing path chunk: ' + currentChunk)
				let prop = currentChunk
				
				if (isArray) {
					// Bust the [] off the string so we're left with just the property key				
					prop = prop.replace(arrayExpr, '')
					
					// Get the index of the array item we're targeting
					// Not sure if there's ever a case where we wouldn't use an index (myProp[])? How would that work?
					let arrIdx = parseInt(arrayExpr.exec(currentChunk)[2]) // Just get the number
					//console.log(JSON.stringify(data[prop][arrIdx]))
					
					// IMPORTANT! Re-escape the chunks before recursing or the result will not be what you expected
					chunks = chunks.map(chunk => {
						return chunk.replace('.', '\\\\.')
					})
					
					return FormComponent.getMappedValue(chunks.join('.'), data[prop][arrIdx])
				}
				
				//console.log(JSON.stringify(data[prop]))
				return FormComponent.getMappedValue(chunks.join('.'), data[prop])
			} else {
				return data[currentChunk]
			}		
		}
		
		static getObjectPath(str) {
			// ([^\\]) Negative capturing group to make sure we don't pick up escape slashes
			// (\\\\)* Match backslash character
			// \. Grab any unescaped dots
			
			if (!(typeof str === 'string')) {
				throw new Error('Invalid object path, getObjectPath expected a string')
			}
			
			let merged = []
			
			// Credits to https://github.com/wankdanker/node-object-mapper/blob/master/src/set-key-value.js for this approach to parsing object paths
			let dotExpr = /([^\\])(\\\\)*\./g // Matches all unescaped dots in the provided string
			let chunks = str.split(dotExpr) // Explode the string into an array of path chunks
			
			for (let i = 0; i < chunks.length; i++) {
				if ((i - 1) % 3 === 0) {
					// Every third match is the character of the first group [^\\] which needs to be merged in again
					// That comment doesn't really make sense... let's work on it eh?
					let tmpKey = chunks[i - 1] + chunks[i]
					merged.push(tmpKey.replace("\\.", "."))
				}
				
				// Add part after last dot
				if (i === chunks.length - 1) {
					merged.push(chunks[i].replace("\\.", "."))
				}
			}
			
			chunks = merged
			
			//console.log(JSON.stringify(chunks))
			
			return chunks
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