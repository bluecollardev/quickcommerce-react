import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Isotope from 'isotope-layout'
import ImageHelper from '../../helpers/Image.js'

// TODO: Need to support a configurable key
const GalleryItem = (props) => {
  // TODO: Some kind of adapter...
  let { data, dataKey, mimetypeKey, fullsizeKey, onItemClicked, embeddedThumb } = props

  const handleClick = (e, data) => {
    if (typeof e !== 'undefined') {
      e.preventDefault()
      e.stopPropagation()
    }

    if (typeof onItemClicked === 'function') {
      onItemClicked(e, data)
    }
  }

  return (
    <div className='grid-item thumbnail devices'>
      {embeddedThumb !== true && (
        <a
          className='gallery-item'
          href={data[fullsizeKey]}
          onClick={handleClick}>
          {/* No caption prop available */}
          <img src={data[dataKey]} alt='Gallery'/>
          {/*<span className='gallery-caption'>
           <p>{data['caption']}</p>
           </span>*/}
        </a>
      )}

      {embeddedThumb === true && (
        <a
          className='gallery-item'
          //href={data['image']}
          onClick={handleClick}>
          <img src={'data:' + data[mimetypeKey] + ';base64,' + data[dataKey]} alt='Gallery'/>
          {/* No caption prop available */}
          {/*<span className='gallery-caption'>
           <p>{data['caption']}</p>
           </span>*/}
        </a>
      )}
    </div>
  )
}

GalleryItem.propTypes = {
  data: PropTypes.object,
  dataKey: PropTypes.string,
  mimetypeKey: PropTypes.string,
  fullsizeKey: PropTypes.string,
  onItemClicked: PropTypes.func,
  embeddedThumb: PropTypes.bool,
}

GalleryItem.defaultProps = {
  data: {},
  dataKey: 'image',
  mimetypeKey: 'mimeType',
  fullsizeKey: '',
  onItemClicked: () => {},
  embeddedThumb: false
}

class ProductGalleryFullwidthWithGap extends Component {
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
      items = dataSource
    }

    this.state = {
      items: items,
      grid: null
    }
  }

  componentWillReceiveProps(props) {
    let dataSource = null
    if (typeof props.dataSource === 'string') {
      dataSource = JSON.parse(props.dataSource)
    } else if (typeof props.dataSource === 'object') {
      dataSource = props.dataSource
    }

    let items = []
    if (dataSource !== null) {
      items = dataSource
    }

    this.setState({
      items: items,
      grid: null
    })
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.grid)

    /*if (!this.state.isotope) {
      const isotope = new Isotope(node, {
        itemSelector: '.grid-item',
        transitionDuration: '0.7s',
        masonry: {
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer'
        }
      })

      this.setState({isotope: isotope}, () => {
        setTimeout(() => {
          this.updateIsotope()
        }, 333)
      })
    } else {
      this.updateIsotope()
    }*/

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
    /*setTimeout(() => {
      this.updateIsotope()
    }, 333)*/
  }

  updateIsotope() {
    /*if (this.state.isotope) {
      this.state.isotope.reloadItems()
      this.state.isotope.layout()
    }*/
  }

  render() {
    let { onItemClicked, isEmbedded } = this.props
    /*let items = this.state.items

    if (!(items.length > 0)) {
      items = defaultImages
    }*/

    const items = this.state.items || []
    console.log('dumping product gallery images')
    console.log(items)

    if (items.length > 0) {
      return (
        <div>
          {/* Filters Bar */}
          {/*<section className='container-fluid padding-top'>
           <div className='filters-bar tablet-center space-top-half'>
           <ul className='nav-filters'>
           <li className='active'><a href='#' data-filter='*'>All</a> <sup>9</sup></li>
           <li><a href='#' data-filter='.devices'>Devices</a> <sup>2</sup></li>
           <li><a href='#' data-filter='.packaging'>Packaging</a> <sup>2</sup></li>
           <li><a href='#' data-filter='.fashion'>Fashion</a> <sup>3</sup></li>
           <li><a href='#' data-filter='.paper'>Paper &amp; Books</a> <sup>2</sup></li>
           </ul>
           </div>
           </section>*/}
          {/* Gallery Grid Full Width With Gap*/}
          {/*<section className='padding-top-half padding-bottom-2x'>*/}
          <section>
            <div
              ref={(grid) => this.grid = grid}
              className='isotope-grid col-3 filter-grid'>
              <div className='grid-sizer'/>
              <div className='gutter-sizer'/>
              {items.map((item, idx) => {
                let image = item

                return (
                  <GalleryItem
                    key={idx}
                    data={image}
                    onItemClicked={onItemClicked}
                    embeddedThumb={isEmbedded}
                  />
                )
              })}
            </div>
          </section>
        </div>
      )
    } else {
      return (
        <div>
          {/* Filters Bar */}
          {/*<section className='container-fluid padding-top'>
           <div className='filters-bar tablet-center space-top-half'>
           <ul className='nav-filters'>
           <li className='active'><a href='#' data-filter='*'>All</a> <sup>9</sup></li>
           <li><a href='#' data-filter='.devices'>Devices</a> <sup>2</sup></li>
           <li><a href='#' data-filter='.packaging'>Packaging</a> <sup>2</sup></li>
           <li><a href='#' data-filter='.fashion'>Fashion</a> <sup>3</sup></li>
           <li><a href='#' data-filter='.paper'>Paper &amp; Books</a> <sup>2</sup></li>
           </ul>
           </div>
           </section>*/}
          {/* Gallery Grid Full Width With Gap*/}
          {/*<section className='padding-top-half padding-bottom-2x'>*/}
          <section>
            <div
              ref={(grid) => this.grid = grid}
              className='isotope-grid col-3 filter-grid'>
              <div className='grid-sizer'/>
              <div className='gutter-sizer'/>
            </div>
          </section>
        </div>
      )
    }
  }
}

export default ProductGalleryFullwidthWithGap
