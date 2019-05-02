import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

export default class FilterBar extends Component {
    render() {
        return (
            <Row>
                <Col sm={12}>
                    <Navbar collapseOnSelect fluid>
                        <Navbar.Header>
                          <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse style={{overflow: 'visible'}}>
                            {/*<Navbar.Form pullLeft>
                                <FormGroup>
                                  <FormControl type="text" placeholder="Search" />
                                </FormGroup>
                                {' '}
                                <Button type="submit">Submit</Button>
                            </Navbar.Form>*/}
                            <Nav className='multi-filter-panel' justified>
                                <NavDropdown eventKey={1} title='Package Type' id='nav-package-type'>
                                  <MenuItem eventKey={1.1}><Checkbox>Individual</Checkbox></MenuItem>
                                  <MenuItem eventKey={1.2}><Checkbox>Pods</Checkbox></MenuItem>
                                  <MenuItem divider />
                                  <MenuItem eventKey={1.2}><Checkbox>Wholesale</Checkbox></MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={2} title='Roasts' id='nav-roasts'>
                                  <MenuItem eventKey={2.1}><Checkbox>All</Checkbox></MenuItem>
                                  <MenuItem divider />
                                  <MenuItem eventKey={2.2}><Checkbox>Bold</Checkbox></MenuItem>
                                  <MenuItem eventKey={2.3}><Checkbox>Medium</Checkbox></MenuItem>
                                  <MenuItem eventKey={2.4}><Checkbox>Mild</Checkbox></MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={5} title='Grind' id='nav-grind'>
                                  <MenuItem eventKey={5.1}><Checkbox>All</Checkbox></MenuItem>
                                  <MenuItem divider />
                                  <MenuItem eventKey={5.2}><Checkbox>Ground</Checkbox></MenuItem>
                                  <MenuItem eventKey={5.3}><Checkbox>Whole Bean</Checkbox></MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={5} title='Sort By' id='nav-sort'>
                                  <MenuItem eventKey={5.1}><Checkbox>Featured</Checkbox></MenuItem>
                                  <MenuItem divider />
                                  <MenuItem eventKey={5.2}><Checkbox>Name - A-Z</Checkbox></MenuItem>
                                  <MenuItem eventKey={5.2}><Checkbox>Name - Z-A</Checkbox></MenuItem>
                                  <MenuItem eventKey={5.2}><Checkbox>Price - Low to High</Checkbox></MenuItem>
                                  <MenuItem eventKey={5.2}><Checkbox>Price - High to Low</Checkbox></MenuItem>
                                  <MenuItem eventKey={5.2}><Checkbox>Roast - Dark to Light</Checkbox></MenuItem>
                                  <MenuItem eventKey={5.2}><Checkbox>Roast - Light to Dark</Checkbox></MenuItem>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        )
    }
}