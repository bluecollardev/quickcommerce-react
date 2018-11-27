import StepDescriptor from '../../modules/stepper/StepDescriptor.jsx'

/**
 * Overrides the base constructor method of the StepDescriptor module so we can attach some extra data
 * We don't want to call super on the parent, which ES6 won't allow, so we're gonna do this the traditional way
 * This component is not currently compatible with the Stepper module and MUST be used in conjunction with the ActionStepper component
 */

/**
 * @param {Object} {step.config, step.action}
 * @param {Stepper} stepper - instance of Stepper, which contains this StepDescriptor
 */
class ActionStepDescriptor extends StepDescriptor {
  static ID_COUNTER = 0

  constructor(step, stepper) {
    super(step)

    this.id = ActionStepDescriptor.ID_COUNTER
    ActionStepDescriptor.ID_COUNTER++

    this.stepper = stepper
    this.config = step.config
    this.before = step.before // Executes before we grab the store instance
    this.validate = step.validate // Executes before we fire the action
    this.action = step.action
    this.after = step.after
    this.stepForward = step.stepForward,
    this.stepBackward = step.stepBackward,
    this.execute = (data, done) => {
      this.action(this, data, done)
    }
  }
}

export default ActionStepDescriptor
