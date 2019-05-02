class StepDescriptor {
    /**
     * @param {Function} step - action, which will be carried out in the executing of this step
     * @param {Stepper} stepper - instance of Stepper, which contains this StepDescriptor
     * */
    constructor(step, stepper) {
        this.id = StepDescriptor.ID_COUNTER
        StepDescriptor.ID_COUNTER++

        this.stepper = stepper
        this.action = step
        this.execute = (data, done) => step(this, data, done)
    }

    /**
     * @param {*} [data]
     * */
    next(data) {
        this.stepper.next(data, this)
    }

    prev(data) {
        data = data || 1
        this.stepper.prev(data, this)
    }

    remove() {
        this.stepper.remove(this)
    }
    
    /**
     * @param {*} data
     * */
    reject(data) {
        this.stepper.reject(data)
    }
    
    /**
     * @param {Function} step
     * @return {StepDescriptor}
     * */
    insertAfter(step) {
        this.stepper.insertAfter(this, step)
    }

    /**
     * @param {Function} step
     * @return {StepDescriptor}
     * */
    insertBefore(step) {
        this.stepper.insertBefore(this, step)
    }
}

StepDescriptor.ID_COUNTER = 0

export default StepDescriptor