/*
 * jQuery Extended Selectors plugin. (c) Keith Clark freely distributable under the terms of the MIT license.
 * Adds missing -of-type pseudo-class selectors to jQuery 
 * github.com/keithclark/JQuery-Extended-Selectors  -  twitter.com/keithclarkcouk  -  keithclark.co.uk
 */
(function(g){function e(a,b){for(var c=a,d=0;a=a[b];)c.tagName==a.tagName&&d++;return d}function h(a,b,c){a=e(a,c);if(b=="odd"||b=="even")c=2,a-=b!="odd";else{var d=b.indexOf("n");d>-1?(c=parseInt(b,10)||parseInt(b.substring(0,d)+"1",10),a-=(parseInt(b.substring(d+1),10)||0)-1):(c=a+1,a-=parseInt(b,10)-1)}return(c<0?a<=0:a>=0)&&a%c==0}var f={"first-of-type":function(a){return e(a,"previousSibling")==0},"last-of-type":function(a){return e(a,"nextSibling")==0},"only-of-type":function(a){return f["first-of-type"](a)&&
f["last-of-type"](a)},"nth-of-type":function(a,b,c){return h(a,c[3],"previousSibling")},"nth-last-of-type":function(a,b,c){return h(a,c[3],"nextSibling")}};g.extend(g.expr[":"],f)})(jQuery);

jQuery(document).ready(function($){
    
    // Browser Detect
    var BrowserDetect = 
    {
        init: function () 
        {
            this.browser = this.searchString(this.dataBrowser) || "Other";
            this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
        },
    
        searchString: function (data) 
        {
            for (var i=0 ; i < data.length ; i++)   
            {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;
    
                if (dataString.indexOf(data[i].subString) != -1)
                {
                    return data[i].identity;
                }
            }
        },
    
        searchVersion: function (dataString) 
        {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        },
    
        dataBrowser: 
        [
            { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
            { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
            { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
            { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
            { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
        ]
    
    };
    BrowserDetect.init();
    // Browser Detect
    
    // Load in the content
    function loadContent(target, url)
    {
        $('#' + target).load(url, function(response, status, xhr) {
            if (status == 'error')
            {
                var msg = "Sorry but there was an error: ";
            }
            else
            {
                if ($('.hp').length > 0)
                {
                    $('#' + target).waypoint({
                        handler: function(direction) {
                            if (direction == 'down')
                            {
                                var url = $(this).attr('data-url');
                                var title = $(this).attr('data-title');
                                
                                if (typeof url !== 'undefined' && url !== false)
                                {
                                    History.pushState(null,title,url);
                                }
                            }
                        },
                        offset: 50 // 50
                    }).waypoint({
                        handler: function(direction) {
                            if (direction == 'up')
                            {
                                var url = $(this).attr('data-url');
                                var title = $(this).attr('data-title');
                                
                                if (typeof url !== 'undefined' && url !== false)
                                {
                                    History.pushState(null,title,url);
                                }
                            }
                        },
                        offset: function() {
                            return 0 - ($(this).height() - 20); //  - 20
                        }
                    });
                }
            }
            
            if (target == 'contact')
            {
                window.initialize();
            }
            else if (target == 'reservation')
            {
                // Date Picker
                $('#datepicker').datepicker({
                    format : 'dd/mm/yyyy'
                }).on('changeDate', function(ev){
                    $('#datepicker').datepicker('hide');
                });
                // Date Picker
            }
            else if (target == 'followus') {
                $('.insta-slider').slippry({
                    elements: 'li',
                    transition: 'fade',
                    pager: false,
                    controls: false,
                    useCSS: true,
                    speed: 1400,
                    pause: 10000,
                    captions: false,
                    responsive: true,
                    autoHover: false
                });
            }
            
            $('#' + target + ' .loading').fadeOut(200);
        });
    }
    
    $('.insta-slider').slippry({
        elements: 'li',
        transition: 'fade',
        pager: false,
        controls: false,
        useCSS: true,
        speed: 1400,
        pause: 10000,
        captions: false,
        responsive: true,
        autoHover: false
    });
    
    $('.nav-section').each(function() {
        var target = $(this).attr('id');
        var url = $(this).attr('data-url');
        
        if (typeof url !== 'undefined' && url !== false)
        {
            $('#' + target + ' .loading').fadeIn(100);
            loadContent(target, url + ' #ajax_content');
        }
        
        if ($('.hp').length > 0)
        {
            if (target == 'home')
            {
                $('#' + target).waypoint({
                    handler: function(direction) {
                        if (direction == 'down')
                        {
                            History.pushState(null,null,'/');
                        }
                    }
                }).waypoint({
                    handler: function(direction) {
                        if (direction == 'up')
                        {
                            History.pushState(null,null,'/');
                        }
                    },
                    offset: function() {
                        return 0 - $(this).height(); // 0 - $
                    }
                });
            }
        }
    });
    // Load in the content
    
	
    // Mobile Nav begin
    $('.mobile-nav-trigger').click(function() {
        if ($('.mobile-nav-dropdown').css('display') == 'block')
        {
            $('.mobile-nav-dropdown').fadeOut(200);
        }
        else
        {
            $('.mobile-nav-dropdown').fadeIn(200);
        }
        
        return false;
    });
    

    $('.mobile-nav-dropdown a').click(function() {
        if ($('.hp').length > 0)
        {
            pageScroller.goTo($(this).attr('data-target'));
            $('.mobile-nav-dropdown').fadeOut(200);
            return false;
        }
        else
        {
            return true;
        }
    });
	
    // Mobile Nav end
		
    // Page Scroller
    if ($('.hp').length > 0)
    {
        $('.section-wrapper').pageScroller({
            navigation: '.site-nav .desktop-nav a.scroll',
            scrollOffset: -45, // -45,
            sectionClass: 'nav-section',
            HTML5mode: true,
            animationType: 'easeInOutExpo',
            animationSpeed: 1400
        });

        $('a[data-target=#food]').unbind('click').bind('click', function(e){
            e.preventDefault();
            if($(this).text() == 'Christmas'){
                $(".menu-tabs li:not(.christmas_menu_tab)").add(".tab-content #lunch, .tab-content #dinner, .tab-content #pudding, .tab_content #new_year").hide();
                $(".tab-content #christmas").addClass('active');
                $("body").animate({
                    scrollTop : $(".menu-wrapper").offset().top
                }, 1400);
            } else if($(this).text() == 'New Year'){
                $(".menu-tabs li:not(.new_year_menu_tab)").add(".tab-content #lunch, .tab-content #dinner, .tab-content #pudding, .tab-content #christmas").hide();
                $(".tab-content #new_year").addClass('active');
                $("body").animate({
                    scrollTop : $(".menu-wrapper").offset().top
                }, 1400);
            } else {
                $(".menu-tabs li:not(:last)").add(".tab-content #lunch, .tab-content #dinner, .tab-content #pudding")/*.attr('style', '')*/;
                $(".tab-content #christmas").removeClass('active');
                pageScroller.goTo(4);
            }
        });
    }
    // Page Scroller
    
    
    // Image Slider
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    
    var delay = 8000;
    var transition = 1000;
    var path = '/wp-content/themes/fifteen/images/';
    var firstRun = true;
    
    $('.image-block').each(function() {
        
        $(this).show();
        var imageBlock = this;
        
        // Loop through each span and grab it's data
        var imageArr = new Array();
        
        $('span', this).each(function() {
            imageArr.push($(this).attr('data-image'));
        })
        
        // Loop through the resultant array to show the images
        var i = 0;
        var totalImages = imageArr.length;
        
        function loop()
        {
            // Check the document width and set the suffix accordingly
            var suffix = ".jpg";
            
            if ($(document).width() > 600)
            {
                suffix = ".jpg";
            }
            
            if ($(document).width() > 768)
            {
                suffix = ".jpg";
            }
            
            // Set the image path and suffix
            var currentImage = path + imageArr[i] + suffix;
            
            // Preload the image
            $.imgpreload(currentImage,
            {
                all: function()
                {
                    var targetSpan = $(':nth-child('+(i+1)+')', imageBlock);
                    targetSpan.css('background-image', 'url('+currentImage+')');
                    
                    if (Modernizr.csstransitions)
                    {
                        $('span:not(:nth-child('+(i+1)+'))', imageBlock).removeClass('active');
                        targetSpan.addClass('active');
                    }
                    else
                    {
                        $('span:not(:nth-child('+(i+1)+'))', imageBlock).animate({opacity:0}, transition);
                        targetSpan.animate({opacity:1}, transition);
                    } 
                    
                    if (!isMobile.any())
                    {					
                        if ($(document).width() > 950)
                        {
                            targetSpan.parallax("50%", -0.1);
                        }
                    }
                    
                    firstRun = false;
                }
            });
            
            i++;
            
            if (i >= totalImages)
            {
                i = 0;
            }
        }
        
        setInterval(loop, delay);
        
        loop();
    });
    // Image Slider
    
    
    // Sticky Nav
    $('.nav-wrapper').waypoint('sticky', {
        handler: function(direction) {}
    });
    // Sticky Nav
    
    
    // Message (Newsletter subs)
    if ($('.newsletter-message').css('display') == 'block')
    {
        setInterval(function() {
            $('.newsletter-message').fadeOut(800);
        }, 5000);
    }
    // Message (Newsletter subs)
    
    // Date Picker
    $('#datepicker').datepicker({
        format : 'dd/mm/yyyy'
    }).on('changeDate', function(ev){
        $('#datepicker').datepicker('hide');
    });
    // Date Picker
    
});