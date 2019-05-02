import assign from 'object-assign'

import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import FormComponent from '../FormComponent.jsx'

export default FormComponent(class Notes extends Component {
    static defaultProps = {
        displayAddress: false,
        displaySummary: false,
        title: 'Notes',
        text: ''
    }

    constructor(props) {
        super(props)
        
        this.getNotesString = this.getNotesString.bind(this)
        this.showNotesModal = this.showNotesModal.bind(this)
        this.hideNotesModal = this.hideNotesModal.bind(this)
        this.clear = this.clear.bind(this)
        this.toggleNotes = this.toggleNotes.bind(this)
        
        this.onSave = this.onSave.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onError = this.onError.bind(this)
        
        let defaultProps = Notes.defaultProps
        
        this.state = {
            text: ''
        }
    }
    
    clear() {
        this.setState({
            text: ''
        })
    }

    toggleNotes() {
        if (this.state.notes === 1) {
            this.setState({ notes: null })
        } else {
            this.setState({ notes: 1 })
        }
    }

    showNotesModal() {
        if (this.props.modal) {
            this.setState({ notes: 1 })
        } else {
            this.toggleNotes()
        }

    }

    hideNotesModal() {
        if (this.props.modal) {
            this.setState({ notes: null })
        } else {
            this.toggleNotes()
        }
    }

    getNotesString() {
        return this.state.text
    }
    
    onSave(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.props.triggerAction((formData) => {
            // Do something
        })
        
        this.setState({
            text: this.notes.value
        }, () => {
            console.log('executing onSaveSuccess')
            if (typeof this.props.onSaveSuccess === 'function') {
                console.log('execute handler')
                let fn = this.props.onSaveSuccess
                fn(this.getNotesString())
            }
            
            this.hideNotesModal()        
        })
    }
    
    onCancel(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing onCancel')
        if (typeof this.props.onCancel === 'function') {
            console.log('execute handler')
            let fn = this.props.onCancel
            fn()
        }
        
        this.hideNotesModal()
    }
    
    onError() {
        console.log('executing onError')
        if (typeof this.props.onError === 'function') {
            console.log('execute handler')
            let fn = this.props.onError
            fn()
        }
    }
    
    render() {
        let notesString = this.getNotesString()
        
        return (
            <div>
                <h5>{this.props.title}</h5>
                {this.props.displaySummary && (
                <form>
                    <FormGroup>
                        {/*<ControlLabel>Notes</ControlLabel>*/}
                        <FormControl 
                            componentClass = 'textarea' 
                            value = {notesString} 
                            placeholder = 'Click or tap to enter a note...'
                            rows = {1} 
                            onClick = {this.showNotesModal}
                            readOnly />
                    </FormGroup>
                </form>
                )}

                {(this.state.notes && !this.props.modal) || (this.props.displaySummary !== true) && (
                <div>
                    <form>
                        <Row>
                            <FormGroup className='col-xs-12'>
                                {/*<ControlLabel>Notes</ControlLabel>*/}
                                <FormControl inputRef = {(notes) => this.notes = notes}
                                    componentClass='textarea' defaultValue={notesString} rows={12} />
                            </FormGroup>
                            
                            <FormGroup className='col-xs-12 col-sm-6'>
                                <Button block bsStyle='success' onClick={this.onSave}><h4><i className='fa fa-check' /> Done</h4></Button>
                            </FormGroup>
                            
                            <FormGroup className='col-xs-12 col-sm-6'>
                                <Button block onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                            </FormGroup>
                        </Row>
                    </form>
                </div>
                )}

                {this.state.notes && this.props.modal && (
                <Modal
                  show   = {!!this.state.notes}
                  onHide = {this.hideNotesModal}
                  backdrop = {true}>
                    <Modal.Header>
                        <Modal.Title>
                        {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.notes && (
                        <div>
                            <form>
                                <Row>
                                    <FormGroup className='col-xs-12'>
                                        {/*<ControlLabel>Notes</ControlLabel>*/}
                                        <FormControl inputRef = {(notes) => this.notes = notes}
                                            componentClass='textarea' defaultValue={notesString} rows={12} />
                                    </FormGroup>
                                    
                                    <FormGroup className='col-xs-12 col-sm-6'>
                                        <Button block bsStyle='success' onClick={this.onSave}><h4><i className='fa fa-check' /> Save</h4></Button>
                                    </FormGroup>
                                    
                                    <FormGroup className='col-xs-12 col-sm-6'>
                                        <Button block onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                                    </FormGroup>
                                </Row>
                            </form>
                        </div>
                        )}
                    </Modal.Body>
                </Modal>
                )}
            </div>
        )
    }
})
