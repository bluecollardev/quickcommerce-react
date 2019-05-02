/**
 * This file is a wrapper that allows for isomorphic rendering of the application, and is also the main entry point for webpack.
 * You can include any MainComponent. Here, we're including the QuickCommerce app itself.
 * Don't forget to wrap the app (at the top level) with our Material UI Theme provider.
 */
if (!global.setTimeout) {
    global.setTimeout = function() {}
}

if (!global.setInterval) {
    global.setInterval = function() {}
}

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {renderToString} from 'react-dom/server'

import Paper from 'material-ui/Paper'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
const theme = createMuiTheme()

import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'

import {
    OccupationAutocomplete,
    CountryAutocomplete,
    ZoneAutocomplete,
    CustomerAutocomplete,
    CustomerGroupAutocomplete,
    OrderStatusAutocomplete,
    LanguageAutocomplete,
    StoreAutocomplete
} from '../components/form/Autocomplete.jsx'

import {
    SelectList,
    ContactTypeDropdown,
    IdTypeDropdown,
    CustomerRelationDropdown,
    SalutationDropdown,
    SuffixDropdown,
    GenderDropdown,
    MaritalDropdown,
    ResidenceTypeDropdown,
    EmploymentTypeDropdown,
    IncomeTypeDropdown,
    FrequencyDropdown,
    AssetTypeDropdown,
    LiabilityTypeDropdown,
    StreetTypeDropdown,
    StreetDirDropdown
} from '../components/form/Dropdown.jsx'

import {
    SelectButton,
    ContactTypeButton,
    IdTypeButton,
    CustomerRelationButton,
    SalutationButton,
    SuffixButton,
    GenderButton,
    MaritalButton,
    ResidenceTypeButton,
    EmploymentTypeButton,
    IncomeTypeButton,
    FrequencyButton,
    AssetTypeButton,
    LiabilityTypeButton,
    StreetTypeButton,
    StreetDirButton
} from '../components/form/Dropdown.jsx'

import {
    DateInput,
    DateTimeInput,
    TimeInput,
    NumericInput,
    TelephoneInput,
    EmailInput,
    PostalCodeInput,
    SinInput,
    SsnInput
} from '../components/form/Input.jsx'

/* TODO: Functional components
if ('undefined' !== typeof document) {
    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <MainComponent />
        </MuiThemeProvider>,
        document.getElementById('main')
    )
} else {
    print(renderToString(
        <MuiThemeProvider theme={theme}>
            <MainComponent />
        </MuiThemeProvider>
    ))
}*/

// Choice between Bootstrap and Modal UI

import SettingStore from '../stores/SettingStore.jsx'
import SettingActions from '../actions/SettingActions.jsx'

SettingStore.on('settings-loaded', () => {
    try {
        // Just a comment to reference in debugger
        if ('undefined' !== typeof document) {
            ReactDOM.render(
                <MuiThemeProvider theme={theme}>
                    <Paper>
                        <div className='container'>
                            <Row>
                                <Col xs={12}>
                                    <FormGroup>
                                        <ControlLabel>Date</ControlLabel>
                                        <DateInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>DateTime</ControlLabel>
                                        <DateTimeInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Time</ControlLabel>
                                        <TimeInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Numeric</ControlLabel>
                                        <NumericInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Telephone</ControlLabel>
                                        <TelephoneInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Email</ControlLabel>
                                        <EmailInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Postal Code</ControlLabel>
                                        <PostalCodeInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Social Insurance Number</ControlLabel>
                                        <SinInput />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Social Security Number</ControlLabel>
                                        <SsnInput />
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/*<Row>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Contact Type</ControlLabel>
                                    <ContactTypeDropdown 
                                        items = {SettingStore.contactTypes}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Contact Type</ControlLabel>
                                    <ContactTypeButton mode='split' 
                                        items = {SettingStore.contactTypes}
                                        />
                                </FormGroup>
                            </Row>
                            <Row>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>ID Type</ControlLabel>
                                    <IdTypeDropdown
                                        items = {SettingStore.idTypes}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>ID Type</ControlLabel>
                                    <IdTypeButton mode='split' 
                                        items = {SettingStore.idTypes}
                                        />
                                </FormGroup>
                            </Row>*/}
                            <Row>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Relationship</ControlLabel>
                                    <CustomerRelationDropdown />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Relationship</ControlLabel>
                                    <CustomerRelationButton mode='split' />
                                </FormGroup>
                            </Row>
                            {/*<Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Salutation</ControlLabel>
                                    <SalutationDropdown 
                                        items = {SettingStore.salutations}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Salutation</ControlLabel>
                                    <SalutationButton mode='split' 
                                        items = {SettingStore.salutations}
                                        />
                                </FormGroup>
                            </Row>*/}
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Suffix</ControlLabel>
                                    <SuffixDropdown />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Suffix</ControlLabel>
                                    <SuffixButton mode='split' />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Gender</ControlLabel>
                                    <GenderDropdown 
                                        items = {SettingStore.genderTypes}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Gender</ControlLabel>
                                    <GenderButton mode='split' 
                                        items = {SettingStore.genderTypes}
                                        />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Marital Status</ControlLabel>
                                    <MaritalDropdown />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Marital Status</ControlLabel>
                                    <MaritalButton mode='split' />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Residence Type</ControlLabel>
                                    <ResidenceTypeDropdown />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Residence Type</ControlLabel>
                                    <ResidenceTypeButton mode='split' />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Frequency</ControlLabel>
                                    <FrequencyDropdown 
                                        items = {SettingStore.paymentFrequencies}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Frequency</ControlLabel>
                                    <FrequencyButton mode='split' 
                                        items = {SettingStore.paymentFrequencies}
                                        />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Income Type</ControlLabel>
                                    <IncomeTypeDropdown 
                                        items = {SettingStore.incomeTypes}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Income Type</ControlLabel>
                                    <IncomeTypeButton mode='split' 
                                        items = {SettingStore.incomeTypes}
                                        />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Employment Type</ControlLabel>
                                    <EmploymentTypeDropdown 
                                        items = {SettingStore.employmentTypes}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Employment Type</ControlLabel>
                                    <EmploymentTypeButton mode='split' 
                                        items = {SettingStore.employmentTypes}
                                        />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Asset Type</ControlLabel>
                                    <AssetTypeDropdown 
                                        items = {SettingStore.assetLiabilityTypes}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Asset Type</ControlLabel>
                                    <AssetTypeButton mode='split' 
                                        items = {SettingStore.assetLiabilityTypes}
                                        />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Liability Type</ControlLabel>
                                    <LiabilityTypeDropdown 
                                        items = {SettingStore.assetLiabilityTypes}
                                        />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Liability Type</ControlLabel>
                                    <LiabilityTypeButton mode='split' 
                                        items = {SettingStore.assetLiabilityTypes}
                                        />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Street Type</ControlLabel>
                                    <StreetTypeDropdown />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Street Type</ControlLabel>
                                    <StreetTypeButton mode='split' />
                                </FormGroup>
                            </Row>
                            <Row>    
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Street Direction</ControlLabel>
                                    <StreetDirDropdown />
                                </FormGroup>
                                <FormGroup className='col-sm-6'>
                                    <ControlLabel>Street Direction</ControlLabel>
                                    <StreetDirButton mode='split' />
                                </FormGroup>
                            </Row>
                        </div>
                    </Paper>
                </MuiThemeProvider>,
                document.getElementById('main')
            )
        } else {
            print(renderToString(
                <MuiThemeProvider theme={theme}>
                    <MainComponent />
                </MuiThemeProvider>
            ))
        }
    } catch (err) {
        console.log(JSON.stringify(err))
    }
})

SettingActions.fetchSettings()