<?php echo $header; ?>
<style type="text/css">
  body {
    background-color: rgb(5,4,7);
  }

  .ppb_wrapper {
    overflow: hidden;
  }

  .light {
    background-color: rgb(255,255,255);
  }

  .mid {
    background-color: rgb(188,188,188);
  }

  #footer {
    background-color: rgb(2,2,2);
  }

  .one:nth-last-child(2) {

  }

  .divider:last-child {
    display: none;
  }

  .flickr .img_frame {
    display: flex;
    height: 75px;
    margin-bottom: 10px;
    overflow: hidden;
    width: 75px;
  }

  @media (max-width: 1024px) {
    .forcefullwidth_wrapper_tp_banner, .rev_slider_wrapper, .slotholder {
      max-height: 600px !important;

    }

    .slotholder .tp-bgimg {
      background-size: contain !important;
      background-position: left top !important;
    }
  }

  @media (max-width: 768px) {
    .forcefullwidth_wrapper_tp_banner, .rev_slider_wrapper, .slotholder {
      max-height: 330px !important;

    }

    .slotholder .tp-bgimg {
      background-size: contain !important;
      background-position: left top !important;
    }

    .page_content_wrapper .inner,
    .flex-column {
      display: flex;
      flex-flow: column nowrap;
      width: 100% !important;
    }

    .hide-mobile {
      display: none;
    }

    .text-heading {
      font-size: 20px !important;
    }

    .text-sub {
      font-size: 20px !important;
    }
  }
</style>
<style id="rs-plugin-settings-inline-css" type="text/css">
  .tp-caption a {
    color: #ff7302;
    text-shadow: none;
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    -o-transition: all 0.2s ease-out;
    -ms-transition: all 0.2s ease-out
  }

  .tp-caption a:hover {
    color: #ffa902
  }

  .tp-caption.title-first-word,
  .title-first-word {
    font-size: 60px;
    line-height: 50px;
    font-family: Kristi;
    color: #cfa670;
    text-decoration: none;
    background-color: transparent;
    border-width: 0px;
    border-color: rgb(0, 0, 0);
    border-style: none;
    text-shadow: none
  }

  .tp-caption.title,
  .title {
    font-size: 65px;
    font-weight: 300;
    font-family: Lato;
    color: rgb(255, 255, 255);
    text-decoration: none;
    background-color: transparent;
    border-width: 0px;
    border-color: rgb(0, 0, 0);
    border-style: none;
    text-shadow: none;
    text-transform: uppercase;
    letter-spacing: -3px
  }

  .tp-caption.sub-title,
  .sub-title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 400;
    font-family: Lato;
    color: rgb(255, 255, 255);
    text-decoration: none;
    background-color: transparent;
    border-width: 0px;
    border-color: rgb(0, 0, 0);
    border-style: none;
    text-shadow: none;
    text-transform: uppercase;
    letter-spacing: -1px
  }

  #rev_slider_1_1_wrapper .tp-loader.spinner3 div {
    background-color: #444444 !important;
  }

  .ppb_wrapper {
    background: url(http://d1fki99wqld33s.cloudfront.net/assets/net.png) repeat;
  }
</style>
<div id="container" class="container j-container">
  <div class="row"><?php echo $column_left; ?><?php echo $column_right; ?>
    <?php if ($column_left && $column_right) { ?>
    <?php $class = 'col-sm-6'; ?>
    <?php } elseif ($column_left || $column_right) { ?>
    <?php $class = 'col-sm-9'; ?>
    <?php } else { ?>
    <?php $class = 'col-sm-12'; ?>
    <?php } ?>
    <div id="content" class="<?php echo $class; ?>">
      <div style="" class="ppb_wrapper ">
        <div class="one fullwidth ">
          <div class="forcefullwidth_wrapper_tp_banner" id="rev_slider_1_1_forcefullwidth" style="position:relative;width:100%;height:760px;margin-top:0px;margin-bottom:0px">
            <div id="rev_slider_1_1_wrapper" class="rev_slider_wrapper fullscreen-container tp-mouseover" style="background-color: rgb(38, 38, 38); padding: 0px; margin-top: 0px; margin-bottom: 0px; position: absolute; max-height: 760px; overflow: visible; width: 1903px; left: 0px; height: 971px;">
              <div data-slideactive="rs-1" id="rev_slider_1_1" class="rev_slider fullscreenbanner revslider-initialised tp-simpleresponsive" style="max-height: none; margin-top: 0px; margin-bottom: 0px; height: 100%;" data-version="5.2.5.1">
                <ul style="visibility: visible; display: block; overflow: hidden; width: 100%; height: 100%; max-height: none;" class="tp-revslider-mainul">
                  <li style="width: 100%; height: 100%; overflow: hidden; z-index: 20; visibility: inherit; opacity: 1; background-color: rgba(255, 255, 255, 0);" class="tp-revslider-slidesli active-revslide" data-index="rs-1" data-transition="zoomin" data-slotamount="7" data-hideafterloop="0" data-hideslideonmobile="off" data-easein="default" data-easeout="default" data-masterspeed="300" data-thumb="" data-rotate="0" data-saveperformance="on" data-title="Slide">
                    <div class="slotholder" style="position: absolute; top: 0px; left: 0px; z-index: 0; width: 100%; height: 760px; visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
                      <div src="" class="tp-bgimg defaultimg" style="background-color: transparent; background-repeat: no-repeat; background-size: cover; background-position: center top; width: 100%; height: 100%; opacity: 1; visibility: inherit; z-index: 20; background-image: url('assets/images/banners/banner-leva.jpg');"></div>
                    </div>
                    <div class="tp-parallax-wrap" style="position: absolute; visibility: visible; left: 329px; top: 481px; z-index: 5;">
                      <div class="tp-loop-wrap" style="position:absolute;">
                        <div class="tp-mask-wrap" style="position: absolute; overflow: visible; height: auto; width: auto; display: none;">
                          <div class="tp-caption title-first-word tp-resizeme" id="slide-1-layer-1" data-x="90" data-y="center" data-voffset="20" data-width="auto" data-height="auto" data-transform_idle="" data-transform_in="opacity:0;s:300;e:Power3.easeInOut;" data-transform_out="auto:auto;s:300;" data-start="450" data-splitin="none" data-splitout="none" data-responsive_offset="on" style="z-index: 5; white-space: nowrap; border-color: rgb(0, 0, 0); visibility: inherit; transition: none 0s ease 0s ; line-height: 50px; border-width: 0px; margin: 0px; padding: 0px; letter-spacing: 0px; font-weight: 400; font-size: 60px; min-height: 0px; min-width: 0px; max-height: none; max-width: none; opacity: 1; transform-origin: 50% 50% 0px; transform: translate3d(0px, 0px, 0px);">Welcome to </div>
                        </div>
                      </div>
                    </div>
                    <div class="tp-parallax-wrap" style="position: absolute; visibility: visible; left: 329px; top: 507px; z-index: 6;">
                      <div class="tp-loop-wrap" style="position:absolute;">
                        <div class="tp-mask-wrap" style="position: absolute; overflow: visible; height: auto; width: auto;">
                          <div class="tp-caption title tp-resizeme" id="slide-1-layer-2" data-x="90" data-y="center" data-voffset="80" data-width="auto" data-height="auto" data-transform_idle="" data-transform_in="opacity:0;s:300;e:Power3.easeInOut;" data-transform_out="auto:auto;s:300;" data-start="500" data-splitin="none" data-splitout="none" data-responsive_offset="on" style="z-index: 6; white-space: nowrap; color: rgb(255, 255, 255); border-color: rgb(0, 0, 0); visibility: inherit; transition: none 0s ease 0s ; line-height: 117px; border-width: 0px; margin: 0px; padding: 0px; letter-spacing: -3px; font-weight: 300; font-size: 65px; min-height: 0px; min-width: 0px; max-height: none; max-width: none; opacity: 1; transform-origin: 50% 50% 0px; transform: translate3d(0px, 0px, 0px); display: none;">Grand<strong style="transition: none 0s ease 0s ; line-height: 117px; border-width: 0px; margin: 0px; padding: 0px; letter-spacing: -3px; font-weight: 300; font-size: 65px;">Restaurant</strong> </div>
                        </div>
                      </div>
                    </div>
                    <div class="tp-parallax-wrap" style="position: absolute; visibility: visible; left: 329px; top: 612px; z-index: 7;">
                      <div class="tp-loop-wrap" style="position:absolute;">
                        <div class="tp-mask-wrap" style="position: absolute; overflow: visible; height: auto; width: auto;">
                          <div class="tp-caption sub-title tp-resizeme" id="slide-1-layer-3" data-x="90" data-y="center" data-voffset="150" data-width="auto" data-height="auto" data-transform_idle="" data-transform_in="opacity:0;s:300;e:Power3.easeInOut;" data-transform_out="auto:auto;s:300;" data-start="500" data-splitin="none" data-splitout="none" data-responsive_offset="on" style="z-index: 7; white-space: nowrap; color: rgb(255, 255, 255); border-color: rgb(0, 0, 0); visibility: inherit; transition: none 0s ease 0s ; line-height: 24px; border-width: 0px; margin: 0px; padding: 0px; letter-spacing: -1px; font-weight: 400; font-size: 20px; min-height: 0px; min-width: 0px; max-height: none; max-width: none; opacity: 1; transform-origin: 50% 50% 0px; transform: translate3d(0px, 0px, 0px);"></div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="tp-bannertimer tp-bottom" style="visibility: hidden !important; width: 0%;"></div>
                <div style="display: none;" class="tp-loader spinner3">
                  <div class="dot1"></div>
                  <div class="dot2"></div>
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </div>
              </div>
              <script>
                var htmlDiv = document.getElementById("rs-plugin-settings-inline-css");
                var htmlDivCss = ".tp-caption.title-first-word,.title-first-word{font-size:60px;line-height:50px;font-family:Kristi;color:#cfa670;text-decoration:none;background-color:transparent;border-width:0px;border-color:rgb(0,0,0);border-style:none;text-shadow:none}.tp-caption.title,.title{font-size:65px;font-weight:300;font-family:Lato;color:rgb(255,255,255);text-decoration:none;background-color:transparent;border-width:0px;border-color:rgb(0,0,0);border-style:none;text-shadow:none;text-transform:uppercase;letter-spacing:-3px}.tp-caption.sub-title,.sub-title{font-size:20px;line-height:24px;font-weight:400;font-family:Lato;color:rgb(255,255,255);text-decoration:none;background-color:transparent;border-width:0px;border-color:rgb(0,0,0);border-style:none;text-shadow:none;text-transform:uppercase;letter-spacing:-1px}";
                if (htmlDiv) {
                  htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
                } else {
                  var htmlDiv = document.createElement("div");
                  htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
                  document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
                }
              </script>
              <script type="text/javascript">
                /******************************************
                 -	PREPARE PLACEHOLDER FOR SLIDER	-
                 ******************************************/

                /*var setREVStartSize = function() {
                  try {
                    var e = new Object,
                        i = jQuery(window).width(),
                        t = 9999,
                        r = 0,
                        n = 0,
                        l = 0,
                        f = 0,
                        s = 0,
                        h = 0;
                    e.c = jQuery('#rev_slider_1_1');
                    e.gridwidth = [1425];
                    e.gridheight = [650];

                    e.sliderLayout = "fullscreen";
                    e.fullScreenAutoWidth = 'off';
                    e.fullScreenAlignForce = 'off';
                    e.fullScreenOffsetContainer = '';
                    e.fullScreenOffset = '';
                    if (e.responsiveLevels && (jQuery.each(e.responsiveLevels, function(e, f) {
                          f > i && (t = r = f, l = e), i > f && f > r && (r = f, n = e)
                        }), t > r && (l = n)), f = e.gridheight[l] || e.gridheight[0] || e.gridheight, s = e.gridwidth[l] || e.gridwidth[0] || e.gridwidth, h = i / s, h = h > 1 ? 1 : h, f = Math.round(h * f), "fullscreen" == e.sliderLayout) {
                      var u = (e.c.width(), jQuery(window).height());
                      if (void 0 != e.fullScreenOffsetContainer) {
                        var c = e.fullScreenOffsetContainer.split(",");
                        if (c) jQuery.each(c, function(e, i) {
                          u = jQuery(i).length > 0 ? u - jQuery(i).outerHeight(!0) : u
                        }), e.fullScreenOffset.split("%").length > 1 && void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 ? u -= jQuery(window).height() * parseInt(e.fullScreenOffset, 0) / 100 : void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 && (u -= parseInt(e.fullScreenOffset, 0))
                      }
                      f = u
                    } else void 0 != e.minHeight && f < e.minHeight && (f = e.minHeight);
                    e.c.closest(".rev_slider_wrapper").css({
                      height: f
                    })

                  } catch (d) {
                    console.log("Failure at Presize of Slider:" + d)
                  }
                };

                setREVStartSize();

                var tpj = jQuery;
                tpj.noConflict();
                var revapi1;
                tpj(document).ready(function() {
                  if (tpj("#rev_slider_1_1").revolution == undefined) {
                    revslider_showDoubleJqueryError("#rev_slider_1_1");
                  } else {
                    revapi1 = tpj("#rev_slider_1_1").show().revolution({
                      sliderType: "standard",
                      jsFileLocation: "//themes.themegoods2.com/grandrestaurant/wp-content/plugins/revslider/public/assets/js/",
                      sliderLayout: "fullscreen",
                      dottedOverlay: "none",
                      delay: 7000,
                      navigation: {
                        keyboardNavigation: "off",
                        keyboard_direction: "horizontal",
                        mouseScrollNavigation: "off",
                        mouseScrollReverse: "default",
                        onHoverStop: "off",
                        touch: {
                          touchenabled: "on",
                          swipe_threshold: 75,
                          swipe_min_touches: 1,
                          swipe_direction: "horizontal",
                          drag_block_vertical: false
                        }
                      },
                      visibilityLevels: [1240, 1024, 778, 480],
                      gridwidth: 1425,
                      gridheight: 650,
                      lazyType: "none",
                      shadow: 0,
                      spinner: "spinner3",
                      stopLoop: "off",
                      stopAfterLoops: -1,
                      stopAtSlide: -1,
                      shuffle: "off",
                      autoHeight: "off",
                      fullScreenAutoWidth: "off",
                      fullScreenAlignForce: "off",
                      fullScreenOffsetContainer: "",
                      fullScreenOffset: "",
                      disableProgressBar: "on",
                      hideThumbsOnMobile: "off",
                      hideSliderAtLimit: 0,
                      hideCaptionAtLimit: 0,
                      hideAllCaptionAtLilmit: 0,
                      debugMode: false,
                      fallbacks: {
                        simplifyAll: "off",
                        nextSlideOnWindowFocus: "off",
                        disableFocusListener: false,
                      }
                    });
                  }
                });*/
              </script>
              <script>
                var htmlDivCss = '	#rev_slider_1_1_wrapper .tp-loader.spinner3 div { background-color: #444444 !important; } ';
                var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
                if (htmlDiv) {
                  htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
                } else {
                  var htmlDiv = document.createElement('div');
                  htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
                  document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
                }
              </script>
              <div class="icon-scroll"></div>
              <div class="icon-scroll"></div></div>
            <div class="tp-fullwidth-forcer" style="width: 100%; height: 971px;"></div>
          </div>
        </div>

        <div class="one withsmallpadding ppb_text" style="text-align:center;padding-bottom:0 !important;padding:50px 0 50px 0;">
          <div class="page_content_wrapper">
            <div class="inner" style="margin:auto;">
              <div class="flex-column" style="width:75%;float:right;">
                <!--<div class="flex-column hide-mobile" style="width:25%;float:right;">
                  <img src="assets/images/effing-logo.png" style="max-height:180px;position:relative;top:-30px;right:35px;z-index:999;" />
                </div>-->
                <div class="flex-column" style="width:100%;float:right; border-left:1px solid white; box-sizing:border-box; padding-left: 40px; padding-right: 40px;">
                  <div class="text-heading" style="font-size:23px;text-transform:uppercase;letter-spacing:-1px;font-weight:300;color:#f4f4f4;">" The atmosphere at Leva is decidedly upbeat, a bright, airy space with floor-to-ceiling windows that offer panoramic views of the Garneau streetscape. Leva breaks every coffee shop stereotype save for one: the fact it serves a fine series of Italian coffees. "</div>
                  <div class="post_detail"><span style="color:#f4f4f4;">Sandor - Avenue Magazine</span></div>
                  <!--<p><span style="font-family:Kristi;font-size:40px;font-weight:600;color:#f4f4f4;">Effin' Rob</span></p>-->
                </div>
              </div>
              <div class="flex-column" style="width:25%;float:right;">
                <div class="text-sub" style="font-size:23px;text-transform:uppercase;letter-spacing:-1px;font-weight:300;color:#f4f4f4;">
                  Edmonton's Best Restaurants
                </div>
                <div class="post_detail">
                  <span style="color:#f4f4f4;">Check us out in Avenue Magazine</span>
                  <br>
                  <img src="assets/images/googleplay40.png" />
                  <img src="assets/images/appstore40.png" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--<div class="divider one">&nbsp;</div>-->
        <div style="height: 582px;" class="parallax title" data-image="assets/images/banners/banner-lunch-01.jpg" data-width="1800" data-height="1200" data-content-height="60">
          <div class="parallax_title">
            <h2 class="ppb_title"><span class="ppb_title_first">our food is crafted with love using</span>LOCALLY SOURCED, FRESH INGREDIENTS</h2>
          </div>
        </div>
        <?php echo $content_top; ?>

        <!-- OFF -->
        <?php /*
        <div class="ppb_portfolio one nopadding light" style="padding:0px 0 0px 0;">
          <div class="page_content_wrapper fullwidth">
            <div style="position: relative; overflow: hidden; height: 1140px;" class="portfolio_filter_wrapper four_cols gallery portfolio-content section content clearfix visible isotope">
              <div style="position: absolute; left: 0px; top: 0px; transform: translate(0px, 0px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated1">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Pizza" href="assets/images/menu-items/13651851_1744955552423519_491966790_n.jpg" class="fancy-gallery"><i class="fa fa-search"></i></a><a href=""><i class="fa fa-shopping-cart"></i></a>&lt;</div>
                    </div>
                  </div><img src="assets/images/menu-items/13651851_1744955552423519_491966790_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3190" class="portfolio_desc portfolio4 filterable">
                  <div id="menu_3190" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Pizza</span> <span class="menu_dots"></span><span class="menu_price">$11.00</span></h5>
                    <div class="post_detail menu_excerpt">Fresh tomatoes, romaine lettuce, jalapenos, basil, bocconchini, avocado</div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; left: 0px; top: 0px; transform: translate(476px, 0px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated2">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Wild Smoked Salmon Platter" href="assets/images/menu-items/10986037_1589604221274490_1385154560_n.jpg" class="fancy-gallery"><i class="fa fa-search"></i></a><a href=""><i class="fa fa-shopping-cart"></i></a>&lt;</div>
                    </div>
                  </div><img src="assets/images/menu-items/10986037_1589604221274490_1385154560_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3191" class="portfolio_desc portfolio4 filterable">
                  <div id="menu_3191" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Wild Smoked Salmon Platter</span> <span class="menu_dots"></span><span class="menu_price">$9.00</span></h5>
                    <div class="post_detail menu_excerpt">Cream cheese, capers and red onion served with artisan toasted bread</div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; left: 0px; top: 0px; transform: translate(476px, 570px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated6">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Bocconcini Salad" href="assets/images/menu-items/11909145_665416690227674_1250941858_n.jpg" class="fancy-gallery" title=""><i class="fa fa-search"></i></a><a href=""><i class="fa fa-shopping-cart"></i></a>&lt;</div>
                    </div>
                  </div><img src="assets/images/menu-items/11909145_665416690227674_1250941858_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3195" class="portfolio_desc portfolio4 filterable">
                  <div id="menu_3195" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Bocconcini Salad</span> <span class="menu_dots"></span><span class="menu_price">$18.00</span></h5>
                    <div class="post_detail menu_excerpt">Fresh tomatoes, romaine lettuce, jalapenos, basil, bocconchini, avocado</div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; left: 0px; top: 0px; transform: translate(476px, 570px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated6">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Lulu Salad" href="assets/images/menu-items/13397577_906657319444612_511957587_n.jpg" class="fancy-gallery" title=""><i class="fa fa-search"></i></a><a href=""><i class="fa fa-shopping-cart"></i></a>&lt;</div>
                    </div>
                  </div><img src="assets/images/menu-items/13397577_906657319444612_511957587_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3195" class="portfolio_desc portfolio4 filterable">
                  <div id="menu_3195" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Lulu Salad</span> <span class="menu_dots"></span><span class="menu_price">$18.00</span></h5>
                    <div class="post_detail menu_excerpt">Fresh tomatoes, romaine lettuce, jalapenos, basil, bocconchini, avocado</div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; left: 0px; top: 0px; transform: translate(1428px, 0px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated4">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Grilled Panini" href="assets/images/menu-items/13181330_1159697050759109_699237276_n.jpg" class="fancy-gallery"><i class="fa fa-search"></i></a><a href=""><i class="fa fa-shopping-cart"></i></a>&lt;</div>
                    </div>
                  </div><img src="assets/images/menu-items/13181330_1159697050759109_699237276_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3193" class="portfolio_desc portfolio4 filterablelast">
                  <div id="menu_3193" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Grilled Panini</span> <span class="menu_dots"></span><span class="menu_price">$12.50</span></h5>
                    <div class="post_detail menu_excerpt">Tuna Melt / Prosciutto Cotto & Genoa Salami / Cheese</div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; left: 0px; top: 0px; transform: translate(0px, 570px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated5">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Hummus Platter" href="assets/images/menu-items/12568241_981146865312844_943982190_n.jpg" class="fancy-gallery"><i class="fa fa-search"></i></a><a href=""><i class="fa fa-shopping-cart"></i></a>&lt;</div>
                    </div>
                  </div><img src="assets/images/menu-items/12568241_981146865312844_943982190_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3194" class="portfolio_desc portfolio4 filterable">
                  <div id="menu_3194" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Hummus Platter</span> <span class="menu_dots"></span><span class="menu_price">$10.00</span></h5>
                    <div class="post_detail menu_excerpt">Potato and fresh bocconchini lightly fried and coated in bread crumbs</div>
                  </div>
                </div>
              </div>

              <div style="position: absolute; left: 0px; top: 0px; transform: translate(952px, 570px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated7">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Arancini" href="assets/images/menu-items/13269472_1105876092798548_164451095_n.jpg" class="fancy-gallery" title=""><i class="fa fa-search"></i></a></div>
                    </div>
                  </div><img src="assets/images/menu-items/13269472_1105876092798548_164451095_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3196" class="portfolio_desc portfolio4 filterable">
                  <div id="menu_3196" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Arancini</span> <span class="menu_dots"></span><span class="menu_price">$12.00</span></h5>
                    <div class="post_detail menu_excerpt">Pea, saffron, and fonitna stuffed and fried risotto rice balls coated in bread crumbs</div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; left: 0px; top: 0px; transform: translate(1428px, 570px);" class="element classic3_cols isotope-item">
                <div class="one_fourth gallery4 filterablestatic animated8">
                  <div class="button_wrapper">
                    <div class="button_center">
                      <div class="button_content"><a data-title="Crocchette di Patate" href="assets/images/menu-items/13267308_1009932489059854_493804475_n.jpg" class="fancy-gallery" title=""><i class="fa fa-search"></i></a><a href=""><i class="fa fa-shopping-cart"></i></a>&lt;</div>
                    </div>
                  </div><img src="assets/images/menu-items/13267308_1009932489059854_493804475_n.jpg" alt=""></div><br class="clear">
                <div id="portfolio_desc_3197" class="portfolio_desc portfolio4 filterablelast">
                  <div id="menu_3197" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title">Crocchette di Patate</span> <span class="menu_dots"></span><span class="menu_price">$12.00</span></h5>
                    <div class="post_detail menu_excerpt">Potato and fresh bocconchini lightly fried and coated in bread crumbs</div>
                    <div class="menu_highlight"><i class="fa fa-star"></i></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        */ ?>

        <div style="height: 582px;" class="parallax title" data-image="assets/images/cafe/GettyImages-477481251_super.jpg" data-width="1200" data-height="800" data-content-height="60">
          <div class="parallax_title">
            <h2 class="ppb_title"><span class="ppb_title_first">Traditionally Inspired Italian Coffee</h2>
          </div>
        </div>
        <?php echo $content_bottom; ?>
        <div class="divider one">&nbsp;</div>
        <div class="one" style="padding: 70px 0px !important; position: relative;">
          <div style="" class="standard_wrapper">
            <div style="" class="page_content_wrapper">
              <div style="" class="inner">
                <div class="one_half parallax_scroll_image" style="width:65%;">
                  <div class="image_classic_frame expand">
                    <div class="image_wrapper">
                      <a href="assets/images/banners/banner-breakfast-01.jpg" class="img_frame"><img src="assets/images/banners/banner-breakfast-01.jpg" alt="" class="portfolio_img"></a>
                    </div>
                  </div>
                </div>
                <div class="one_half last parallax_scroll" style="width: 40%; position: absolute; right: 90px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 40px; transform: translate3d(0px, 119.645px, 0px); display: none;" data-stellar-ratio="1.3">
                  <h2 class="ppb_menu_title">Caffe and Specialty Drinks</h2>
                  <div id="menu_3171" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Espresso</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_2878" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Americano</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_3186" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Cappucino</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_3186" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Chai Latte</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_3186" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">London Fog</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_3187" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Macchiato</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_3187" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Vanilla Latte</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_3187" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Mocha</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                  <div id="menu_3187" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#ffffff;">Caffe Affogato</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#ffffff;">Reg $4.00 / Large $6.00</span></h5>
                  </div>
                </div><br class="clear"></div>
            </div>
          </div>
        </div>
        <div class="divider one">&nbsp;</div>
        <div class="one" style="padding: 70px 0px !important; position: relative;">
          <div style="" class="standard_wrapper">
            <div style="" class="page_content_wrapper">
              <div style="" class="inner">
                <div class="one_half parallax_scroll" style="width: 40%; position: absolute; left: 90px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 40px; z-index: 2; transform: translate3d(0px, 195.455px, 0px); display: none;" data-stellar-ratio="1.3">
                  <h2 class="ppb_menu_title">Wine and Cold Beverages</h2>
                  <div id="menu_3171" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#fff;">Reversanti Extra-Dry DOC</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#fff;">Glass $11.00 / Bottle $44.00</span></h5>
                    <div class="post_detail menu_excerpt">Spumante Prosecco - Blurb about the wine</div>
                  </div>
                  <div id="menu_2878" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#fff;">Cleto Chiarli Rose DOC</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#fff;">Glass $13.00 / Bottle $52.00</span></h5>
                    <div class="post_detail menu_excerpt">Spumante Lambrusco - Blurb about the wine</div>
                  </div>
                  <div id="menu_3186" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#fff;">Dal Cero Corte Ramato IGT 2014</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#fff;">Glass $11.00 / Bottle $44.00</span></h5>
                    <div class="post_detail menu_excerpt">Rosato Pino Grigio</div>
                    <!--<div class="menu_order"><a href="">Order</a></div>-->
                  </div>
                  <div id="menu_3189" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#fff;">Feudi di San Gregorio DOC 2015</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#fff;">Glass $11.00 / Bottle $44.00</span></h5>
                    <div class="post_detail menu_excerpt">Bianco Falanghina</div>
                    <!--<div class="menu_order"><a href="">Order</a></div>-->
                  </div>
                  <div id="menu_3189" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#fff;">Di Majo Norante IGT 2014</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#fff;">Glass $11.00 / Bottle $44.00</span></h5>
                    <div class="post_detail menu_excerpt">Rosso Sangiovese</div>
                    <!--<div class="menu_order"><a href="">Order</a></div>-->
                  </div>
                  <div id="menu_3189" class="menu_content_classic">
                    <h5 class="menu_post"> <span class="menu_title" style="background:#fff;">Feudi di San Gregorio DOC 2014</span> <span class="menu_dots"></span> <span class="menu_price" style="background:#fff;">Glass $11.00 / Bottle $44.00</span></h5>
                    <div class="post_detail menu_excerpt">Rosso Promitivo</div>
                    <!--<div class="menu_order"><a href="">Order</a></div>-->
                  </div>
                </div>
                <div class="one_half parallax_scroll_image last" style="width:65%;">
                  <div class="image_classic_frame expand">
                    <div class="image_wrapper">
                      <a href="" class="img_frame"><img src="assets/images/banners/banner-wine.jpg" alt="" class="portfolio_img"></a>
                    </div>
                  </div>
                </div><br class="clear"></div>
            </div>
          </div>
        </div>
        <div class="divider one">&nbsp;</div>

        <div class="one" style="padding: 50px 0px 70px !important; position: relative;">
          <div style="" class="standard_wrapper">
            <div style="" class="page_content_wrapper">
              <div style="" class="inner">
                <div class="one_half parallax_scroll_image" style="width:65%;">
                  <div class="image_classic_frame expand">
                    <div class="image_wrapper">
                      <a href="" class="img_frame"><img src="assets/images/banners/720x480/2014-01-21-20.08.01-1.jpg" alt="" class="portfolio_img"></a>
                    </div>
                  </div>
                </div>
                <div class="one_half last parallax_scroll" style="width: 40%; position: absolute; right: 90px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 40px; transform: translate3d(0px, -92.76px, 0px); display: none;" data-stellar-ratio="1.3">
                  <h2 class="ppb_title"><span class="ppb_title_first">A taste of Italy, </span>in the heart of Garneau</h2>
                  <div class="ppb_subtitle">The hub of coffee culture in Edmonton</div>
                  <div class="page_header_sep left"></div>Leva is located in the heart of Garneau, one of Edmonton’s top neighborhoods. Our cafe has been in operation for 10 years and has been a leader in creating a strong coffee culture in Edmonton, specializing in traditional Italian style espresso drinks, organic gelato & sorbetto, and some of the best pizza you’ll find around. Start your morning at Leva with freshly baked pastries and bright sunshine, or join us for an evening on the patio with a great cappuccino or a glass of wine & cheese platter.
                </div><br class="clear"></div>
            </div>
          </div>
        </div>

        <div class="divider one">&nbsp;</div>

        <!-- Laggy parallax -->
        <!--<div style="height: 800px; padding: 70px 0px !important; position: relative;" class="one parallax" data-image="assets/images/k5186243.b+w-dark-full.jpg" data-width="1800" data-height="1200" data-content-height="90">-->
        <div style="height: 800px; padding: 70px 0px !important; position: relative;" class="one parallax" data-width="1800" data-height="1200" data-content-height="90">
          <div style="" class="standard_wrapper">
            <div style="" class="page_content_wrapper">
              <div style="" class="inner">
                <div class="one_half parallax_scroll" style="width: 40%; position: absolute; left: 90px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 40px; transform: translate3d(0px, 181.445px, 0px); display: none;" data-stellar-ratio="1.3">
                  <h2 class="ppb_title"><span class="ppb_title_first">catering and</span>SPECIAL EVENTS</h2>
                  <div class="ppb_subtitle">Checkout our restaurant and special dishes</div>
                  <div class="page_header_sep left"></div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi.<br><br><a href="" class="button">View Gallery</a>
                </div><br class="clear">
                <div class="one_half parallax_scroll_image last" style="width:65%;">
                  <div class="image_classic_frame expand">
                    <div class="image_wrapper">
                      <a href="" class="img_frame"><img src="assets/images/banners/banner-evening.jpg" alt="" class="portfolio_img"></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider one">&nbsp;</div>
      </div>
    </div>
  </div>
</div>
<?php echo $footer; ?>