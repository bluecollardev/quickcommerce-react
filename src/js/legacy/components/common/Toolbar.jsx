import React, { Component } from 'react'

export default class Toolbar extends Component {
    constructor(props) {
        super(props)
        
        this.countDownFunc = this.countDownFunc.bind(this)
    }
    
    // TODO: Consider aking me a utility!
    countDownFunc(items, trigger) {
        items.each(() => {
            let countDown = $(this),
                dateTime = $(this).data('date-time')

            let countDownTrigger = (trigger) ? trigger : countDown
            countDownTrigger.downCount({
                date: dateTime,
                offset: +10
            })
        })
    }
        
    componentDidMount() {
        // Sidebar Toggle on Mobile
        /*let sidebar = document.querySelector('.sidebar'),
            sidebarToggle = document.querySelector('.sidebar-toggle')
        
        sidebarToggle.addEventListener('click', (e) => {
            e.target.classList.add('sidebar-open')
            sidebar.classList.add('open')
        })
        
        document.querySelector('.sidebar-close').addEventListener('click', () => {
            sidebarToggle.classList.remove('sidebar-open')
            sidebar.classList.remove('open')
        })
        
        this.countDownFunc(document.querySelector('.countdown'))*/
        // TODO: Code above doesn't exist in this theme?
        
        // Toggle Mobile Menu
        let menuToggle = document.querySelector('.toolbar-toggle') || null,
            menuDropdown = document.querySelector('.toolbar-dropdown') || null
        
        if (menuToggle !== null) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault() // Don't follow links, trigger programmatically in SPA
                e.stopPropagation() // Don't follow links, trigger programmatically in SPA
                
                let menuSection = menuDropdown.querySelector('.toolbar-section') // Only supports first section for now
                
                menuToggle.classList.toggle('active')
                menuDropdown.classList.toggle('open')
                menuSection.classList.toggle('current')
            })            
        }
        
        if (menuDropdown !== null && menuToggle !== null) {
            // Close items on click
            let menuItems = menuDropdown.querySelectorAll('.menu-item')
            menuItems.forEach((item) => {
                item.addEventListener('click', () => {
                    // Close the menu when an item is clicked
                    menuToggle.click()
                    
                    /*Velocity(document.documentElement, 'scroll', { 
                        offset: 0, //(this.hash).offset().top-elemOffsetTop, 
                        duration: 1000, 
                        easing: 'easeOutExpo', 
                        mobileHA: false
                    })*/
                })
            })            
        }

        // Toggle Submenu
        let hasSubmenu = document.querySelectorAll('.menu-item-has-children > a') || null

        function closeSubmenu() {
            hasSubmenu.parentNode.classList.remove('active')
        }
        
        if (hasSubmenu !== null && hasSubmenu.length > 0) {
            hasSubmenu.addEventListener('click', (e) => {
                if (e.target.parentNode.is('.active')) {
                    closeSubmenu()
                } else {
                    closeSubmenu()
                    e.target.parentNode.classList.add('active')
                }
            })            
        }
    }
    
    render() {
        return (
            <div className="toolbar-wrapper">
                
                <div className="toolbar">
                  <div className="inner">
                    <a href="#menu" className="toolbar-toggle"><i className="material-icons menu" /></a>
                    <a href="#account" className="toolbar-toggle"><i className="material-icons person" /></a>
                    <a href="#cart" className="toolbar-toggle">
                      <i>
                        <span className="material-icons shopping_basket" />
                        <span className="count">2</span>
                      </i>
                    </a>
                  </div>
                </div>
                
                <div className="toolbar-dropdown">
                  
                  <div className="toolbar-section" id="menu">
                    <div className="inner">
                      <ul className="main-navigation space-bottom">
                        <li className="menu-item current-menu-item">
                          <a href="#/" className="scroll-to-top">Home</a>
                          {/*<ul className="sub-menu">
                            <li className="current-menu-item"><a href="index.html">Home Version 1</a></li>
                            <li><a href="home-v2.html">Home Version 2</a></li>
                            <li><a href="home-v3.html">Home Version 3</a></li>
                          </ul>*/}
                        </li>
                        <li className="menu-item">
                            <a href="#about-us" className="scroll-to">About Us</a>
                        </li>
                        <li className="menu-item">
                          <a href="#our-menu" className="scroll-to">Our Menu</a>
                          {/*<ul className="sub-menu">
                            <li><a href="shop-fullwidth-sl.html">Full Width Sidebar Left</a></li>
                            <li><a href="shop-fullwidth-sr.html">Full Width Sidebar Right</a></li>
                            <li><a href="shop-fullwidth-ft.html">Full Width Filters Top</a></li>
                            <li><a href="shop-boxed-sl.html">Boxed Sidebar Left</a></li>
                            <li><a href="shop-boxed-sr.html">Boxed Sidebar Right</a></li>
                            <li><a href="shop-boxed-ft.html">Boxed Filters Top</a></li>
                            <li><a href="#/product">Single Product</a></li>
                          </ul>*/}
                        </li>
                        {/*<li className="menu-item"><a href="#/blog">Blog</a></li>*/}
                        {/*<li className="menu-item">*/}
                        {/*<li className="menu-item-has-children">
                          <a href="#/">Gallery</a>
                          <ul className="sub-menu">
                            <li><a href="gallery-fullwidth-with-gap.html">Full Width With Gap</a></li>
                            <li><a href="gallery-fullwidth-no-gap.html">Full Width No Gap</a></li>
                            <li><a href="gallery-boxed-with-gap.html">Boxed With Gap</a></li>
                            <li><a href="gallery-boxed-no-gap.html">Boxed No Gap</a></li>
                          </ul>
                        </li>*/}
                        {/*<li className="menu-item"><a href="#/contact">Contact Us</a></li>*/}
                        {/*<li className="menu-item"><a href="#/faq">FAQ</a></li>*/}
                        {/*<li className="menu-item"><a href="elements.html">Elements</a></li>*/}
                      </ul>
                      <ul className="list-icon text-sm">
                        <li>
                          <i className="material-icons location_on" />
                          8701 109 Street NW<br />Edmonton, AB T5G 2LG, Canada
                        </li>
                        <li>
                          <i className="material-icons phone" />
                          (780) 988-2696
                        </li>
                        {/*<li>
                          <i className="material-icons email" />
                          <a href="mailto:info@phobulousedmonton.com">info@phobulousedmonton.com</a>
                        </li>*/}
                        {/*<li>
                          <i className="socicon-skype" />
                          <a href="#">skype_id</a>
                        </li>*/}
                      </ul>
                      <iframe src="https://maps.google.com/maps?q=phobulous edmonton&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height={350} frameBorder={0} style={{border: 0}} />
                            
                      {/*<span className="text-sm display-inline" style={{marginBottom: 6}}>Social accounts: &nbsp;&nbsp;</span>
                      <div className="social-bar display-inline">
                        <a href="#" className="sb-facebook" data-toggle="tooltip" data-placement="top" title="Facebook">
                          <i className="socicon-facebook" />
                        </a>
                        <a href="#" className="sb-google-plus" data-toggle="tooltip" data-placement="top" title data-original-title="Google+">
                          <i className="socicon-googleplus" />
                        </a>
                        <a href="#" className="sb-twitter" data-toggle="tooltip" data-placement="top" title="Twitter">
                          <i className="socicon-twitter" />
                        </a>
                        <a href="#" className="sb-instagram" data-toggle="tooltip" data-placement="top" title data-original-title="Instagram">
                          <i className="socicon-instagram" />
                        </a>
                      </div>*/}
                    </div>
                  </div>
                  
                  <div className="toolbar-section" id="account">
                    <h3 className="toolbar-title space-bottom">You are not logged in.</h3>
                    <div className="inner">
                      <form method="post" className="login-form">
                        <input type="text" className="form-control" placeholder="Username" required />
                        <input type="password" className="form-control" placeholder="Password" required />
                        <div className="form-footer">
                          <div className="rememberme">
                            <label className="checkbox">
                              <input type="checkbox" defaultChecked /> Remember me
                            </label>
                          </div>
                          <div className="form-submit">
                            <button type="submit" className="btn btn-primary btn-block waves-effect waves-light">Login</button>
                          </div>
                        </div>
                      </form>
                      <p className="text-sm space-top">Don’t have an account? <a href="#signup" className="toggle-section">Signup here</a> or with social account:</p>
                      <a href="#" className="social-signup-btn ssb-facebook">
                        <i className="socicon-facebook" />
                        <span>Signup with Facebook</span>
                      </a>
                      <a href="#" className="social-signup-btn ssb-google">
                        <i className="socicon-googleplus" />
                        <span>Signup with Google+</span>
                      </a>
                      <a href="#" className="social-signup-btn ssb-twitter">
                        <i className="socicon-twitter" />
                        <span>Signup with Twitter</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="toolbar-section" id="signup">
                    <h3 className="toolbar-title space-bottom">Sign up, it's free</h3>
                    <div className="inner">
                      <form method="post" className="login-form">
                        <input type="email" className="form-control" placeholder="E-mail" required />
                        <input type="password" className="form-control" placeholder="Password" required />
                        <input type="password" className="form-control" placeholder="Repeat password" required />
                        <div className="form-footer">
                          <div className="rememberme" />
                          <div className="form-submit">
                            <button type="submit" className="btn btn-primary btn-block waves-effect waves-light">Sign up</button>
                          </div>
                        </div>
                      </form>
                      <p className="text-sm space-top">Already have an account? Than <a href="#account" className="toggle-section">Login here</a></p>
                    </div>
                  </div>
                  
                  <div className="toolbar-section" id="cart">
                    <div className="shopping-cart">
                      
                      {this.props.cart && this.props.cart instanceof Array && this.props.cart.map((item, idx) => (
                      <div key={idx} className="item">
                        <a href="#/product" className="item-thumb">
                          <img src={item.image} alt="Item" />
                        </a>
                        <div className="item-details">
                          <h3 className="item-title"><a href="#/product">{item.name}</a></h3>
                          <h4 className="item-price">$12.90</h4>
                          <div className="count-input">
                            <a className="incr-btn" data-action="decrease" href="#">–</a>
                            <input className="quantity" type="text" defaultValue={1} />
                            <a className="incr-btn" data-action="increase" href="#">+</a>
                          </div>
                        </div>
                        <a href="#" className="item-remove" data-toggle="tooltip" data-placement="top" title="Remove">
                          <i className="material-icons remove_shopping_cart" />
                        </a>
                      </div>
                      ))}
                      
                      <div className="cart-subtotal space-bottom">
                        <div className="column">
                          <h3 className="toolbar-title">Subtotal:</h3>
                        </div>
                        <div className="column">
                          <h3 className="amount">$22.90</h3>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <a href="#" className="btn btn-default btn-ghost close-dropdown">Continue Shopping</a>
                        <a href="#checkout" className="btn btn-primary waves-effect waves-light toggle-section">Proceed to Checkout</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="toolbar-section" id="checkout">
                    <form method="post" className="checkout-form container">
                      <div className="cart-subtotal space-bottom">
                        <div className="column">
                          <h3 className="toolbar-title">Checkout</h3>
                        </div>
                        <div className="column">
                          <h3 className="amount"><small className="hidden-xs">3 items&nbsp;&nbsp;&nbsp;</small>$161.90</h3>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <input type="text" className="form-control" name="co_f_name" placeholder="First name" required />
                          <input type="email" className="form-control" name="co_email" placeholder="Email" required />
                          <input type="text" className="form-control" name="co_address1" placeholder="Address 1" required />
                        </div>
                        <div className="col-sm-6">
                          <input type="text" className="form-control" name="co_l_name" placeholder="Last name" required />
                          <input type="tel" className="form-control" name="co_phone" placeholder="Phone" required />
                          <input type="text" className="form-control" name="co_address2" placeholder="Address 2" />
                        </div>
                      </div>
                      <input type="text" className="form-control" name="co_company" placeholder="Company" />
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-element form-select">
                            <select className="form-control" name="co_country">
                              <option value>Country</option>
                              <option value="australia">Australia</option>
                              <option value="gb">Great Britain</option>
                              <option value="poland">Poland</option>
                              <option value="switzerland">Switzerland</option>
                              <option value="usa">USA</option>
                            </select>
                          </div>
                          <div className="form-element form-select">
                            <select className="form-control" name="co_city">
                              <option value>City</option>
                              <option value="bern">Bern</option>
                              <option value="london">London</option>
                              <option value="ny">New York</option>
                              <option value="warsaw">Warsaw</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-element form-select">
                            <select className="form-control" name="co_state">
                              <option value>State</option>
                              <option value={1}>State 1</option>
                              <option value={2}>State 2</option>
                              <option value={3}>State 3</option>
                              <option value={4}>State 4</option>
                              <option value={5}>State 5</option>
                            </select>
                          </div>
                          <input type="text" className="form-control" name="co_zip" placeholder="ZIP code" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="radio radio-inline">
                          <input type="radio" name="co_shipping" defaultChecked /> Ship to this address
                        </label>
                        <label className="radio radio-inline">
                          <input type="radio" name="co_shipping" /> Ship to different address
                        </label>
                      </div>
                      <div className="text-right">
                        <a href="#cart" className="btn btn-default btn-ghost icon-left toggle-section">
                          <i className="material-icons arrow_back" />
                          Back To Cart
                        </a>
                        <button type="submit" className="btn btn-primary waves-effect waves-light">Checkout</button>
                      </div>
                    </form>
                  </div>
                </div>
            </div>
        )
    }
}