/**
 * This file is a wrapper that allows for isomorphic rendering of the application, and is also the main entry point for webpack.
 * You can include any MainComponent. Here, we're including the QuickCommerce app itself.
 */
if (!global.setTimeout) {
    global.setTimeout = function() {};
}

if (!global.setInterval) {
    global.setInterval = function() {};
}

import React from 'react';
import ReactDOM from 'react-dom';
import {renderToString} from 'react-dom/server';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'

import ProductPage from './pages/ProductPage'
import CategoryPage from './pages/CategoryPage'

if ('undefined' !== typeof document) {
    ReactDOM.render(
        <Tabs id='ui-tabs'>
            <Tab eventKey={3} title='Product'>
                <Row>
                    <Col sm={12}>
                        <ProductPage />
                    </Col>
                </Row>
            </Tab>

            <Tab eventKey={4} title='Category'>
                <Row>
                    <Col sm={12}>
                        <CategoryPage />
                    </Col>
                </Row>
            </Tab>
        </Tabs>,
        document.getElementById('qc-catalog')
    )
}
