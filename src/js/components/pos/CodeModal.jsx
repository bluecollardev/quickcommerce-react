import React, { Component } from 'react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class CodeModal extends Component {
	constructor(props) {
        super(props)
        
        this.showCodeModal = this.showCodeModal.bind(this)
        this.hideCodeModal = this.hideCodeModal.bind(this)
    }
    
    showCodeModal() {
        this.setState({ code: 1 })
    }
    
    hideCodeModal() {
        this.setState({ code: null })
    }
    
    render() {
		return (
			<Modal
                show   = {!!this.state.code}
                onHide = {this.hideCodeModal}>
                <Modal.Header>
                    <Modal.Title>
                        Enter code
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.code && (
                        <div>
                            <Alert bsStyle='warning'>
                                Please enter the item code. <i className='fa fa-smile-o' />
                            </Alert>
                            <Button block onClick={this.hideCodeModal}>Ok</Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
		)
	}
}