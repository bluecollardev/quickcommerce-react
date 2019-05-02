import assign from 'object-assign'

import EventEmitter from 'events'

import LoginConstants from '../../constants/LoginConstants.jsx'
import BaseStore from '../../stores/BaseStore.jsx'
import StepDescriptor from './StepDescriptor.jsx'
//import jwt_decode from 'jwt-decode'

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

    return (initialData) => seq({
        reject
    }, initialData, !firsts.length)
}

class Stepper extends BaseStore {
    /**
     * @param {Function[]} steps - array of steps, which will be treated
     * @param {Function} [onReject] - callback, which will be executing on some step
     * */
    constructor(steps, onReject = () => null) {
        super()
        
        this.items = {}
        this.selection = []
        this.nextKey = 0
        this.steps = []
        this.reject = null
        this.currentStep = -1
        
        // TODO: Type check?
        steps = steps || null
        if (steps !== null) {
            steps.forEach((step) => this.add(step))
        }
        
        this.reject = onReject
        
       
        //this.subscribe(() => this.registerToActions.bind(this))
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
     * @param {*} [data]
     * @param {StepDescriptor} [stepDescriptor]
     * */
    next(data = null, stepDescriptor = null) {
        if (stepDescriptor) {
            this.currentStep = this.getIndex(stepDescriptor)
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
     * @param {StepDescriptor} stepDescriptor
     * @return {StepDescriptor}
     * */
    prev(stepsCount = 1, stepDescriptor = null) {
        stepDescriptor = stepDescriptor || false
        if (stepDescriptor === false) return // Fail silently
        
        return this.steps[this.getIndex(stepDescriptor) - stepsCount]
    }
    
    /**
     * TODO: Refine this
     */
    load(stepDescriptor = null, data, isEnded = false, onSuccess) {
        stepDescriptor = stepDescriptor || false
        if (stepDescriptor === false) return
        if (!this.before(stepDescriptor.config.stepId, stepDescriptor, data)) return
        
        let prev = this.getStep(this.getIndex(stepDescriptor) - 1) || null
        if (prev !== null) {
            if (this.validate(prev.config.stepId, prev, data)) {
                stepDescriptor.execute(data, isEnded)
                this.currentStep = this.getIndex(stepDescriptor)
                
                if (typeof onSuccess === 'function') {
                    onSuccess(stepDescriptor, data)
                }
                
                return true
            } else {
                return false
            }
        } else {
            stepDescriptor.execute(data, isEnded)
            this.currentStep = this.getIndex(stepDescriptor)
            
            if (typeof onSuccess === 'function') {
                onSuccess(stepDescriptor, data)
            }
            
            return true
        }
    }
    
    before(stepId = null, stepDescriptor = null, data) {
        let fn = stepDescriptor.before
        let success = false
        
        if (typeof fn === 'function') {
            // Check method must return bool
            // If the callback doesn't explicitly return true, fail the step
            success = fn(stepId, stepDescriptor, data) || false
        } else {
            // If a callback isn't provided, just move on to the next step
            return true
        }
        
        return success
    }
    
    validate(stepId = null, stepDescriptor = null, data) {
        let fn = stepDescriptor.validate
        let success = false
        
        if (typeof fn === 'function') {
            // Check method must return bool
            // If the callback doesn't explicitly return true, fail the step
            success = fn(stepId, stepDescriptor, data) || false
        } else {
            // If a callback isn't provided, just move on to the next step
            return true
        }
        
        return success
    }

    /**
     * @param {StepDescriptor} stepDescriptor
     * @return {Number}
     * */
    getIndex(stepDescriptor) {
        let index = this.steps.findIndex((step) => step.id === stepDescriptor.id)

        if (index === -1) {
            throw new Error('Cannot find step in steps array')
        } else {
            return index
        }
    }
    
    setSteps(steps) {
        steps.forEach((step) => this.add(step))
    }
    
    /**
     * @return [{StepDescriptor}]
     * */
    getSteps() {
        return this.steps
    }

    /**
     * @param {Number} index - position in steps array
     * @return {StepDescriptor}
     * */
    getStep(index) {
        return this.steps[index]
    }
    
    getStepById(stepId) {
        // Get the BrowserStepDescriptor stepDescriptor by stepId (shop|cart|checkout|etc).
        // We can't get it by index because the Step argument for this method is the config prop 
        // provided to the Step component, not an stepDescriptor of BrowserStepDescriptor.
        // Maybe I'll change this later...
        let stepDescriptor = null
        
        for (let idx = 0; idx < this.steps.length; idx++) {
            if (this.steps[idx].config.stepId === stepId) {
                stepDescriptor = this.steps[idx]
            }
        }
        
        return stepDescriptor
    }

    /**
     * @param {StepDescriptor} stepDescriptor - descriptor of the step before which will be inserted a new step
     * @param {Function} step - callback for the new step descriptor
     * @return {StepDescriptor}
     * */
    insertBefore(stepDescriptor, step) {
        return this.add(step, this.getIndex(stepDescriptor))
    }

    /**
     * @param {StepDescriptor} stepDescriptor - descriptor of the step after which will be inserted a new step
     * @param {Function} step - callback for the new step descriptor
     * @return {StepDescriptor}
     * */
    insertAfter(stepDescriptor, step) {
        return this.add(step, this.getIndex(stepDescriptor) + 1)
    }
    
    /**
     * @param {Function} step
     * @param {Number} index
     * @return {StepDescriptor}
     * */
    add(step, index = null) {
        const stepDescriptor = new StepDescriptor(step, this)

        if (index == null) {
            this.steps.push(stepDescriptor)
        } else {
            this.steps.splice(index, 0, stepDescriptor)
        }

        return stepDescriptor
    }
    
    /**
     * @param {StepDescriptor} stepDescriptor
     * */
    remove(stepDescriptor) {
        this.steps.splice(this.getIndex(stepDescriptor), 1)
    }

    /**
     * @param {StepDescriptor} firstStepDescriptor
     * @param {StepDescriptor} secondStepDescriptor
     * */
    swap(firstStepDescriptor, secondStepDescriptor) {
        const firstIndex = this.getIndex(firstStepDescriptor)
        const secondIndex = this.getIndex(secondStepDescriptor)

        this.steps.splice(firstIndex, 1, secondStepDescriptor)
        this.steps.splice(secondIndex, 1, firstStepDescriptor)
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

export default Stepper