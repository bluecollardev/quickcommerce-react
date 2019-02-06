import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
//import { Grid, Col, Row } from 'react-bootstrap'
//import { Modal, Accordion, Panel } from 'react-bootstrap'
//import { Tabs, Tab, TabContent, TabContainer } from 'react-bootstrap'
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { Alert, Button, Thumbnail } from 'react-bootstrap'

import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVertIcon from 'material-ui-icons/MoreVert'

import ActionButtons from 'qc-react/components/common/ActionButtons.jsx'

import HtmlHelper from '../../helpers/HTML.js'

import CatalogItemDetailLine from '../catalog/CatalogItemDetailLine.jsx'
import CatalogItemList from '../catalog/CatalogItemList.jsx'
import CatalogItemListItem from '../catalog/CatalogItemListItem.jsx'

const ITEM_HEIGHT = 48

const CatalogItemTitleIcon = (data) => {
  return (
    <div className='catalog-item-button-group fixed-width lender-icon'>
      <Button
        onClick={() => {}}
        style={{
          backgroundColor: 'lightgrey',
          backgroundImage: 'url("data:' + 'image/png' + ';base64,' + data['thumbnail'] + '")',
          color: 'black'
        }}
      />
    </div>
  )
}

const CatalogItemActions = (props) => {
  return (
    <div className='fixed-width'>
      {props.menuItems && Object.keys(props.menuItems).length > 0 && (
        <IconButton
          //style={{ color: 'white !important' }}
          aria-label='More'
          aria-owns={props.open ? 'long-menu' : undefined}
          aria-haspopup='true'
          onClick={props.onOpen}>
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu
        id='long-menu'
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.onClose}
        // TODO: Is this current? I don't see PaperProps in MUI docs...
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200,
          },
        }}>
        {Object.keys(props.menuItems).map(key => (
          <MenuItem
            key={key}
            selected={props.menuItems[key].selected}
            onClick={() => {
              if (typeof props.onMenuItemClicked === 'function') {
                props.onMenuItemClicked(props.menuItems[key])
              }

              if (typeof props.onClose === 'function') {
                props.onClose(props.menuItems[key])
              }
            }}>
            {props.menuItems[key].text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

// TODO: Finish defining props!
CatalogItemActions.propTypes = {
  menuItems: PropTypes.object //.required // TODO: Make this a shape
}

CatalogItemActions.defaultProps = {
  menuItems: {
    CREATE: {
      key: 'CREATE',
      text: 'Create',
      selected: false
    },
    // Default
    VIEW: {
      key: 'VIEW',
      text: 'View Summary',
      selected: true
    },
    DETAILS: {
      key: 'DETAILS',
      text: 'View Details',
      selected: false
    },
    EDIT: {
      key: 'EDIT',
      text: 'Edit',
      selected: false
    },
    DELETE: {
      key: 'DELETE',
      text: 'Delete',
      selected: false
    },
    CANCEL: {
      key: 'CANCEL',
      text: 'Cancel',
      selected: false
    }
  }
}

class CatalogItem extends Component  {
  static propTypes = {
    displayIcon: PropTypes.bool,
    titleIcon: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string
    ]),
    featureCols: PropTypes.number
  }

  static defaultProps = {
    displayIcon: true,
    titleIcon: <CatalogItemTitleIcon />,
    featureCols: 3
  }

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
      overlayTools, isSelected, isRejected, onClick, onAddToCartClicked, onMoreInfoClicked, onMenuItemClicked,
      data, ribbonColor, style, titleIcon, menuItems, featureCols
    } = this.props

    let attributes = data['attributes'] || []

    //let headingRibbonColor = ribbonColor || 'blue'

    let titleTextClass = (typeof this.props.titleTextClass === 'string') ? this.props.titleTextClass : 'card-title text-center'

    return (
      <div className={className} onClick={onClick} style={style}>
        {displayLabel && (<span className='shop-label'>{data.label}</span>)}

        {displayPrimaryImage && (
          <Thumbnail
            className='shop-thumbnail'
            src={data.thumbnail}>
            {this.props.children}
            {displayTools && overlayTools && (
              <div className='card-tools'>
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
          <div className='card-details flush'>
            <div className='card-title catalog-item-buttons'>
              {displayIcon && (
                <Fragment>
                  {React.cloneElement(titleIcon, { data: data })}
                </Fragment>
              )}
              <div className='catalog-item-button-group placeholder'>
                <Button
                  onClick={() => {}}
                  style={{
                    background: 'transparent',
                    border: 'none'
                  }}>
                  {typeof data.name === 'string' && data.name.length > 0 && (
                    <h5 className={titleTextClass}>
                      {data.name}
                    </h5>
                  )}

                  {typeof data.detailLine1=== 'string' && data.detailLine1.length > 0 && (
                    <h6 className={titleTextClass}>
                      {data.detailLine1}
                    </h6>
                  )}

                  {typeof data.detailLine2=== 'string' && data.detailLine2.length > 0 && (
                    <h6 className={titleTextClass}>
                      {data.detailLine2}
                    </h6>
                  )}
                </Button>
              </div>
              {displayActions && (
                <CatalogItemActions
                  anchorEl={anchorEl}
                  open={open}
                  onOpen={this.handleClick}
                  onClose={this.handleClose}
                  menuItems={menuItems}
                  onMenuItemClicked={onMenuItemClicked}
                />
              )}
            </div>
          </div>
        )}

        {displayMsrp && (
          <CatalogItemDetailLine
            label='MSRP'
            formattedValue={data.msrpFormatted}
          />
        )}

        {displayPrice && (
          <CatalogItemDetailLine
            label='Price'
            formattedValue={data.priceFormatted}
          />
        )}

        {/*<ShopItemDetailLine
         label='Retail Price'
         formattedValue={priceFormatted}
         />*/}

        {displayPayment && (
          <CatalogItemDetailLine
            label='Average Payment*'
            formattedValue={data.averagePaymentFormatted}
          />
        )}

        {displayModel && (
          <div className='card-details'>
            <h5 className='card-title'><em>{data.model}</em></h5>
          </div>
        )}

        {/*displayAttributes && (*/}
        <CatalogItemList
          listClassName={'padding-top-half padding-bottom-half col-' + featureCols}>
          {attributes.map((attribute, idx) => (<CatalogItemListItem key={idx} label={attribute.label} text={attribute.value}/>))}
        </CatalogItemList>
        {/*)*/}

        {displayDetails && (
          <p className='card-details'
             dangerouslySetInnerHTML={{__html: HtmlHelper.decodeHtmlEntities(data.description)}}
          />
        )}

        {displayDisclaimer && (
          <div className='card-details detail-trigger space-top border-top-grey-1px'>
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

        <div className='card-details clearfix'>
          <div className='container-fluid'>
            <ActionButtons
              className='actions space-top-half float-right'
              actions={this.props.actions}
            />
          </div>
        </div>

        {displayTools && !overlayTools && (
          <div className='card-tools block'>
            <Button block className='add-to-cart ghost space-top-half border-top-grey-1px' onClick={onAddToCartClicked}>
              {isSelected && (<i className='fa fa-check-square' />)}

              {!isSelected && (<i className='fa fa-square' />)}
              &nbsp;
              <em>Select Item</em>
            </Button>
          </div>
        )}

        {this.props.children}
      </div>
    )
  }
}

export default CatalogItem
