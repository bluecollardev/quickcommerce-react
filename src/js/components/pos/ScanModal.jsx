import React, { Component } from 'react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class ScanModal extends Component {
	constructor(props) {
        super(props)
        
        this.showScanModal = this.showScanModal.bind(this)
        this.hideScanModal = this.hideScanModal.bind(this)
    }
    
    showScanModal() {
        this.setState({ scan: 1 })
    }
    
    hideScanModal() {
        this.setState({ scan: null })
    }
    
    render() {
		return (
			<Modal
                show   = {!!this.state.scan}
                onHide = {this.hideScanModal}>
                <Modal.Header>
                    <Modal.Title>
                        Scan item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.scan && (
                        <div>
                            <Alert bsStyle='warning'>
                                Please scan your item. <i className='fa fa-barcode' />
                            </Alert>
                            <Button block onClick={this.hideScanModal}>Ok</Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
		)
	}
}