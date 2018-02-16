import React from 'react'

//import { Grid, Col, Row } from 'react-bootstrap'
import { Thumbnail } from 'react-bootstrap'
//import { Modal, Accordion, Panel } from 'react-bootstrap'
//import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { Alert, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
//import { Jumbotron, Well } from 'react-bootstrap'

import HtmlHelper from 'quickcommerce-react/helpers/HTML.js'

import CatalogItemDetailLine from '../catalog/CatalogItemDetailLine.jsx'
import CatalogItemList from '../catalog/CatalogItemList.jsx'
import CatalogItemListItem from '../catalog/CatalogItemListItem.jsx'

const CatalogItem = (props) => {
  let {
    className,
    displayLabel,
    displayTitle,
    displayThumbnail,
    //displayThumbs,
    displayModel,
    displayMsrp,
    displayPrice,
    displayPayment,
    displayDetails,
    displayDisclaimer,
    overlayTools,
    onClick,
    onAddToCartClicked,
    onMoreInfoClicked,
    data
  } = props

  let attributes = data['attributes'] || []

  return (
    <div className={className} onClick={onClick}>
      {displayLabel && (
        <span className='shop-label'>{data.label}</span>
      )}

      {displayThumbnail && (
        <Thumbnail
          className='shop-thumbnail'
          src={data.thumbnail}>
          {props.children}
          {overlayTools && (
            <div className='shop-item-tools'>
              <a href='#' className='add-to-wishlist' data-toggle='tooltip' data-placement='top' title='Wishlist'>
                <i className='material-icons favorite_border' />
              </a>
              <Button className='add-to-cart ghost' onClick={onAddToCartClicked}>
                <em>Order Now</em>
                <svg x='0px' y='0px' width='32px' height='32px' viewBox='0 0 32 32'>
                  <path strokeDasharray='19.79 19.79' strokeDashoffset='19.79' fill='none' stroke='#FFFFFF' strokeWidth={2} strokeLinecap='square' strokeMiterlimit={10} d='M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11' />
                </svg>
              </Button>
            </div>
          )}
        </Thumbnail>
      )}

      {displayTitle && (
        <div className='shop-item-details ribbon-blue'>
          <h5 className='shop-item-title text-center'>
            <small>{data.name}</small>
          </h5>
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
          <h5 className='shop-item-title'><small><em>{data.model}</em></small></h5>
        </div>
      )}

      <CatalogItemList
        listClassName='col-3'>
        {attributes.map((attribute) => (
          <CatalogItemListItem label={attribute.label} text={attribute.value} />
        ))}
      </CatalogItemList>

      {displayDetails && (
        <p className='shop-item-details'
          dangerouslySetInnerHTML={{
            __html: HtmlHelper.decodeHtmlEntities(data.description)}}
        />
      )}

      {displayDisclaimer && (
        <div className='shop-item-details detail-trigger space-top border-top-grey-1px'>
          <i className='fa fa-info-circle trigger-icon'
            onClick={onMoreInfoClicked}
          />
          <Alert
            bsStyle='default'
            style={{
              width: '100%',
              textAlign: 'center',
              margin: '0 auto'
            }}>
            <small className='disclaimer'>
              *Average payment amounts based on an average credit score of 605.
              &nbsp;<a>Learn more</a>.
            </small>
          </Alert>
        </div>
      )}

      {!overlayTools && (
        <div className='shop-item-tools block'>
          <Button block className='add-to-cart ghost space-top-half border-top-grey-1px' onClick={onAddToCartClicked}>
            <i className='fa fa-square-o' />&nbsp;
            <em>Select Item</em>
            <svg x='0px' y='0px' width='32px' height='32px' viewBox='0 0 32 32'>
              <path strokeDasharray='19.79 19.79' strokeDashoffset='19.79' fill='none' stroke='#FFFFFF' strokeWidth={2} strokeLinecap='square' strokeMiterlimit={10} d='M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11' />
            </svg>
          </Button>
        </div>
      )}
    </div>
  )
}

export default CatalogItem
