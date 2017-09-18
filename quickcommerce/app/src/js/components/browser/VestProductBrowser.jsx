import React, { Component } from 'react';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio } from 'react-bootstrap';;

export class VestProductBrowser extends Component {
    catalog: catalog,
    menu: menu,
    prev: null,
    config: {},
    steps: [],
    step: 0,
    stepForward: false,
    progressBar: null,
    // I really don't like this in here -- I don't want tracks built in to the browser, but whatever for now
    availableTracks: [],
    availableDates: [],
    formatDate(date) {
        var that = this;

        console.log('formatting date: ');
        console.log(date);
        if (date instanceof Date) {
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

            var day = days[ date.getDay() ];
            var month = months[ date.getMonth() ];
            console.log('day: ' + day + ', month: ' + month);
        
            return '<td rowspan="1" class="k-scheduler-datecolumn k-first k-last"><em class="k-scheduler-agendaweek">- ' + day + ' -</em><strong class="k-scheduler-agendaday">' + date.getDate().toString() + '</strong><span class="k-scheduler-agendadate">' + month + ', ' + date.getFullYear().toString() + '</span></td>';
        }
        
        return '';
    },
    // TODO: Implement some sort of adapter and add an OpenCart admin var to allow configuration of where to get available dates
    // TODO: This should accept the whole product download config?
    getExternalDates(externalDateOptionAttributes, code) {
        externalDateOptionAttributes = externalDateOptionAttributes || false;
        if (!externalDateOptionAttributes) return false; // TODO: Throw error?
        
        // Return all files in the folder
        var that = this,
            params = $.parseJSON(externalDateOptionAttributes.params),
            dates = [], 
            date = new Date(),
            events = [];
        
        // TrackInfo actually returns a calendar displaying the last month with available results
        // We're going to default to the current month here, but maybe I can adjust the calendar behavior later
        date.setDate(1); // Default to first of the month (that's how they do it)
            
        $.ajax({
            type: params.type,
            async: false,
            url: externalDateOptionAttributes.url, // TODO: Better check? Throw error?
            data: { // TODO: Build using attributes
                trackcode: code,
                racedate: kendo.toString(date, 'yyyy-MM-dd')
            },
            success(data, status, xhr) {
                var cal = $(data),
                    links = cal.find('a.calendar'),
                    dates  = [];
                
                var generateEvents = function () {
                    links.each(function (idx, link) {
                        var regex = /^\d{1,2}$/i,
                            text = $(link).text();
                        
                        if (regex.test(text)) {
                            date = new Date();
                            //date.setMonth();
                            date.setDate(parseInt(text));
                            date.setHours(0,0,0,0);

                            if ($.inArray(date.getTime(), dates) === -1) dates.push(date.getTime());
                        }
                    });

                    $.each(dates, function (idx, date) {
                        events.push({
                            title: 'Available',
                            start: new Date(date),
                            end: new Date(date),
                            isAllDay: true,
                            image: ''
                        });
                    });
                };
                
                // TODO: Let's make this a helper method or something, and make sure to provide a callback mechanism
                // TODO: Consolidate with the code block in getAvailableDates below?
                var interval = setInterval(function () {
                    var schedulers = browser.catalog.element.find('.product-option-scheduler-widget');
                    if (schedulers.length > 0) {
                        generateEvents();

                        schedulers.each(function () {
                            var scheduler = $(this).data('kendoScheduler');
                            scheduler.dataSource.data(events);
                        });

                        clearInterval(interval);
                    }
                }, 333);
            }
        });
    },
    getAvailableDates(filePath) {
        // Return all files in the folder
        var that = this,
            filePath = filePath || 'default',
            files = window.files = [],
            months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
            dateRegex = /[a-zA-Z]+([0-9]+)([a-zA-Z]+).pdf$/,
            dates = [], date,
            events = [];

        console.log('--------- GETTING AVAILABLE DATES ---------');
        page.listFiles(filePath, '', files);
        var generateEvents = function () {
            if (typeof files !== 'undefined') {
                $.each(files, function (idx, fileName) {
                    var matches = fileName.match(dateRegex);
                    if (matches !== null) {
                        date = new Date();
                        date.setMonth(months.indexOf(matches[2]));
                        date.setDate(parseInt(matches[1]));
                        date.setHours(0,0,0,0);
                        if ($.inArray(date.getTime(), dates) === -1) dates.push(date.getTime());
                    }
                });
            }

            $.each(dates, function (idx, date) {
                events.push({
                    title: 'Available',
                    start: new Date(date),
                    end: new Date(date),
                    isAllDay: true,
                    image: ''
                });
            });
        };

        // TODO: Let's make this a helper method or something, and make sure to provide a callback mechanism
        var interval = setInterval(function () {
            if (typeof window.filesLoaded !== 'undefined' && window.filesLoaded) {
                generateEvents();

                browser.catalog.element.find('.product-option-scheduler-widget').each(function () {
                    var scheduler = $(this).data('kendoScheduler');
                    scheduler.dataSource.data(events);
                });

                clearInterval(interval);
            }
        }, 333);
    },
    getAvailableTracks(filePath, date) {
        // Return all files in the folder
        var that = this,
            filePath = filePath || 'default',
            files = window.files = [],
            regex = new RegExp('([a-zA-Z]+)' + page.formatTrackDate(date) + '.pdf'),
            results = [];

        console.log('--------- GETTING AVAILABLE TRACKS ---------');
        page.listFiles(filePath, page.formatTrackDate(date), files);
        var getCodes = function () {
            if (typeof files !== 'undefined') {
                $.each(files, function (idx, fileName) {
                    var matches = fileName.match(regex);
                    if (matches !== null) {
                        results.push(matches[1]);
                    }
                });
            }
        };

        // TODO: Let's make this a helper method or something, and make sure to provide a callback mechanism
        var interval = setInterval(function () {
            if (typeof window.filesLoaded !== 'undefined' && window.filesLoaded) {
                var filters = [], filter;

                getCodes();

                // TODO: I need to make a property to hold just the codes, or I'll end up matching against the name too
                $.each(results, function (idx, code) {
                    filters.push({ field: 'code', operator: 'eq', value: code });
                });
                
                filter = (filters.hasOwnProperty('length') && filters.length > 0) ? [{ logic: 'or', filters: filters }] : [];
                that.catalog.dataSource.filter(filter);

                clearInterval(interval);
            }
        }, 333);
    },
    initSchedulers() {
        var that = this;

        // TODO: There's gotta be a better way of doing this
        // I'll figure it out later
        that.catalog.element.find('.product-option-scheduler-widget').each(function () {
            var scheduler = $(this).kendoScheduler({
                //date: new Date(),
                //startTime: new Date(),
                allDaySlot: false,
                date: new Date(),
                //startTime: new Date(),
                //endTime: new Date(),
                //max: new Date(), // Today
                dateHeaderTemplate: kendo.template("<strong>#=kendo.toString(date, 'd')#</strong>"),
                editable: false,
                selectable: true,
                eventTemplate: $("#event-template").html(),
                views: [
                    { type: 'agenda', selected: false },
                    /*{ type: 'day', selected: false },
                    { type: 'week', selected: false },*/
                    { type: 'month', selected: true }
                ],
                change(e) {
                    if (e.hasOwnProperty('events') && e.events.length > 0) {
                        // Don't trigger a change unless an available date is selected
                        that.stepForward = true;
                        that.catalog.select(that.catalog.element.children().first());
                    }
                },
                dataSource: {
                    data: []
                }
            }).data('kendoScheduler');
            console.log(scheduler);
        });
    },
    init() {
        var that = this,
            loader = page.getLoader(),
            progressBar;
        
        that.updateProgress('initializing browser');
        
        that.progressBar = progressBar = $('#browserProgress').kendoProgressBar({
            // TODO: Wrap this in a block or something
            type: 'chunk',
            max: 2,
            chunkCount: 2,
            value: 0,
            complete(e) {
                var widget = this,
                    productDataSource = browserDataSources.get('browser.product'),
                    doCheckout = true,
                    product = null,
                    date = null;
                
                // TODO: Cart only if product is not free display
                var productConfig = viewModel.get('product_config'),
                    productOptions = productConfig.get('option'),
                    cartProduct = {
                        product_id: productConfig.get('product_id')
                    };
                    
                if (typeof productOptions !== 'undefined') {
                    cartProduct.option = {};
                    productOptions.forEach(function (value, key) {
                        console.log(key);
                        console.log(value);
                        if (value instanceof Date) {
                            // I hate JavaScript dates - really could use moment.js here...
                            cartProduct.option[key.replace('product_option_', '')] = date = [value.getFullYear(), parseInt(value.getMonth() + 1), value.getDate()].join('-');
                        } else {
                            // TODO: Support multiple checkbox/select options
                            cartProduct.option[key.replace('product_option_', '')] = [value];
                        }
                    });
                }
                
                product = productDataSource.get(productConfig.get('product_id'));
                if (typeof product !== 'undefined') {
                    // VESTHOOK
                    if (page.hasOwnProperty('productRequiresCheckout')) {
                        // Make sure the method exists first
                        doCheckout = page.productRequiresCheckout(product);
                    }
                } else {
                    // TODO: Throw an error or something?
                }
                
                // TODO: Alter this in some way so it's reusable...
                if (!doCheckout) {
                    var productDownloads = viewModel.get('product_downloads'),
                        //dateCode, 
                        trackCode;

                    productDownloads.forEach(function (parts, idx) {
                        //dateCode = parts.get('date_code');
                        trackCode = parts.get('track_code'); // TODO: (Remove) support for multiple codes
                    });
                    
                    infoWindow.one('refresh', function (e) {
                        var popup = infoWindow.wrapper,
                            iframe = popup.find('iframe').first()[0],
                            doc = iframe.contentDocument;
                            
                        // Make the font size bigger yo... can barely see it
                        $(doc.head).append('<style>body, body a, table a, table td { font-size: 1.35rem !important }</style>');
                    });
                    
                    infoWindow.refresh({
                        type: 'GET',
                        url: 'http://www.trackinfo.com/hresults/results.jsp?trackcode=' + trackCode.at(0) + '&racedate=' + date,
                        iframe: true
                    });
                    
                    console.log('set window content');
                    console.log(infoWindow);
                    
                    infoWindow.center().open();
                    loader.close();
                    
                    widget.value(0); // Reset progress bar
                    browser.reset();
                }
                
                // TODO: WARNING: QUICK KIOSK FIX for PROOF OF CONCEPT ONLY
                // We need the ability to bypass checkout for testing
                doCheckout = false;
                page.displayDownload();
                // END
                
                if (doCheckout) {
                    console.log('attempting to push product to cart');
                    console.log(JSON.stringify(cartProduct));
                
                    // TODO: This should be a cart function, move this out of customerDashboard! 
                    $.ajax({
                        url: App.getConfig('serviceUrl') + 'api/rest/cart/',
                        data: JSON.stringify(cartProduct),
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        beforeSend(request) {
                            page.setHeaders(request);
                            request.setRequestHeader('X-Oc-Merchant-Language', 'en');
                            
                            loader.setMessage('Adding product to cart...').open();
                        },
                        success(response, status, xhr) {
                            var cartModules, cartModule;
                            
                            if (response.success) {
                                // TODO: There's better ways to make the dashboard module talk to the cart module
                                // Whatever we need this to work NOW!
                                // TODO: Don't just update the first...
                                cartModules = $(document.body).find('[id^=module_cart]');
                                cartModules.each(function (idx, obj) {
                                    var id = $(this).attr('id');
                                    cartModule = page.getModule(id);
                                    
                                    // TEMP: Turn me back on!
                                    //if (idx === 0) 
                                        cartModule.cartPopup.data('kendoWindow').center().open();
                                    
                                    cartModule.cartGrid.dataSource.read();
                                });
                                
                                if (response.hasOwnProperty('data')) {
                                }
                                
                                widget.value(0); // Reset progress bar
                                browser.reset(); // Clear menu selection
                            }
                        },
                        complete(response, status) {
                            console.log('xhr response', response);
                            console.log('status', status);
                            
                            // TODO: hasOwnProperty checks, etc. - make this more robust
                            if (response.success === false || response.responseJSON.success === false) {
                                if (response.responseJSON.error.hasOwnProperty('option')) {
                                    var message = [];
                                    $.each(response.responseJSON.error.option, function (optionId, err) {
                                        message.push(err);
                                    });
                                }
                                
                                loader.setMessage(message.join(' ')).open();
                            
                                setTimeout(function () {
                                    loader.close();
                                }, 3000);
                            } else {
                                loader.close();
                            }
                        }
                    });
                }
            }
        }).data('kendoProgressBar');
        
        that.menu.setOptions({
            selectable: true,
            template: kendo.template($('#browser-menu-item-template').html()),
            dataSource: new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: 'step',
                        fields: {
                            step: { editable: false, nullable: false },
                            name: { type: 'string', editable: true, nullable: true },
                            image: { type: 'string', editable: true, nullable: true }
                        }
                    }
                }
            })
        });
        
        return that;
    },
    
    start() {
        var that = this;
        that.step = 0;
        
        that.catalog.unbind('change');
        that.catalog.bind('change', function (e) {
            var steps = that.steps,
                step = that.step,
                menuItem = that.menu.dataSource.at(step),
                type = (typeof menuItem !== 'undefined') ? menuItem.type : null,
                item = e.sender.select(),
                id = item.attr('data-id'),
                entityType = item.attr('data-entity'),
                productConfig,
                optionsConfig,
                productOptionId;
            
            console.log('catalog browser change event triggered');
            console.log('selected item item of type: ' + entityType + ' with id: ' + id + '... storing id to view-model');
            console.log(item);
            if (typeof entityType !== 'undefined') {
                // Execute before next
                if (steps.hasOwnProperty(step) && steps[step].hasOwnProperty('before')) {
                    productConfig = viewModel.get('product_config');
                    
                    console.log('applying step callbacks before setting the product...');
                    var fn = steps[step].before; // This would be the 'after' event handler callback
                    fn({
                        viewModel: viewModel,
                        product: productConfig || null,
                        step: step || false,
                        item: item || null
                    });
                }
                
                if (entityType === 'category') {
                    viewModel.set('category_id', id);
                } else {
                    productConfig = viewModel.get('product_config');
                    
                    // If product configuration does not exist, then create one
                    if (typeof productConfig === 'undefined' || !(productConfig instanceof kendo.data.ObservableObject)) {
                        productConfig = new kendo.data.ObservableObject();
                        viewModel.set('product_config', productConfig);
                    }
                    
                    switch (entityType) {
                        case 'product':
                            optionsConfig = viewModel.get('product_config.option');
                            
                            viewModel.set('product_config.product_id', id);
                            
                            // Changed products, so clear any options if they exist
                            if (typeof optionsConfig !== 'undefined' && optionsConfig instanceof kendo.data.ObservableObject) {
                                viewModel.set('product_config.option', undefined);
                            }
                            
                            break;
                            
                        case 'option':
                            optionsConfig = viewModel.get('product_config.option');
                    
                            // If option configuration does not exist, then create one
                            if (typeof optionsConfig === 'undefined') {
                                optionsConfig = new kendo.data.ObservableObject();
                                viewModel.set('product_config.option', optionsConfig);
                            }
                            
                            if (type === 'select' || type === 'checkbox') {
                                productOptionId = item.attr('data-product-option-id');
                                // We have to add a prefix - kendo datasources use dot notation to reference data items
                                optionsConfig.set('product_option_' + productOptionId, id); // Single select
                                //optionsConfig.set('product_option_' + productOptionId, id); // TODO: Multiple select
                            } else if (type === 'date' || type == 'time' || type == 'datetime') {
                                productOptionId = item.attr('data-id');
                                
                                var scheduler = item.find('.product-option-scheduler-widget').first().data('kendoScheduler');
                                var slot = scheduler.select();
                                
                                // TODO: Validations!
                                if (slot.hasOwnProperty('start')) {
                                    optionsConfig.set('product_option_' + productOptionId, slot.start); // Date												
                                    // TODO: This isn't necessarily the best place for this but it will suffice for now; it's alright...
                                    //that.getAvailableTracks(null, slot.start);
                                }
                            }
                            
                            break;
                    }
                }
            }
            
            console.log('the current step is ' + that.step + ' so we should increment the step soon after here, but we need to save the current step to the menu first');
            
            //console.log('select on click? ' + steps[step].selectOnClick);
            console.log('is step defined? type:');
            console.log(typeof steps[step]);
            console.log('-------------------');
            if ((typeof steps[step] !== 'undefined' && steps[step].hasOwnProperty('selectOnClick') && steps[step].selectOnClick === true) || that.stepForward === true) {
                that.stepForward = false; // Manually step forward - change event was triggered manually
                // Execute before next
                if (steps.hasOwnProperty(step) && steps[step].hasOwnProperty('after')) {
                    console.log('applying step callbacks before moving to the next step...');
                    var fn = steps[step].after; // This would be the 'after' event handler callback
                    fn({
                        viewModel: viewModel,
                        product: productConfig || null,
                        step: step || false,
                        item: item || null
                    });
                }
                
                console.log('registering databound event');
                console.log('catalog:');
                console.log(catalog);
                
                var applyFilters = function () {
                    console.log('catalog is databound');
                    //console.log(that.catalog);
                    
                    //console.log('calling applyFilters()');
                    that.applyFilters(id);
                    if (steps.hasOwnProperty(step) && steps[step].hasOwnProperty('filtersApplied')) {
                        console.log('applying filtersApplied callback before moving to the next step...');
                        var fn = steps[step].filtersApplied; // This would be the 'after' event handler callback
                        fn({
                            viewModel: viewModel,
                            product: productConfig || null,
                            step: step || false,
                            item: item || null
                        });
                    }
                    
                    // Rebind
                    kendo.unbind(that.catalog.element, viewModel);
                    kendo.bind(that.catalog.element, viewModel);
                };
                
                //catalog.one('dataBound', applyFilters);
                applyFilters();
                
                console.log('setting menu item');
                that.setMenuItem(step, item);
                console.log('invoking next()');
                
                that.next();
            }
        });
        
        // TODO: This is a little buggy and needs a bit of work
        // If I wrap the browser as a module this would probably work better
        that.menu.unbind('change');
        that.menu.bind('change', function (e) {
            var step = e.sender.select().attr('data-step');
            console.log('menu change event triggered... setting step to ' + step);
            that.loadStep(step);
        });
        
        /*$('#nextButton').data('kendoButton').bind('click', function (e) {
            that.next();
        });*/
        
        that.loadStep(0);
        that.catalog.one('dataBound', function (e) {
            that.catalog.dataSource.filter([]); // Clear any filters
        });
        
        return that;
    }
}




var steps = [
				
			];
			
			browser.setSteps(steps);
			browser.buildSteps();
			
			browser.start();