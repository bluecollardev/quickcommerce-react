import Stepper from '../stepper/BrowserStepper.jsx'

class fullComponent {
  registerDecorators() {
    this.configureSteps = this.configureSteps.bind(this)
    this.setStep = this.setStep.bind(this)

    this.stepClicked = this.stepClicked.bind(this)
  }

  componentDidMount() {
    let settings = this.props.settingStore.getSettings().posSettings

    settings['pinned_category_id'] = null // 'New' category
    let categoryId = null

    // Load categories
    this.props.actions.catalog.loadTopCategories()

    /*if (typeof this.topCategoryBrowser !== 'undefined') {
     console.log('TOP CATEGORY BROWSER')
     console.log(this.topCategoryBrowser)
     this.topCategoryBrowser.actions.loadTopCategories() // Browser load categories via refs
     }*/

    if (typeof this.props.match !== 'undefined' && typeof this.props.match.params !== 'undefined' && typeof this.props.match.params.cat !== 'undefined' && !isNaN(this.props.match.params.cat)) {
      console.log('load category id: ' + this.props.match.params.cat)
      categoryId = parseInt(this.props.match.params.cat)
    } else if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
      categoryId = parseInt(settings['pinned_category_id'])
    }

    // Just load browser products, don't trigger any steps
    this.catalogBrowser.actions.loadProducts(categoryId)
  }

  setStep(stepId, stepDescriptor, data) {
    data = data || null
    let title = (data !== null && data.hasOwnProperty('name')) ? data.name : ''
    let price = (data !== null && data.hasOwnProperty('price') && !isNaN(data.price)) ? Number(data.price).toFixed(2) : 0.00

    this.setState({
      step: stepId,
      title: title,
      itemPrice: price,
      item: data
    })
  }

  stepClicked(stepProps) {
    // Get the BrowserStepDescriptor instance by stepId (shop|cart|checkout|etc).
    // We can't get it by index because the Step argument for this method is the config prop
    // provided to the Step component, not an instance of BrowserStepDescriptor.
    // Maybe I'll change this later...
    if (this.stepper.getSteps() instanceof Array) {
      let stepDescriptor = this.stepper.getStepById(stepProps.stepId) || null

      if (stepDescriptor !== null) {
        let data = {}
        let isEnded = false
        // Execute the step handler
        this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepProps.stepId))

      }
    }
  }

  categoryFilterSelected(categoryId, e) {
    categoryId = (!Number.isNaN(parseInt(categoryId))) ? parseInt(categoryId) : null // Ensure conversion

    let stepId = 'cart'
    let stepDescriptor = this.stepper.getStepById(stepId) || null

    if (stepDescriptor !== null) {
      let data = {category_id: categoryId}

      let isEnded = false
      // Execute the step handler
      this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
    }
  }
}
