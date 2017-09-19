import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export class Browser {
  /**
   * @param {Function[]} steps - array of steps, which will be treated
   * @param {Function} [onReject] - callback, which will be executing on some step
   * */
  constructor(steps, onReject = () => null) {
    this.steps = []
    this.reject
    this.currentStep = -1
    
    steps.forEach((step) => this.add(step))
    this.reject = onReject
  }

  /**
   * @param {*} [data]
   * @param {StepAction} [stepAction]
   * */
  next(data = null, stepAction = null) {
    if (stepAction) {
      this.currentStep = this.getIndex(stepAction)
    }

    if (this.currentStep++ < this.steps.length - 1) {
      let isEnded = this.currentStep === this.steps.length - 1

      this.steps[this.currentStep].execute(data, isEnded)
    } else {
      throw new Error('Steps executing are ended. You cannot call "next" method.')
    }
  }

  /**
   * @param {Number} stepsCount - distance to step back
   * */
  prev(stepsCount = 1) {
    this.currentStep -= stepsCount
  }

  /**
   * Start execution a queue from start
   * @param {*} data
   * */
  start(data) {
    this.currentStep = -1
    this.next(data)
  }

  /**
   * @param {StepAction} stepAction
   * */
  remove(stepAction) {
    this.steps.splice(this.getIndex(stepAction), 1)
  }

  /**
   * @param {Function} step
   * @param {Number} index
   * @return {StepAction}
   * */
  add(step, index = null) {
    const stepAction = new StepAction(step, this)

    if (index == null) {
      this.steps.push(stepAction)
    } else {
      this.steps.splice(index, 0, stepAction)
    }

    return stepAction
  }

  /**
   * @param {StepAction} stepAction
   * @return {Number}
   * */
  getIndex(stepAction) {
    let index = this.steps.findIndex((step) => step.id === stepAction.id)

    if (index === -1) {
      throw new Error('Cannot find step in steps array')
    } else {
      return index
    }
  }

  /**
   * @param {Number} index - position in steps array
   * @return {StepAction}
   * */
  getStep(index) {
    return this.steps[index]
  }

  /**
   * @param {StepAction} stepAction - descriptor of the step before which will be inserted a new step
   * @param {Function} step - callback for the new step descriptor
   * @return {StepAction}
   * */
  insertBefore(stepAction, step) {
    return this.add(step, this.getIndex(stepAction) - 1)
  }

  /**
   * @param {StepAction} stepAction - descriptor of the step after which will be inserted a new step
   * @param {Function} step - callback for the new step descriptor
   * @return {StepAction}
   * */
  insertAfter(stepAction, step) {
    return this.add(step, this.getIndex(stepAction) + 1)
  }

  /**
   * Treats steps and return a sequence of all steps. It can not be edited.
   * In every step arguments will be a Object with "next" and "reject" methods.
   * @return {Function} first step
   * */
  sequence() {
    return sequence(this.steps.map(step => step.raw), this.reject)
  }
}

/**
 * @param {Function[]} steps
 * @param {Function} [reject]
 * */
export function sequence(steps, reject = () => null) {
  let [last, ...firsts] = steps.slice().reverse()
  let seq = firsts.reduce((nextStep, step, index) =>
    (comingStep, data, done) =>
      step({
        next: (nextData) => nextStep(comingStep, nextData, index === 0),
        reject
      }, data, done), last)

  return (initialData) => seq({reject}, initialData, !firsts.length)
}

export class ProductSubscriptionBrowser {}

export class ListingBrowser {}

export class PropertyListingBrowser {}

export class VestProductBrowser {}

export class ProductOption {}

export class ProductAttribute {}

export class ProductCategory {}

export class ProductPricing {}

export class ProductTax {}

/**
 * Mixins as subclass factories
 * Why?
 * Subclasses can override mixin methods
 * Super works
 * Composition is preserved
 * Composition is preserved
 */
 
 //http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
let Mixin1 = (superclass) => class extends superclass {  
  foo() {
    console.log('foo from Mixin1')
    if (super.foo) super.foo()
  }
}

let Mixin2 = (superclass) => class extends superclass {  
  foo() {
    console.log('foo from Mixin2')
    if (super.foo) super.foo()
  }
}

class S {  
  foo() {
    console.log('foo from S')
  }
}

class C extends Mixin1(Mixin2(S)) {  
  foo() {
    console.log('foo from C')
    super.foo()
  }
}

// Decorators
// http://justinfagnani.com/2016/01/07/enhancing-mixins-with-decorator-functions/

