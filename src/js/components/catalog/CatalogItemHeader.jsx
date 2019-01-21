import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { Alert, Button, Thumbnail } from 'react-bootstrap'

import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVertIcon from 'material-ui-icons/MoreVert'

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
      className, displayIcon, displayActions, displayTitle, onClick,
      onMenuItemClicked, data, ribbonColor, style, titleIcon, menuItems
    } = this.props

    let attributes = data['attributes'] || []

    let headingRibbonColor = ribbonColor || 'blue'

    let titleTextClass = (typeof this.props.titleTextClass === 'string') ? this.props.titleTextClass : 'shop-item-title text-center'

    return (
      <div className={className} onClick={onClick} style={style}>
        {displayTitle && (
          <div className={'shop-item-details flush ribbon-' + headingRibbonColor}>
            <div className='catalog-item-buttons'>
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
      </div>
    )
  }
}

export default CatalogItem
