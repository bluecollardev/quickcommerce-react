import React, { Component } from 'react'
//import { Grid, Col, Row } from 'react-bootstrap'
//import { Modal, Accordion, Panel } from 'react-bootstrap'
//import { Tabs, Tab, TabContent, TabContainer } from 'react-bootstrap'
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { Alert, Button, Thumbnail } from 'react-bootstrap'

import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVertIcon from 'material-ui-icons/MoreVert'

import HtmlHelper from '../../helpers/HTML.js'

import CatalogItemDetailLine from '../catalog/CatalogItemDetailLine.jsx'
import CatalogItemList from '../catalog/CatalogItemList.jsx'
import CatalogItemListItem from '../catalog/CatalogItemListItem.jsx'

const options = [
  'View',
  'Create',
  'Edit',
  'Delete'
]

const ITEM_HEIGHT = 48

class CatalogItem extends Component  {
  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    let {
      className, displayLabel, displayIcon, displayActions, displayTitle, displayPrimaryImage, //displayThumbs,
      displayModel, displayMsrp, displayPrice, displayPayment, displayDetails, displayDisclaimer, displayTools,
      overlayTools, isSelected, isRejected, onClick, onAddToCartClicked, onMoreInfoClicked, data,
      ribbonColor, style
    } = this.props

    let attributes = data['attributes'] || []

    let headingRibbonColor = ribbonColor || 'blue'

    return (
      <div className={className} onClick={onClick} style={style}>
        {displayLabel && (<span className='shop-label'>{data.label}</span>)}

        {displayPrimaryImage && (
          <Thumbnail
            className='shop-thumbnail'
            src={data.thumbnail}>
            {this.props.children}
            {displayTools && overlayTools && (
              <div className='shop-item-tools'>
                <a href='#' className='add-to-wishlist' data-toggle='tooltip' data-placement='top' title='Wishlist'>
                  <i className='material-icons favorite_border'/>
                </a>
                <Button className='add-to-cart ghost' onClick={onAddToCartClicked}>
                  <em>Order Now</em>
                  <svg x='0px' y='0px' width='32px' height='32px' viewBox='0 0 32 32'>
                    <path strokeDasharray='19.79 19.79' strokeDashoffset='19.79' fill='none' stroke='#FFFFFF' strokeWidth={2} strokeLinecap='square' strokeMiterlimit={10}
                          d='M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11'
                    />
                  </svg>
                </Button>
              </div>
            )}
          </Thumbnail>
        )}

        {displayTitle && (
          <div className={'shop-item-details flush ribbon-' + headingRibbonColor}>
            <div className='catalog-item-buttons'>
              {displayIcon && (
                <div className='catalog-item-button-group fixed-width lender-icon'>
                  <Button
                    onClick={onAddToCartClicked}
                    style={{
                      backgroundColor: 'lightgrey',
                      backgroundImage: 'url("data:' + 'image/png' + ';base64,' + data['thumbnail'] + '")',
                      color: 'black'
                    }}
                  />
                </div>
              )}
              <div className='catalog-item-button-group placeholder'>
                <Button
                  onClick={onAddToCartClicked}
                  style={{
                    background: 'transparent',
                    border: 'none'
                  }}>
                  {typeof data.name === 'string' && data.name.length > 0 && (
                    <h5 className='shop-item-title text-center'>
                      {data.name}
                    </h5>
                  )}

                  {typeof data.detailLine1=== 'string' && data.detailLine1.length > 0 && (
                    <h6 className='shop-item-title text-center'>
                      {data.detailLine1}
                    </h6>
                  )}

                  {typeof data.detailLine2=== 'string' && data.detailLine2.length > 0 && (
                    <h6 className='shop-item-title text-center'>
                      {data.detailLine2}
                    </h6>
                  )}
                </Button>
              </div>
              {displayActions && (
                <div className='fixed-width'>
                  <IconButton
                    //style={{ color: 'white !important' }}
                    aria-label='More'
                    aria-owns={open ? 'long-menu' : undefined}
                    aria-haspopup='true'
                    onClick={this.handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id='long-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 200,
                      },
                    }}>
                    {options.map(option => (
                      <MenuItem
                        key={option}
                        selected={option === 'View'}
                        onClick={() => {
                          // Trigger the view
                          if (typeof this.props.onMenuItemClicked === 'function') {
                            // TODO: Implement using contants, and export constants
                            this.props.onMenuItemClicked(option.toUpperCase())
                          }

                          this.handleClose()
                        }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                  {/*<Button
                   onClick={onAddToCartClicked}
                   style={{
                   backgroundColor: 'transparent',
                   color: 'white'
                   }}>
                   <i className='fa fa-ellipsis-v'
                   style={{color: 'white'}}
                   />
                   </Button>*/}
                </div>
              )}
            </div>
          </div>
        )}

        {displayMsrp && (
          <CatalogItemDetailLine
            label='MSRP'
            formattedPrice={data.msrpFormatted}
          />
        )}

        {displayPrice && (
          <CatalogItemDetailLine
            label='Price'
            formattedPrice={data.priceFormatted}
          />
        )}

        {/*<ShopItemDetailLine
         label='Retail Price'
         formattedPrice={priceFormatted}
         />*/}

        {displayPayment && (
          <CatalogItemDetailLine
            label='Average Payment*'
            formattedPrice={data.averagePaymentFormatted}
          />
        )}

        {displayModel && (
          <div className='shop-item-details'>
            <h5 className='shop-item-title'><em>{data.model}</em></h5>
          </div>
        )}

        {/*displayAttributes && (*/}
        <CatalogItemList
          listClassName='col-3'>
          {attributes.map((attribute, idx) => (<CatalogItemListItem key={idx} label={attribute.label} text={attribute.value}/>))}
        </CatalogItemList>
        {/*)*/}

        {displayDetails && (
          <p className='shop-item-details'
             dangerouslySetInnerHTML={{__html: HtmlHelper.decodeHtmlEntities(data.description)}}
          />
        )}

        {displayDisclaimer && (
          <div className='shop-item-details detail-trigger space-top border-top-grey-1px'>
            <i className='fa fa-info-circle trigger-icon'
               onClick={onMoreInfoClicked}
            />
            <Alert
              bssize
              style={{
                width: '100%',
                textAlign: 'center',
                margin: '0 auto'
              }}>
              <small className='disclaimer'>
                *Average payment amounts based on an average credit score of 605.
                <a>Learn more</a>.
              </small>
            </Alert>
          </div>
        )}

        {displayTools && !overlayTools && (
          <div className='shop-item-tools block'>
            <Button block className='add-to-cart ghost space-top-half border-top-grey-1px' onClick={onAddToCartClicked}>
              {isSelected && (<i className='fa fa-check-square' />)}

              {!isSelected && (<i className='fa fa-square' />)}
              &nbsp;
              <em>Select Item</em>
              <svg x='0px' y='0px' width='32px' height='32px' viewBox='0 0 32 32'>
                <path strokeDasharray='19.79 19.79' strokeDashoffset='19.79' fill='none' stroke='#FFFFFF' strokeWidth={2} strokeLinecap='square' strokeMiterlimit={10}
                      d='M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11'
                />
              </svg>
            </Button>
          </div>
        )}

        {this.props.children}
      </div>
    )
  }
}

export default CatalogItem
