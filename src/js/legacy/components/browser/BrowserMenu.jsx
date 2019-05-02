import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

class Step extends Component {
    constructor(props) {
        super(props)
        
        this.onStepClicked = this.onStepClicked.bind(this)
    }
    
    /**
     * Only executed if the step passes validation
     */
    onStepClicked(step) {
        if (this.props.hasOwnProperty('onStepClicked') && 
            typeof this.props.onStepClicked === 'function') {
            
            // Wrap the function in a generic handler so we can pass in custom args
            let callback = this.props.onStepClicked
            callback(arguments[0])
            
            //this.props.stepper.setStep(this.props.stepper.getIndex(arguments[0]))
        }
    }
    
    render() {
        let isActive = (this.props.activeStep === this.props.stepId) ? 'is-active' : null
        let stepClass = ['StepIndicator__step', isActive].join(' ').trim()
        
        return (
            <div className={stepClass} onClick={this.onStepClicked.bind(this, this.props)}>
                <div className='StepIndicator__indicator'>
                    <span className='StepIndicator__info'>{this.props.indicator}</span>
                </div>
                <div className='StepIndicator__label'>{this.props.title}</div>
                <div className='StepIndicator__panel'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class StepIndicator extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div className='StepIndicator' 
                //className={`StepIndicator ${props.isVertical ? 'StepIndicator--vertical' : ''} ${props.isInline ? 'StepIndicator--inline' : ''}`}
                >
                {this.props.children}
            </div>
        )
    }
}

export default class BrowserMenu extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            currentTabIndex: 0,
            activeStep: props.activeStep
        }
        
        this.renderSteps = this.renderSteps.bind(this)
    }
    
    renderSteps() {
        let that = this
        let steps = []
        let renderStep = function (step, idx) {
            steps.push(
                <Step
                    key = {idx}
                    stepId = {step.config.stepId}
                    indicator = {step.config.indicator} 
                    title = {step.config.title}
                    activeStep = {that.props.activeStep}
                    onStepClicked = {that.props.onStepClicked}>
                    <div className='step-content'></div>
                </Step>
            )
        }
        
        if (this.props.steps instanceof Array) {
            for (let idx = 0; idx < this.props.steps.length; idx++) {
                renderStep(this.props.steps[idx], idx)
            }            
        }
        
        return (
            <StepIndicator>
                {steps}
            </StepIndicator>
        )
    }
    
    render() {
        if (typeof this.props.activeStep !== 'undefined') {
            let steps = this.renderSteps()
            
            return (
                <div className='browser-container'>
                    <div className='browser-content'>
                        {steps}
                    </div>
                </div>
            )
        } else {
            return (
                <div className='browser-container'>
                    <div className='browser-content'></div>
                </div>
            )
        }
    }   
}



