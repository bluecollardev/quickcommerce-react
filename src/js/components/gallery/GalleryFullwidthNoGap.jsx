import React, { Component } from 'react'

export default class GalleryFullwidthNoGap extends Component {
  render() {
    return (
      <div className="row">
        {/* Filters Bar */}
        <section className="container-fluid padding-top">
          <div className="filters-bar tablet-center space-top-half">
            {/* Nav Filters */}
            <ul className="nav-filters">
              <li className="active"><a href="#" data-filter="*">All</a> <sup>9</sup></li>
              <li><a href="#" data-filter=".devices">Devices</a> <sup>2</sup></li>
              <li><a href="#" data-filter=".packaging">Packaging</a> <sup>2</sup></li>
              <li><a href="#" data-filter=".fashion">Fashion</a> <sup>3</sup></li>
              <li><a href="#" data-filter=".paper">Paper &amp; Books</a> <sup>2</sup></li>
            </ul>{/* .nav-filters */}
          </div>{/* .filters-bar */}
        </section>{/* .container */}
        {/* Gallery Grid Full Width With Gap*/}
        <section className="container-fluid padding-top-half padding-bottom-3x">
          <div className="isotope-grid grid-no-gap col-3 filter-grid">
            <div className="grid-sizer" />
            <div className="gutter-sizer" />
            {/* Gallery Item */}
            <div className="grid-item devices">
              <a href="img/gallery/01.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th01.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>Devices Mockup</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item fashion">
              <a href="img/gallery/02.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th02.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>Bart Reed Outware</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item packaging">
              <a href="img/gallery/03.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th03.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>Brand Box</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item paper">
              <a href="img/gallery/04.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th04.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>Flying Books</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item fashion">
              <a href="img/gallery/05.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th05.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>Design Socks</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item packaging">
              <a href="img/gallery/06.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th06.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>Tote Bag</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item devices">
              <a href="img/gallery/07.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th07.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>iPhone Mockup</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item paper">
              <a href="img/gallery/08.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th08.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>Leaflet Design</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
            {/* Gallery Item */}
            <div className="grid-item fashion">
              <a href="img/gallery/09.jpg" className="gallery-item">
                <img src="img/gallery/thumbs/th09.jpg" alt="Gallery" />
                <span className="gallery-caption">
                  <h3>T-Shirt Mockup</h3>
                  <p>Lorem ipsum dolor sit amet consectetur.</p>
                </span>
              </a>
            </div>{/* .grid-item */}
          </div>{/* .isotope-grid */}
        </section>{/* .container-fluid */}
      </div>
    )
  }
}