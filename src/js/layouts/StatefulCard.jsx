import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'

import Slot from '../modules/slots/Slots.jsx'

const CARD_STATE_FLIP_DIRECTIONS = {
  NO_CHANGE: 'NO_CHANGE',
  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD'
}

const CardState = (props) => {
  return (
    <Fragment {...props} />
  )
}

/**
 * State should look something like...
 */
class StatefulCard extends Component {
  constructor(props) {
    super(props)

    const { children, activeState } = this.props

    let cardStates = []
    React.Children.map(children, (child) => {
      cardStates.push(child.props.name)
    })

    this.state = {
      cardStates: cardStates,
      previousState: null,
      // Set the default active state
      defaultActiveState: (typeof activeState !== 'undefined') ? activeState : cardStates[0],
      activeState: (typeof activeState !== 'undefined') ? activeState : cardStates[0],
      flipped: false,
      clicked: false
    }

    this.getNextCardStateFlipDirection = this.getNextCardStateFlipDirection.bind(this)
    this.setActiveState = this.setActiveState.bind(this)

    this.onCardFrontAnimationStart = this.onCardFrontAnimationStart.bind(this)
    this.onCardBackAnimationStart = this.onCardBackAnimationStart.bind(this)
    //this.onCardFrontAnimationEnd = this.onCardFrontAnimationEnd.bind(this)
    //this.onCardBackAnimationEnd = this.onCardBackAnimationEnd.bind(this)
  }

  onCardFrontAnimationStart(e) {
    let cardFront = ReactDOM.findDOMNode(this.cardFront)
    let cardBack = ReactDOM.findDOMNode(this.cardBack)

    //console.log('cardFront.onAnimationStart')

    if (e.currentTarget.classList.contains('flip-forward')) {
      e.currentTarget.style.position = 'relative'
    } else if (e.currentTarget.classList.contains('flip-backward')) {
      e.currentTarget.style.width = cardFront.offsetWidth + 'px'
      cardBack.style.width = cardFront.offsetWidth + 'px'
      e.currentTarget.style.position = 'absolute'
    }
  }

  onCardBackAnimationStart(e) {
    let cardFront = ReactDOM.findDOMNode(this.cardFront)
    let cardBack = ReactDOM.findDOMNode(this.cardBack)

    //console.log('cardBack.onAnimationStart')

    if (e.currentTarget.classList.contains('flip-forward')) {
      e.currentTarget.style.width = cardBack.offsetWidth + 'px'
      cardFront.style.width = cardBack.offsetWidth + 'px'
      e.currentTarget.style.position = 'absolute'
    } else if (e.currentTarget.classList.contains('flip-backward')) {
      e.currentTarget.style.position = 'relative'
    }
  }

  componentDidMount() {
    // Attach listeners to the cards, we can't accomplish the card flip animation using pure CSS
    // because firstly, there's no ability to animate the display property, and secondly because
    // although it is possible to do pure CSS card flips, we have to know the size of the card

    let cardFront = ReactDOM.findDOMNode(this.cardFront)
    let cardBack = ReactDOM.findDOMNode(this.cardBack)

    // TODO: This will currently only work in webkit browsers
    cardFront.addEventListener('webkitAnimationStart', this.onCardFrontAnimationStart)
    //cardFront.addEventListener('animationstart', this.onCardFrontAnimationStart)
    cardBack.addEventListener('webkitAnimationStart', this.onCardBackAnimationStart)
    //cardBack.addEventListener('animationstart', this.onCardBackAnimationStart)
  }

  componentWillUnmount() {
    let cardFront = ReactDOM.findDOMNode(this.cardFront)
    let cardBack = ReactDOM.findDOMNode(this.cardBack)

    // TODO: This will currently only work in webkit browsers
    cardFront.removeEventListener('webkitAnimationStart', this.onCardFrontAnimationStart)
    //cardFront.removeEventListener('animationstart', this.onCardFrontAnimationStart)
    cardBack.removeEventListener('webkitAnimationStart', this.onCardBackAnimationStart)
    //cardBack.removeEventListener('animationstart', this.onCardBackAnimationStart)
  }

  /**
   * Set an error boundary so a rendering failure in the component doesn't cascade.
   */
  componentDidCatch(error, info) {
    console.log('StatefulCard rendering error')
    console.log(error)
    console.log(info)
  }

  /**
   * TODO: I was having issues with this (handling multiple card faces is weird)... so I changed my approach.
   * @param prevState
   * @param nextState
   * @return {string}
   */
  getNextCardStateFlipDirection(prevState, nextState) {
    let prevStateIdx = this.state.cardStates.indexOf(prevState)
    let nextStateIdx = this.state.cardStates.indexOf(nextState)

    return (prevStateIdx === nextStateIdx) ? CARD_STATE_FLIP_DIRECTIONS.NO_CHANGE : (prevStateIdx < nextStateIdx) ? CARD_STATE_FLIP_DIRECTIONS.FORWARD : CARD_STATE_FLIP_DIRECTIONS.BACKWARD
  }

  setActiveState(cardState) {
    const { activeState, flipped } = this.state

    if (cardState !== activeState) {
      this.setState({
        // Store previous state, so we know which direction to flip
        clicked: true,
        flipped: !flipped,
        previousState: activeState,
        activeState: cardState
      })
    }
  }

  render() {
    const { children } = this.props
    let { defaultActiveState, activeState, previousState, flipped, clicked } = this.state

    let flipDirectionClassName = flipped ? 'flip-backward' : 'flip-forward'

    if (!clicked) flipDirectionClassName = null

    let cardFrontClassName = 'stateful-card-front'
    let cardBackClassName = 'stateful-card-back'

    if (flipDirectionClassName !== null) {
      cardFrontClassName = ['stateful-card-front', flipDirectionClassName].join(' ')
      cardBackClassName = ['stateful-card-back', flipDirectionClassName].join(' ')
    }

    let cardFrontState = undefined
    let cardFrontContent = undefined
    let cardBackState = undefined
    let cardBackContent = undefined

    React.Children.map(children, (child, idx) => {
      if (!flipped) {
        // If card hasn't been flipped, render new active state on the card's front side
        if (child.props.name === activeState) {
          cardFrontState = child.props.name
          cardFrontContent = child.props.children
        }

        if (child.props.name === previousState) {
          cardBackState = child.props.name
          cardBackContent = child.props.children
        }
      } else {
        // If card has been flipped, render new active state on the card's back side
        if (child.props.name === activeState) {
          cardBackState = child.props.name
          cardBackContent = child.props.children
        }

        if (child.props.name === previousState) {
          cardFrontState = child.props.name
          cardFrontContent = child.props.children
        }
      }
    })

    return (
      <div className='stateful-card'>
        <div
          ref={(cardFace) => this.cardFront = cardFace}
          className={cardFrontClassName}>
          <Slot role={cardFrontState} content={cardFrontContent} />
        </div>

        <div
          ref={(cardFace) => this.cardBack = cardFace}
          className={cardBackClassName}>
          <Slot role={cardBackState} content={cardBackContent} />
        </div>
      </div>
    )
  }
}

export default StatefulCard
export { CardState }
