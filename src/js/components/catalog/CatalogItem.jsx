import HtmlHelper from '../../helpers/HTML.js'
import React from 'react'
//import { Grid, Col, Row } from 'react-bootstrap'
//import { Modal, Accordion, Panel } from 'react-bootstrap'
//import { Tabs, Tab, TabContent, TabContainer } from 'react-bootstrap'
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { Alert, Button, Thumbnail } from 'react-bootstrap'

import CatalogItemDetailLine from '../catalog/CatalogItemDetailLine.jsx'
import CatalogItemList from '../catalog/CatalogItemList.jsx'
import CatalogItemListItem from '../catalog/CatalogItemListItem.jsx'
//import { Jumbotron, Well } from 'react-bootstrap'

const CatalogItem = (props) => {
  let {
    className, displayLabel, displayIcon, displayActions, displayTitle, displayPrimaryImage, //displayThumbs,
    displayModel, displayMsrp, displayPrice, displayPayment, displayDetails, displayDisclaimer, displayTools, overlayTools, isSelected, isRejected, onClick, onAddToCartClicked, onMoreInfoClicked, data
  } = props

  let attributes = data['attributes'] || []

  return (
    <div className={className} onClick={onClick}>
      {displayLabel && (<span className='shop-label'>{data.label}</span>)}

      {displayPrimaryImage && (
        <Thumbnail
          className='shop-thumbnail'
          src={data.thumbnail}>
          {props.children}
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
        <div className='shop-item-details flush ribbon-blue'>
          <div className='lender-buttons'>
            {displayIcon && (
              <div className='lender-button-group fixed-width lender-icon'>
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
            <div className='lender-button-group placeholder'>
              <Button
                onClick={onAddToCartClicked}
                style={{
                  background: 'transparent',
                  border: 'none'
                }}>
                <h5 className='shop-item-title text-center'>
                  {data.name}
                </h5>
              </Button>
            </div>
            {displayActions && (
              <div className='lender-button-group fixed-width add-lender'>
                <Button
                  onClick={onAddToCartClicked}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white'
                  }}>
                  <i className='fa fa-ellipsis-v'
                    style={{color: 'white'}}
                  />
                </Button>
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

      {props.children}
    </div>
  )
}

export default CatalogItem
