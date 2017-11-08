import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import ProductDetail from '../catalog/ProductDetail.jsx'

export default class Product extends Component {    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <section className="container main-content">
                <div className="row product-section">
                  <div className="col-xs-12">
                    <ProductDetail />
                  </div>
                </div>

                {/*<GalleryFullwidthWithGap />
                <GalleryFullwidthNoGap />
                <GalleryBoxedWithGap />
                <GalleryBoxedNoGap />*/}
            </section>
        )
    }
}