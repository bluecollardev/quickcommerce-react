import React, { Component } from 'react';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Card from 'grommet/components/Card';
import Chart, { Area, Axis, Base, Layers } from 'grommet/components/chart/Chart';
import Menu from 'grommet/components/Menu';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import NumberInput from 'grommet/components/NumberInput';
import Select from 'grommet/components/Select';
import Heading from 'grommet/components/Heading';
import Hero from 'grommet/components/Hero';
import Image from 'grommet/components/Image';
import Label from 'grommet/components/Label';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Paragraph from 'grommet/components/Paragraph';
import Quote from 'grommet/components/Quote';
import Columns from 'grommet/components/Columns';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Section from 'grommet/components/Section';
import SocialShare from 'grommet/components/SocialShare';
import Video from 'grommet/components/Video';
import CirclePlayIcon from 'grommet/components/icons/base/CirclePlay';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio } from 'react-bootstrap';
//import { Jumbotron } from 'react-bootstrap';

//import Header from './Header';
//import NewsFeed from './NewsFeed';

export default class HomePage extends Component {
    constructor(props) {
        super(props)
        
        this.fetchCategories = this.fetchCategories.bind(this)
    }
    
    /*componentDidMount() {
        console.log('checkout component mounted')
        let orderButton = document.getElementById('cart-button')
        console.log('order button')
        console.log(orderButton)
        
        orderButton.addEventListener('click', (e) => {
            e.preventDefault()
            
            let scrollDuration = 666
            let scrollStep = -window.scrollY / (scrollDuration / 15),
                scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep)
                } else clearInterval(scrollInterval)
            }, 15)
            
            window.location.hash = '/checkout/cart'
        })
    }*/
    
    fetchCategories() {        
        let cards = []
        for (var category in categories) {
            let item = categories[category]
            cards.push(
                <Card
                    colorIndex='grey-1'
                    margin='small'
                    contentPad='medium'
                    //onClick={this._onClickCard.bind(this, grommetPath)}
                    thumbnail={item['thumbnail']}
                    direction='column'
                    label={item['Type']}
                    heading={
                        <Heading tag='h2'>
                            {item['Brand']}
                        </Heading>
                    }
                    description={item['Description']}
                    link={
                        <Anchor href='#/product' label={'Browse ' + item['Brand']} />
                    }>
                    
                </Card>
            )
        }
        
        return cards
    }
    
    render() {
        let categories = this.fetchCategories()
        return (
            <div>
                <div style={{display: 'block', clear: 'both'}} />
                {/*<section class="entryModule triggrParallx">
                                    <div class="column mcb-column one column_column  column-margin-">
                                        <div class="column_attr clearfix align_center" style="">
                                            <span class="single_icon  icon_center">
                                                <i style="font-size: 100px; line-height: 100px;  color:#5f5f5f;" class="icon-down-open-big"></i>
                                            </span>
                                        </div>
                                    </div>
                                </section>*/}
                <section className="entryModule entryModule--saloni triggrParallx">
                  <div className="entryModule__tile entryModule__tile--latter slideUp" style={{transform: 'matrix(1, 0, 0, 1, 0, -30)'}}>
                    <div className="tileBg animateInView animateInView--pix isInView" data-delay="narrow" />
                  </div>
                  {/* entryModule__tile--latter */}
                  <div className="entryModule__tile entryModule__tile--former slideDown--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, 15)'}}>
                    <div className="tileBg animateInView animateInView--pix isInView" />
                  </div>
                  {/* entryModule__tile--former */}
                  <div className="entryModule__text slideUp--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, -9.95)'}}>
                    <h3>
                      <span className="small">
                        <div className="animateInView animateInView--text isInView" data-delay="medium">
                          <span>COFFEE &amp; MERCH</span>
                        </div> {/* fieldEntry-text */}
                      </span>{/* small */}
                      <span className="big">
                        <div className="animateInView animateInView--text isInView">
                          <span>ONLINE OUTLET</span>
                        </div> {/* fieldEntry-text */}
                      </span>{/* big */}
                    </h3>
                    <p>Respecting the science and craft of the past, our team of reasters have developed an evolving portfolio of coffees that reflect our passion, philosophy and commitment to sensible roasting... the end goal - delicious artisan coffee.</p>
                    <div className="btn animateInView isInView">
                      <span className="btn__bg" />
                      <a className="btn__link" href="#/category">
                        <span className="buttonText">BROWSE PRODUCTS
                        </span>
                        {/* buttonText */}
                      </a>
                      {/* a */}
                    </div>
                    {/* btn */}
                  </div>
                  {/* entryModule__text */}
                </section>
                {/* saloni */}
                
                <section className="entryModule entryModule--hairTrends triggrParallx">
                  <div className="entryModule__tile entryModule__tile--latter slideDown--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, 15)'}}>
                    <div className="tileBg animateInView animateInView--pix isInView" />
                  </div>
                  {/* entryModule__tile--latter */}
                  <div className="entryModule__tile entryModule__tile--former slideUp--fast " style={{transform: 'matrix(1, 0, 0, 1, 0, -56)'}}>
                    <div className="tileBg animateInView animateInView--pix isInView" data-delay="medium" />
                  </div>
                  {/* entryModule__tile--former */}
                  <div className="entryModule__tile entryModule__tile--former_2 slideUp" style={{transform: 'matrix(1, 0, 0, 1, 0, -28)'}}>
                    <div className="tileBg animateInView animateInView--pix isInView" data-delay="wider" />
                  </div>
                  {/* entryModule__tile--former */}
                  <div className="entryModule__text slideUp--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, -5.45)'}}>
                    <h3>
                      <span className="small">
                        <div className="animateInView animateInView--text isInView" data-delay="medium">
                          <span>OUR </span>
                        </div> {/* fieldEntry-text */}
                      </span>{/* small */}
                      <span className="big">
                        <div className="animateInView animateInView--text isInView">
                          <span>ROASTERY</span>
                        </div> {/* fieldEntry-text */}
                      </span>{/* big */}
                    </h3>
                    <p>ACE Coffee Roasters is a culmination of 25 years of coffee experience. Respecting the science and craft of the past, our team of reasters have developed an evolving portfolio of coffees that reflect our passion, philosophy and commitment to sensible roasting... the end goal - delicious artisan coffee.</p>
                    <div className="btn animateInView isInView">
                      <span className="btn__bg" />
                      <a className="btn__link" data-type="page-transition" href>
                        <span className="buttonText">COMING SOON
                        </span>
                        {/* buttonText */}
                      </a>
                      {/* a */}
                    </div>
                    {/* btn */}
                  </div>
                  {/* entryModule__text */}
                </section>
                {/* hairTrends */}
                
                <section className="entryModule entryModule--prodotti triggrParallx">
                  <div className="entryModule__tile slideDown--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, 11)'}}>
                    <div className="tileBg animateInView animateInView--pix isInView" />
                  </div>
                  {/* entryModule__tile--latter */}
                  <div className="entryModule__text slideUp--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, -6.55)'}}>
                    <h3>
                      <div className="animateInView animateInView--text isInView">
                        <span>COMMUNITY</span>
                      </div>
                      {/* fieldEntry-text */}
                    </h3>
                    <p>Respecting the science and craft of the past, our team of reasters have developed an evolving portfolio of coffees that reflect our passion, philosophy and commitment to sensible roasting... the end goal - delicious artisan coffee.</p>
                    <div className="btn animateInView isInView">
                      <span className="btn__bg" />
                      <a className="btn__link" data-type="page-transition" href>
                        <span className="buttonText">COMING SOON
                         
                        </span>
                        {/* buttonText */}
                      </a>
                      {/* a */}
                    </div>
                    {/* btn */}
                  </div>
                  {/* entryModule__text */}
                </section>
                {/* hairTrends */}
                <section className="entryModule entryModule--news triggrParallx animateInView isInView">
                  {/* news__title */}
                  <article className="entryModule__article  entryModule__article--first slideDown--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, 8.79972)'}}>
                    <a data-type="page-transition" href>
                      <div className="articleImage animateInView animateInView--pix isInView" style={{backgroundImage: 'url(image/vendor/acecoffeeroasters/prd-1000pxm/ace-69.jpg)'}} />
                    </a>
                    <div className="articleContent">
                      <div className="categoryLabels animateInView animateInView--text isInView">
                        <span>FACILITY TOURS</span>
                      </div>
                      <h4>
                        <a data-type="page-transition" href>
                          <div className="animateInView animateInView--text isInView" data-delay="medium">
                            <span>SCHEDULE A TOUR OF OUR ROASTERY</span>
                          </div>
                          {/* fieldEntry-text */}
                        </a>
                      </h4>
                    </div>
                    {/* articleText */}
                  </article>
                  {/* news__recentPost */}
                  <article className="entryModule__article  entryModule__article--last slideDown" style={{transform: 'matrix(1, 0, 0, 1, 0, 17.5994)'}}>
                    <a data-type="page-transition" href>
                      <div className="articleImage animateInView animateInView--pix isInView" style={{backgroundImage: 'url(image/vendor/acecoffeeroasters/prd-1000pxm/ace-87.jpg)'}} />
                    </a>
                    <div className="articleContent">
                      <div className="categoryLabels animateInView animateInView--text isInView">
                        <span>EVENT</span>
                      </div>
                      <h4>
                        <a data-type="page-transition" href>
                          <div className="animateInView animateInView--text isInView" data-delay="medium">
                            <span>COFFEE BREWING 101</span>
                          </div>
                          {/* fieldEntry-text */}
                        </a>
                      </h4>
                    </div>
                    {/* articleText */}
                  </article>
                  {/* news__recentPost */}
                  <div className="entryModule__allNews">
                    <div className="btn animateInView isInView">
                      <span className="btn__bg" />
                      <a className="btn__link" data-type="page-transition" href>
                        <span className="buttonText">MORE NEWS
                         
                        </span>
                        {/* buttonText */}
                      </a>
                      {/* a */}
                    </div>
                    {/* btn */}
                  </div>
                  {/* entryModule__allNews */}
                </section>
                {/* entryModule--news */}
                <div className="entryModule entryModule--booking triggrParallx animateInView" style={{marginBottom: 0}}>
                  <div className="entryModule__border entryModule__border--topLeft" />
                  <div className="entryModule__border entryModule__border--bottomRight" />
                  {/* news__title */}
                  <div className="entryModule__bookingContent entryModule__bookingContent--principale">
                    <ul className="bookingTabs">
                      <li>
                        <span className="bookingTabs__btn bookingTabs__btn--principale bookingTabs__btn--isActive">RETAIL</span>
                      </li>
                      <li>
                        <span className="bookingTabs__btn bookingTabs__btn--xs">EVENTS</span>
                      </li>
                      <li>
                        <span className="bookingTabs__btn bookingTabs__btn--ecoxs">B2B</span>
                      </li>
                    </ul>
                    <div className="bookingInfo bookingInfo--principale bookingInfo--isActive" style={{visibility: 'inherit', opacity: 1, transform: 'matrix(1, 0, 0, 1, 0, 0)'}}>
                      <p className="bookingMessage">CUSTOMER SERVICE</p>
                      <p>
                        <span className="contactLabel">Tel.</span>
                        <a className="contactValue tel" tabIndex={-1} rel="nofollow" href="tel:780.244.0ACE">780.244.0ACE</a>
                      </p>
                      <p>
                        <span className="contactLabel">Cell</span>
                        <a className="contactValue tel" tabIndex={-1} rel="nofollow" href="tel:780.244.0ACE">780.244.0ACE</a>
                      </p>
                      <br />
                      <p className="bookingMessage">LOCATION HOURS</p>
                      <p>Now open to the public</p>
                      {/*<p>
                                                <span class="contactLabel">Mon - Thurs </span>
                                                <a class="contactValue tel" tabindex="-1" rel="nofollow" href="tel:780.244.0ACE"></a>
                                            </p>*/}
                      <p>
                        <span className="contactLabel">Friday - Sunday</span>
                        <br />
                        <a className="contactValue tel" tabIndex={-1} rel="nofollow" href="tel:780.244.0ACE">8am - 4pm</a>
                      </p>
                    </div>
                    {/* principale */}
                    <div className="bookingInfo bookingInfo--xs" style={{visibility: 'hidden', opacity: 0, transform: 'matrix(1, 0, 0, 1, -30, 0)'}}>
                      <p>Contact our events coordinator.</p>
                      <p>
                        <span className="contactLabel">CELL</span>
                        <a className="contactValue tel" tabIndex={-1} rel="nofollow" href="tel:780.244.0ACE">780.244.0ACE</a>
                      </p>
                    </div>
                    {/* xs */}
                    <div className="bookingInfo bookingInfo--ecoxs" style={{visibility: 'hidden', opacity: 0, transform: 'matrix(1, 0, 0, 1, -30, 0)'}}>
                      <p>Please call to schedule an appointment or viewing.</p>
                      <p>
                        <span className="contactLabel">CELL</span>
                        <a className="contactValue tel" tabIndex={-1} rel="nofollow" href="tel:780.244.0ACE">780.244.0ACE</a>
                      </p>
                    </div>
                    {/* ecoxs */}
                  </div>
                  {/* entryModule__booking */}
                </div>
                {/* prodotti */}
              </div>
        );
    }
};