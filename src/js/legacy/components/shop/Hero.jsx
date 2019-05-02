import assign from 'object-assign'

import React, { Component } from 'react'
import OwlCarousel from 'react-owl-carousel'

export default class Hero extends Component {
    render() {
        /* Data API:
        data-loop="true/false" enable/disable looping
        data-autoplay="true/false" enable/disable carousel autoplay
        data-interval="3000" autoplay interval timeout in miliseconds
        Simply add necessary data attribute to the ".hero-carousel" with appropriate value to adjust carousel functionality.
        */
        return (  
            <OwlCarousel 
                className = 'inner hero-main'
                items = {1}
                loop = {this.props.loop}
                margin = {0}
                nav = {true}
                dots = {true}
                navText = {[]}
                autoplay = {true}
                autoplayTimeout = {10000}
                autoplayHoverPause = {true}
                smartSpeed = {450}> 
                {this.props.slides.map((slide, idx) => {
                    const style = assign({ backgroundImage: 'url(' + slide.backgroundImage + ')' }, slide.style)
                    const action = slide.action.href
                    
                    return (
                    <div key={idx} className='slide' style={style}>
                        <div className='container'>
                            <div className='absolute from-top' style={slide.textPosition.fromTop}>
                                <span className='h1'>
                                    <i className="cursive"><strong>{slide.title}</strong></i>
                                    <br />
                                    {slide.subtitle1}
                                </span>
                                <div className="flex-column action-wrapper">
                                    <a className="more style03 scroll-to" href={action}><span></span></a>
                                </div>
                            </div>
                            <div className='absolute text-left from-bottom' style={slide.textPosition.fromBottom}>
                                {/*<span className='h2'>
                                    <span className='text-thin'><i>{slide.subtitle2}</i></span>
                                    <br />
                                    <strong>{slide.subtitle3}</strong>
                                </span>
                                <br />*/}
                                {/*<a href='#' className='btn btn-primary btn-with-icon-right waves-effect waves-light space-top-none'>
                                    {slide.ctaText}
                                    <i className='material-icons arrow_forward' />
                                </a>*/}
                            </div>
                        </div>
                    </div>
                    )
                })}
            </OwlCarousel>
        )
    }
}