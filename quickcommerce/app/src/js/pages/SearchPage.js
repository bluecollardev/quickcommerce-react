import React, { Component } from 'react';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Card from 'grommet/components/Card';
import Hero from 'grommet/components/Hero';
import Paragraph from 'grommet/components/Paragraph';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Section from 'grommet/components/Section';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio, } from 'react-bootstrap';

//import Header from './Header';
import NewsFeed from './NewsFeed';

export default class SearchPage extends Component {
  render() {
    return (
      <Box>
        <Section>
            <Box>
                <Navbar collapseOnSelect>
                    <Navbar.Header>
                      <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                      <Navbar.Form pullLeft>
                        <FormGroup>
                          <FormControl type="text" placeholder="Search" />
                        </FormGroup>
                        {' '}
                        <Button type="submit">Submit</Button>
                      </Navbar.Form>
                      <Nav>
                        <NavDropdown eventKey={1} title="Formats" id="nav-formats">
                          <MenuItem eventKey={1.1}><Checkbox>Individual</Checkbox></MenuItem>
                          <MenuItem eventKey={1.2}><Checkbox>Pods</Checkbox></MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey={1.2}><Checkbox>Wholesale</Checkbox></MenuItem>
                        </NavDropdown>
                        <NavDropdown eventKey={2} title="Roasts" id="nav-roasts">
                          <MenuItem eventKey={2.1}><Checkbox>All</Checkbox></MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey={2.2}><Checkbox>Bold</Checkbox></MenuItem>
                          <MenuItem eventKey={2.3}><Checkbox>Medium</Checkbox></MenuItem>
                          <MenuItem eventKey={2.4}><Checkbox>Mild</Checkbox></MenuItem>
                        </NavDropdown>
                        <NavDropdown eventKey={3} title="Caffeine Level" id="nav-caffeine">
                          <MenuItem eventKey={3.1}>All</MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey={3.2}>Decaf</MenuItem>
                        </NavDropdown>
                        <NavDropdown eventKey={4} title="Certifications" id="nav-certs">
                          <MenuItem eventKey={4.1}>All</MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey={4.2}>Fair Trade</MenuItem>
                          <MenuItem eventKey={4.3}>Organic</MenuItem>
                        </NavDropdown>
                        <NavDropdown eventKey={5} title="Grind" id="nav-grind">
                          <MenuItem eventKey={5.1}>All</MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey={5.2}>Ground</MenuItem>
                          <MenuItem eventKey={5.3}>Whole Bean</MenuItem>
                        </NavDropdown>
                      </Nav>
                      <Nav pullRight>
                        <NavItem eventKey={1} href="#">Name</NavItem>
                        <NavItem eventKey={2} href="#">Price</NavItem>
                      </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Box>
            
            <Tiles
              selectable={true}>
              <Tile separator='top'
                align='start'
                basis='1/3'>
                <Card thumbnail='https://grommet.github.io/docs/card/img/carousel-1.png'
                  label='ACE'
                  heading='Sample Heading'
                  description='Sample description providing more details.'
                  link={<Anchor href=''
                  label='Sample anchor' />} />
              </Tile>
              <Tile separator='top'
                align='start'
                basis='1/3'>
                <Card thumbnail='https://grommet.github.io/docs/card/img/carousel-1.png'
                  label='ACE'
                  heading='Sample Heading'
                  description='Sample description providing more details.'
                  link={<Anchor href=''
                  label='Sample anchor' />} />
              </Tile>
              <Tile separator='top'
                align='start'
                basis='1/3'>
                <Card thumbnail='https://grommet.github.io/docs/card/img/carousel-1.png'
                  label='ACE'
                  heading='Sample Heading'
                  description='Sample description providing more details.'
                  link={<Anchor href=''
                  label='Sample anchor' />} />
              </Tile>
              <Tile separator='top'
                align='start'
                basis='1/3'>
                <Card thumbnail='https://grommet.github.io/docs/card/img/carousel-1.png'
                  label='ACE'
                  heading='Sample Heading'
                  description='Sample description providing more details.'
                  link={<Anchor href=''
                  label='Sample anchor' />} />
              </Tile>
              <Tile separator='top'
                align='start'
                basis='1/3'>
                <Card thumbnail='https://grommet.github.io/docs/card/img/carousel-1.png'
                  label='ACE'
                  heading='Sample Heading'
                  description='Sample description providing more details.'
                  link={<Anchor href=''
                  label='Sample anchor' />} />
              </Tile>
            </Tiles>
        </Section>
      </Box>
    );
  }
};