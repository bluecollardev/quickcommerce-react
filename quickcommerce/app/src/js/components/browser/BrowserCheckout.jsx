import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend        from 'react-dnd-html5-backend'

import Griddle             from 'griddle-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import CatalogRow from '../catalog/CatalogRow.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

export default class BrowserCheckout extends Component {
    constructor(props) {
        super(props)
    }
    
    onCheckoutSuccess() {
        var cartModules, cartModule
                
        if (response.success) {
            // TODO: There's better ways to make the dashboard module talk to the cart module
            // Whatever we need this to work NOW!
            // TODO: Don't just update the first...
            cartModules = $(document.body).find('[id^=module_cart]')
            cartModules.each(function (idx, obj) {
                var id = $(this).attr('id')
                cartModule = page.getModule(id)
                
                // TEMP: Turn me back on!
                //if (idx === 0) 
                    cartModule.cartPopup.data('kendoWindow').center().open()
                
                cartModule.cartGrid.dataSource.read()
            })
            
            if (response.hasOwnProperty('data')) {
            }
            
            widget.value(0) // Reset progress bar
            browser.reset() // Clear menu selection
        }
    }
    
    onCheckoutComplete() {
        console.log('xhr response', response)
        console.log('status', status)
        
        // TODO: hasOwnProperty checks, etc. - make this more robust
        if (response.success === false || response.responseJSON.success === false) {
            if (response.responseJSON.error.hasOwnProperty('option')) {
                var message = []
                $.each(response.responseJSON.error.option, function (optionId, err) {
                    message.push(err)
                })
            }
            
            loader.setMessage(message.join(' ')).open()
        
            setTimeout(function () {
                loader.close()
            }, 3000)
        } else {
            loader.close()
        }
    }
    
    doCheckout() {
        console.log('attempting to push product to cart')
        console.log(JSON.stringify(cartProduct))
                
        // TODO: This should be a cart function, move this out of customerDashboard! 
        $.ajax({
            url: App.getConfig('serviceUrl') + 'api/rest/cart/',
            data: JSON.stringify(cartProduct),
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend(request) {
                page.setHeaders(request)
                request.setRequestHeader('X-Oc-Merchant-Language', 'en')
                
                loader.setMessage('Adding product to cart...').open()
            },
            success(response, status, xhr) {
                onCheckoutSuccess(response, status, xhr)
            },
            complete(response, status) {
                onCheckoutComplete(response, status)
            }
        })
        
    }
    
    doFreeDownload() {
        var productDownloads = viewModel.get('product_downloads'),
            //dateCode, 
            trackCode

        productDownloads.forEach(function (parts, idx) {
            //dateCode = parts.get('date_code')
            trackCode = parts.get('track_code') // TODO: (Remove) support for multiple codes
        })
        
        infoWindow.one('refresh', function (e) {
            var popup = infoWindow.wrapper,
                iframe = popup.find('iframe').first()[0],
                doc = iframe.contentDocument
                
            // Make the font size bigger yo... can barely see it
            $(doc.head).append('<style>body, body a, table a, table td { font-size: 1.35rem !important }</style>')
        })
        
        infoWindow.refresh({
            type: 'GET',
            url: 'http://www.trackinfo.com/hresults/results.jsp?trackcode=' + trackCode.at(0) + '&racedate=' + date,
            iframe: true
        })
        
        console.log('set window content')
        console.log(infoWindow)
        
        infoWindow.center().open()
        loader.close()
        
        widget.value(0) // Reset progress bar
        browser.reset()
    }
    
    mergeThisStuff() {
        var cartModule = page.getModule('module_cart_1'), // Any instance will do
				cartEventHandler = cartModule.getEventHandler();
			
        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('beforeCheckout', function () {
            console.log('triggered beforeCheckout event');
            if (that.getAuthHandler().doLoginCheck() === false) {
                loader.setMessage('Sorry, please login or register for an account to continue').open();
                
                setTimeout(function () {
                    loader.close();
                    loginHandler({});
                }, 3000);
                
                throw new Error('User is not logged in');
            }
        }, that);
        
        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('checkoutSuccess', function () {
            console.log('triggered checkoutSuccess event');
            /*var loader = page.getLoader();
            // TODO: hasOwnProperty checks, etc. - make this more robust
            if (response.success === false || response.responseJSON.success === false) {
                if (response.responseJSON.hasOwnProperty('error')) {
                    var message = [];
                    $.each(response.responseJSON.error, function (idx, err) {
                        message.push(err);
                    });
                }
                
                loader.setMessage(message.join(' ')).open();
            
                setTimeout(function () {
                    loader.close();
                }, 3000);
            } else {
                loader.close();
            }*/
        }, that);
        
        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('checkoutError', function () {
            console.log('triggered checkoutError event');
            /*var loader = page.getLoader();
            // TODO: hasOwnProperty checks, etc. - make this more robust
            if (response.success === false || response.responseJSON.success === false) {
                if (response.responseJSON.hasOwnProperty('error')) {
                    var message = [];
                    $.each(response.responseJSON.error, function (idx, err) {
                        message.push(err);
                    });
                }
                
                loader.setMessage(message.join(' ')).open();
            
                setTimeout(function () {
                    loader.close();
                }, 3000);
            } else {
                loader.close();
            }*/
        }, that);
        
        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('checkoutComplete', function () {
            console.log('triggered checkoutComplete event');
            /*var loader = page.getLoader();
            // TODO: hasOwnProperty checks, etc. - make this more robust
            if (response.success === false || response.responseJSON.success === false) {
                if (response.responseJSON.hasOwnProperty('error')) {
                    var message = [];
                    $.each(response.responseJSON.error, function (idx, err) {
                        message.push(err);
                    });
                }
                
                loader.setMessage(message.join(' ')).open();
            
                setTimeout(function () {
                    loader.close();
                }, 3000);
            } else {
                loader.close();
            }*/
        }, that);
    }
    
    render() {
        return (
            <div className='browser-container'>
                <div className='browser-content'>
                    <Grid>
                        <Griddle 
                          showFilter              = {true}
                          columns                 = {['Brand', 'Name', 'Type', 'Country', 'Year', 'Options', 'Price']}
                          useGriddleStyles        = {false}
                          useCustomPagerComponent = {true}
                          customPagerComponent    = {BootstrapPager}
                          useCustomRowComponent   = {true}
                          resultsPerPage          = {4}
                          customRowComponent      = {CatalogRow}
                          results                 = {this.state.data} />
                    </Grid>
                </div>
            </div>
        )
    }
    
}