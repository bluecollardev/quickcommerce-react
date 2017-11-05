import React, { Component } from 'react'

export default class Hero extends Component {
    render() {
        /* Data API:
        data-loop="true/false" enable/disable looping
        data-autoplay="true/false" enable/disable carousel autoplay
        data-interval="3000" autoplay interval timeout in miliseconds
        Simply add necessary data attribute to the ".hero-carousel" with appropriate value to adjust carousel functionality.
        */
        return (  
            <div className='inner'> 
                {this.props.slides.map((slide, idx) => (
                <div key={idx} className='slide' style={{backgroundImage: 'url(' + slide.backgroundImage + ')'}}>
                    <div className='container'>
                        <div className='absolute from-top'>
                            <span className='h1 hidden-xs'>
                                <i className="cursive">{slide.title}</i>
                                <br />
                                {slide.subtitle1}
                            </span>
                            <div className="flex-column action-wrapper">
                                <a className="more style03" href="#menu"><span></span></a>
                            </div>
                        </div>
                        <div className='absolute text-right from-bottom'>
                            <span className='h2'>
                                <span className='text-thin'><i>{slide.subtitle2}</i></span>
                                <br />
                                <strong>{slide.subtitle3}</strong>
                            </span>
                            <br />
                            {/*<a href='#' className='btn btn-primary btn-with-icon-right waves-effect waves-light space-top-none'>
                                {slide.ctaText}
                                <i className='material-icons arrow_forward' />
                            </a>*/}
                        </div>
                    </div>
                </div>
                ))}
            </div>
        )
    }
}