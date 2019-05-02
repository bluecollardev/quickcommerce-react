import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Isotope from 'isotope-layout'

const GalleryItem = (props) => {
    // TODO: Some kind of adapter...
    let data = props.data
    
    return (
        <div className="grid-item devices">
          <a href={data['display_src']} className="gallery-item">
            <img src={data['thumbnail_src']} alt="Gallery" />
            <span className="gallery-caption">
              {/*<h3>Devices Mockup</h3>*/}
              <p>{data['caption']}</p>
            </span>
          </a>
        </div>
    )
}

export default class GalleryFullwidthWithGap extends Component {
    constructor(props) {
        super(props)
        
        this.updateIsotope = this.updateIsotope.bind(this)
        
        let dataSource = null
        if (typeof props.dataSource === 'string') {
            dataSource = JSON.parse(props.dataSource)
        } else if (typeof props.dataSource === 'object') {
            dataSource = props.dataSource
        }
        
        let items = []
        if (dataSource !== null) {
            items = dataSource.user.media.nodes
        }
        
        this.state = {
            user: dataSource.user,
            items: items,
            grid: null
        }
    }
    
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.grid)
        
        if (!this.state.isotope) {
            const isotope = new Isotope(node, {
                itemSelector: '.grid-item',
                transitionDuration: '0.7s',
                masonry: {
                    columnWidth: '.grid-sizer',
                    gutter: '.gutter-sizer'
                }
            })
            
            this.setState({
                isotope: isotope
            }, () => {
                setTimeout(() => {
                    this.updateIsotope()
                }, 333)
            })
        } else {
            this.updateIsotope()
        }
        
        let galleryThumb = $('.product-gallery-thumblist a')
        let galleryPreview = $('.product-gallery-preview > li')

        galleryThumb.on('click', (e) => {
            let target = $(this).attr('href')

            galleryThumb.parent().removeClass('active')
            $(this).parent().addClass('active')
            galleryPreview.removeClass('current')
            $(target).addClass('current')

            e.preventDefault()
        })
        
        // Gallery Popup
        let $galleryItem = $('.gallery-item')
        
        if ($galleryItem.length > 0) {
            $galleryItem.magnificPopup({
              type: 'image',
              mainClass: 'mfp-fade',
              removalDelay: 500,
              gallery: {
                enabled: true
              }
            })
        }
        
        // Filtering
        /*if (('.filter-grid').length > 0) {
            let filterGrid = document.querySelector('.filter-grid')
            document.querySelector('.nav-filters').on('click', 'a', (e) => {
                e.preventDefault()
                document.querySelector('.nav-filters li').removeClass('active')
                (this).parent().addClass('active')
                let filterValue = (this).attr('data-filter')
                filterGrid.isotope({ filter: filterValue })
            })
        }*/
    }
    
    // update isotope layout
    componentDidUpdate() {
        this.updateIsotope()
    }
    
    updateIsotope() {
        if (this.state.isotope) {
            this.state.isotope.reloadItems()
            this.state.isotope.layout()
        }
    }
    
    render() {
        let items = this.state.items
        console.log('gallery items')
        console.log(items)
        
        return (
            <div className="row">
                {/* Filters Bar */}
                {/*<section className="container-fluid padding-top">
                  <div className="filters-bar tablet-center space-top-half">
                    <ul className="nav-filters">
                      <li className="active"><a href="#" data-filter="*">All</a> <sup>9</sup></li>
                      <li><a href="#" data-filter=".devices">Devices</a> <sup>2</sup></li>
                      <li><a href="#" data-filter=".packaging">Packaging</a> <sup>2</sup></li>
                      <li><a href="#" data-filter=".fashion">Fashion</a> <sup>3</sup></li>
                      <li><a href="#" data-filter=".paper">Paper &amp; Books</a> <sup>2</sup></li>
                    </ul>
                  </div>
                </section>*/}
                {/* Gallery Grid Full Width With Gap*/}
                <section className="container-fluid padding-top-half padding-bottom-2x">
                  <div 
                    ref = {(grid) => this.grid = grid}
                    className="isotope-grid col-3 filter-grid">
                    <div className="grid-sizer" />
                    <div className="gutter-sizer" />
                    {items.map(item => (
                        <GalleryItem 
                            data = {item} 
                            />
                    ))}
                  </div>
                </section>
            </div>
        )
    }
}