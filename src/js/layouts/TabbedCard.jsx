import React, { Component, Fragment } from 'react'

import { Tabs } from 'react-bootstrap'

const TabbedCardToolbar = (props) => {
  return (
    <Fragment {...props} />
  )
}

const TabbedCardTab = (props) => {
  return (
    <Fragment {...props} />
  )
}

/**
 * State should look something like...
 */
class TabbedCard extends Component {
  constructor(props) {
    super(props)

    const { children, activeTab } = this.props

    let tabs = []
    React.Children.map(children, (child) => {
      if (child && child.props && child.props.hasOwnProperty('name')) {
        tabs.push(child.props.name)
      }
    })

    this.state = {
      tabs: tabs,
      activeTab: (typeof activeTab !== 'undefined') ? activeTab : tabs[0],
    }

    this.changeTabs = this.changeTabs.bind(this)
  }

  /**
   * Set an error boundary so a rendering failure in the component doesn't cascade.
   */
  componentDidCatch(error, info) {
    console.log('TabbedCard rendering error')
    console.log(error)
    console.log(info)
  }

  changeTabs(e, tab) {
    this.setState({ activeTab: tab })
  }

  render() {
    const { children, tabsId } = this.props
    const { activeTab } = this.state

    return (
      <div className='tabbed-card'>
        <div
          ref={(toolbar) => this.toolbar = toolbar}
          className='tabbed-card-toolbar'>
          {React.Children.map(children, (child, idx) => {
            if (child && child.type === TabbedCardToolbar) {
              return React.cloneElement(child, { key: idx })
            }
          })}
        </div>

        <Tabs
          id={tabsId}
          value={activeTab}
          onChange={this.changeTabs}
          style={{ display: 'none' }}>
        </Tabs>

        {React.Children.map(children, (child, idx) => {
          if (child && child.type === TabbedCardTab && child.props.name === activeTab) {
            return React.cloneElement(child)
          }
        })}
      </div>
    )
  }
}

export default TabbedCard
export { TabbedCardTab, TabbedCardToolbar }
