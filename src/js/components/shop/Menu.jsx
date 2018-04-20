import Griddle from 'griddle-react'
import React from 'react'

import { Col, ControlLabel, FormGroup, Grid, Row, TabPanes, Well } from 'react-bootstrap'

import StarRating from 'react-star-rating'
//import Stepper from '../stepper/BrowserStepper.jsx'

import ProductBrowser from '../browser/ProductBrowser.jsx'
import CategoryFilterBar from '../common/CategoryFilterBar.jsx'
import FilterBar from '../common/FilterBar.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

export default class Menu extends ProductBrowser {
  render() {
    let rowComponent = this.configureRow(this.props.customRowComponent)
    let item = this.props.item || null

    return (
      <div className="col-xs-12 col-sm-10 col-sm-push-1">
        {this.props.displayCategoryFilter && (
          <CategoryFilterBar
            items={this.state.categories}
            onFilterSelected={this.props.onFilterSelected}
          />
        )}

        {/*<ul className="nav-tabs text-center" role="tablist">
         <li className="active"><a href="#pho" role="tab" data-toggle="tab">Noodle Soups</a></li>
         <li><a href="#bun" role="tab" data-toggle="tab">Noodle Bowls</a></li>
         <li><a href="#rice" role="tab" data-toggle="tab">Rice Dishes</a></li>
         <li><a href="#appetizers" role="tab" data-toggle="tab">Appetizers</a></li>
         </ul>*/}

        <div className='browser-container'>
          <div className='browser-menu-container'>
            {/*<BrowserMenu
             steps = {this.props.steps}
             activeStep = {this.props.activeStep}
             onStepClicked = {this.props.onStepClicked}
             />*/}
            {this.props.displayProductFilter && (
              <FilterBar />
            )}
          </div>

          {this.props.displayTitle && (
            <div>
              <hr/>
              <h4 className='browser-product-title'>{this.props.title}</h4>
            </div>
          )}

          {Object.keys(this.state.items).length > 0 && item !== null && (
            <div className='browser-content row'>
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                  <Well>
                    <Row>
                      <Col sm={6}>
                        <Box margin={{ top: 'none' }}>
                          <Box pad={{ vertical: 'small' }}
                            direction='row'
                            align='center'
                            justify='between'>
                            <label>Retail Price</label>
                            <Paragraph size='large' margin='none'>
                              <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                            </Paragraph>
                          </Box>
                          <Box pad={{ vertical: 'small' }}
                            direction='row'
                            align='center'
                            justify='between'
                            separator='top'>
                            <label>Rating</label>
                            <StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating}/>
                          </Box>
                        </Box>
                      </Col>
                      <Col sm={6}>
                        <Box pad={{ vertical: 'small' }}
                          direction='row'
                          align='center'
                          justify='between'>
                          <label>Status</label>
                          <Paragraph size='large' margin='none'>
                            <strong style={{ fontSize: '1rem' }}>{item.stock_status}</strong>
                          </Paragraph>
                        </Box>
                        <Box margin={{ top: 'none' }}>
                          <Box pad={{ vertical: 'small' }}
                            direction='row'
                            align='center'
                            justify='between'
                            separator='top'>
                            <label>Quantity</label>
                            <Paragraph size='large' margin='none'>
                              <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                            </Paragraph>
                          </Box>
                        </Box>
                      </Col>
                    </Row>
                  </Well>
                </FormGroup>
              </Col>
            </div>
          )}

          {this.props.children && !(Object.keys(this.state.items).length > 0) && (
            <div className='browser-content row'>
              <Col sm={12}>
                {item !== null && (
                  <FormGroup>
                    <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                    <Well>
                      <Row>
                        <Col xs={12}>
                          <Box margin={{ top: 'none' }}>
                            <Box pad={{ vertical: 'small' }}
                              direction='row'
                              align='center'
                              justify='between'>
                              <label>Retail Price</label>
                              <Paragraph size='large' margin='none'>
                                <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                              </Paragraph>
                            </Box>
                            <Box pad={{ vertical: 'small' }}
                              direction='row'
                              align='center'
                              justify='between'
                              separator='top'>
                              <label>Rating</label>
                              <StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating}/>
                            </Box>
                          </Box>
                          <Box pad={{ vertical: 'small' }}
                            direction='row'
                            align='center'
                            justify='between'>
                            <label>Status</label>
                            <Paragraph size='large' margin='none'>
                              <strong style={{ fontSize: '1rem' }}>{item.stock_status}</strong>
                            </Paragraph>
                          </Box>
                          <Box margin={{ top: 'none' }}>
                            <Box pad={{ vertical: 'small' }}
                              direction='row'
                              align='center'
                              justify='between'
                              separator='top'>
                              <label>Quantity</label>
                              <Paragraph size='large' margin='none'>
                                <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                              </Paragraph>
                            </Box>
                          </Box>
                        </Col>
                      </Row>
                    </Well>
                  </FormGroup>
                )}
              </Col>
              <Col sm={6}>
                {this.props.children}
              </Col>
            </div>
          )}

          {this.props.children && (Object.keys(this.state.items).length > 0) && (
            <div className='browser-content row'>
              {/*<Col sm={12}>
               {this.props.children}
               </Col>*/}
              <Col sm={12}>
                {/*item !== null && (
                 <FormGroup>
                 <ControlLabel>Product Details</ControlLabel>
                 <Well>
                 <Box margin={{top: 'none'}}>
                 <Paragraph size='large' margin='none'>
                 <h3>{this.props.title}</h3>
                 </Paragraph>

                 <Box pad={{vertical: 'small'}}
                 direction='row'
                 align='center'
                 justify='between'
                 separator='top'>
                 <label>Retail Price</label>
                 <Paragraph size='large' margin='none'>
                 <strong style={{ fontSize: '1.7rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                 </Paragraph>
                 </Box>
                 <Box pad={{vertical: 'small'}}
                 direction='row'
                 align='center'
                 justify='between'
                 separator='top'>
                 <label>Status</label>
                 <Paragraph size='large' margin='none'>
                 <strong style={{ fontSize: '1.3rem' }}>{item.stock_status}</strong>
                 </Paragraph>
                 </Box>
                 <Box pad={{vertical: 'small'}}
                 direction='row'
                 align='center'
                 justify='between'
                 separator='top'>
                 <label>Qty Available</label>
                 <Paragraph size='large' margin='none'>
                 <strong style={{ fontSize: '1.3rem' }}>{item.quantity}</strong>
                 </Paragraph>
                 </Box>
                 <Box pad={{vertical: 'small'}}
                 direction='row'
                 align='center'
                 justify='between'
                 separator='top'>
                 <label>Average Review</label>
                 <StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating} />
                 </Box>
                 </Box>
                 </Well>
                 </FormGroup>
                 )*/}
                <Grid fluid={true}>
                  <Griddle
                    showFilter={this.props.displayTextFilter}
                    columns={[
                      'manufacturer',
                      'name',
                      'model',
                      //'location',
                      //'date_added',
                      //'options',
                      'price'
                    ]}
                    useGriddleStyles={false}
                    showPager={this.props.showPager}
                    useCustomPagerComponent={true}
                    customPagerComponent={BootstrapPager}
                    useCustomRowComponent={true}
                    resultsPerPage={this.props.resultsPerPage}
                    customRowComponent={rowComponent}
                    results={this.state.items}
                  />
                </Grid>
              </Col>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </div>
          )}

          {!this.props.children && (
            <div className='browser-content row'>
              <Grid fluid={true}>
                <Griddle
                  showFilter={this.props.displayTextFilter}
                  columns={[
                    'manufacturer',
                    'name',
                    'model',
                    //'location',
                    //'date_added',
                    //'options',
                    'price'
                  ]}
                  useGriddleStyles={false}
                  showPager={this.props.showPager}
                  useCustomPagerComponent={true}
                  customPagerComponent={BootstrapPager}
                  useCustomRowComponent={true}
                  resultsPerPage={this.props.resultsPerPage}
                  customRowComponent={rowComponent}
                  results={this.state.items}
                />
              </Grid>
            </div>
          )}
        </div>

        {/*<div className="tab-content">
         <div role="tabpanel" className="tab-pane transition fade scale in active" id="pho">
         <div className="row space-top-half">
         {this.props.items && this.props.items instanceof Array && this.props.items.map((item, idx) => (
         <div className="col-lg-4 col-sm-6">
         <div className="shop-item">
         <div className="shop-thumbnail">
         <span className="shop-label text-danger">Sale</span>
         <a href="#/product" className="item-link" />
         <img src={item.image} alt="Shop item" />
         <div className="shop-item-tools">
         <a href="#" className="add-to-wishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
         <i className="material-icons favorite_border" />
         </a>
         <a href="#" className="add-to-cart">
         <em>Order Now</em>
         <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
         <path strokeDasharray="19.79 19.79" strokeDashoffset="19.79" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="square" strokeMiterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
         </svg>
         </a>
         </div>
         </div>
         <div className="shop-item-details">
         <h3 className="shop-item-title"><a href="#/product">{item.name}</a></h3>
         <span className="shop-item-price">
         <span className="old-price">$19.00</span>
         $15.00
         </span>
         </div>
         </div>
         </div>
         ))}
         </div>
         </div>

         <div role="tabpanel" className="tab-pane transition fade scale" id="bun">
         <div className="row space-top-half">
         {this.props.items && this.props.items instanceof Array && this.props.items.map((item, idx) => (
         <div className="col-lg-3 col-sm-6">
         <div className="shop-item">
         <div className="shop-thumbnail">
         <span className="shop-label text-danger">Sale</span>
         <a href="#/product" className="item-link" />
         <img src={item.image} alt="Shop item" />
         <div className="shop-item-tools">
         <a href="#" className="add-to-wishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
         <i className="material-icons favorite_border" />
         </a>
         <a href="#" className="add-to-cart">
         <em>Order Now</em>
         <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
         <path strokeDasharray="19.79 19.79" strokeDashoffset="19.79" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="square" strokeMiterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
         </svg>
         </a>
         </div>
         </div>
         <div className="shop-item-details">
         <h3 className="shop-item-title"><a href="#/product">{item.name}</a></h3>
         <span className="shop-item-price">
         <span className="old-price">$19.00</span>
         $15.00
         </span>
         </div>
         </div>
         </div>
         ))}
         </div>
         </div>

         <div role="tabpanel" className="tab-pane transition fade scale" id="rice">
         <div className="row space-top-half">
         {this.props.items && this.props.items instanceof Array && this.props.items.map((item, idx) => (
         <div className="col-lg-3 col-sm-6">
         <div className="shop-item">
         <div className="shop-thumbnail">
         <span className="shop-label text-danger">Sale</span>
         <a href="#/product" className="item-link" />
         <img src={item.image} alt="Shop item" />
         <div className="shop-item-tools">
         <a href="#" className="add-to-wishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
         <i className="material-icons favorite_border" />
         </a>
         <a href="#" className="add-to-cart">
         <em>Order Now</em>
         <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
         <path strokeDasharray="19.79 19.79" strokeDashoffset="19.79" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="square" strokeMiterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
         </svg>
         </a>
         </div>
         </div>
         <div className="shop-item-details">
         <h3 className="shop-item-title"><a href="#/product">{item.name}</a></h3>
         <span className="shop-item-price">
         <span className="old-price">$19.00</span>
         $15.00
         </span>
         </div>
         </div>
         </div>
         ))}
         </div>
         </div>

         <div role="tabpanel" className="tab-pane transition fade scale" id="appetizers">
         <div className="row space-top-half">
         {this.props.items && this.props.items instanceof Array && this.props.items.map((item, idx) => (
         <div className="col-lg-3 col-sm-6">
         <div className="shop-item">
         <div className="shop-thumbnail">
         <span className="shop-label text-danger">Sale</span>
         <a href="#/product" className="item-link" />
         <img src={item.image} alt="Shop item" />
         <div className="shop-item-tools">
         <a href="#" className="add-to-wishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
         <i className="material-icons favorite_border" />
         </a>
         <a href="#" className="add-to-cart">
         <em>Order Now</em>
         <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
         <path strokeDasharray="19.79 19.79" strokeDashoffset="19.79" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="square" strokeMiterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
         </svg>
         </a>
         </div>
         </div>
         <div className="shop-item-details">
         <h3 className="shop-item-title"><a href="#/product">{item.name}</a></h3>
         <span className="shop-item-price">
         <span className="old-price">$19.00</span>
         $15.00
         </span>
         </div>
         </div>
         </div>
         ))}
         </div>
         </div>
         </div>*/}
      </div>
    )
  }
}
