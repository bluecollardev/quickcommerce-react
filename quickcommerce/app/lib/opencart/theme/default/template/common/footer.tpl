<footer>
  <div class="container-fluid">
    <div class="row">
      <?php if ($informations) { ?>
      <div class="col-sm-3">
        <h5><?php echo $text_information; ?></h5>
        <ul class="list-unstyled">
          <?php foreach ($informations as $information) { ?>
          <li><a href="<?php echo $information['href']; ?>"><?php echo $information['title']; ?></a></li>
          <?php } ?>
        </ul>
      </div>
      <?php } ?>
      <div class="col-sm-3">
        <h5><?php echo $text_service; ?></h5>
        <ul class="list-unstyled">
          <li><a href="<?php echo $contact; ?>"><?php echo $text_contact; ?></a></li>
          <li><a href="<?php echo $return; ?>"><?php echo $text_return; ?></a></li>
          <li><a href="<?php echo $sitemap; ?>"><?php echo $text_sitemap; ?></a></li>
        </ul>
      </div>
      <div class="col-sm-3">
        <h5><?php echo $text_extra; ?></h5>
        <ul class="list-unstyled">
          <li><a href="<?php echo $manufacturer; ?>"><?php echo $text_manufacturer; ?></a></li>
          <li><a href="<?php echo $voucher; ?>"><?php echo $text_voucher; ?></a></li>
          <li><a href="<?php echo $affiliate; ?>"><?php echo $text_affiliate; ?></a></li>
          <li><a href="<?php echo $special; ?>"><?php echo $text_special; ?></a></li>
        </ul>
      </div>
      <div class="col-sm-3">
        <h5><?php echo $text_account; ?></h5>
        <ul class="list-unstyled">
          <li><a href="<?php echo $account; ?>"><?php echo $text_account; ?></a></li>
          <li><a href="<?php echo $order; ?>"><?php echo $text_order; ?></a></li>
          <li><a href="<?php echo $wishlist; ?>"><?php echo $text_wishlist; ?></a></li>
          <li><a href="<?php echo $newsletter; ?>"><?php echo $text_newsletter; ?></a></li>
        </ul>
      </div>
    </div>
    <hr>
    <p><?php echo $powered; ?></p>
  </div>
</footer>
<script src="spa/js/src/react/react.js" type="text/javascript"></script>
<script src="spa/js/src/react-dom/react-dom.js" type="text/javascript"></script>
<!--<script src="spa/js/build/cart.js" type="text/javascript"></script>-->

<!-- grommet -->
<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400italic,400,700' rel='stylesheet' type='text/css'>

<script src="spa/js/src/grommet.min.js"></script>

<script src="spa/js/build/cart.js" type="text/javascript"></script>

<script src="spa/imported/taco_main.js" type="text/javascript"></script>
<script src="spa/imported/575770424.js" type="text/javascript"></script>
<script type="text/javascript">
    // Rudimentary scroll watcher, for complex apps we might want a dispatcher
    // Also, would be interesting to see if there's a React equivalent
    var w = window,
        doc = document;
    
    
    // This is very inefficient need to look at throttling
    function productSnapTop() {
        var scrollY = w.scrollY;
        
        var parent = doc.getElementById('product-tabs'),
            summary = parent.getElementsByClassName('summary-component')[0],
            productForm = doc.getElementsByClassName('product-form-component')[0];
            pinnedOffsetTop = parent.getElementsByClassName('pinned-offset-top')[0]; /* TODO: Multiple offsets and elements */
        
        if (typeof parent === 'undefined') return false;
        
        if (scrollY > 1830) {
            summary.classList.add('pinned');
            productForm.classList.add('pinned');
            
            pinnedOffsetTop.classList.add('offset-pinned'); // TODO: Use data attributes
        } else {
            summary.classList.remove('pinned');
            productForm.classList.remove('pinned');
            
            pinnedOffsetTop.classList.remove('offset-pinned'); // TODO: Use data attributes
        }
    }
    
    function categorySnapTop() {
        var scrollY = w.scrollY;
        
        var parent = doc.getElementById('category-tabs'),
            summary = parent.getElementsByClassName('summary-component')[0],
            //categoryForm = parent.getElementsByClassName('category-form-component')[0];
            pinnedOffsetTop = parent.getElementsByClassName('pinned-offset-top')[0]; /* TODO: Multiple offsets and elements */
        
        if (typeof parent === 'undefined') return false;
        
        if (scrollY > 1830) {
            summary.classList.add('pinned');
            //categoryForm.classList.add('pinned');
            
            pinnedOffsetTop.classList.add('offset-pinned'); // TODO: Use data attributes
        } else {
            summary.classList.remove('pinned');
            //categoryForm.classList.remove('pinned');
            
            pinnedOffsetTop.classList.remove('offset-pinned'); // TODO: Use data attributes
        }
    }
    
    window.addEventListener('scroll', function() {
        productSnapTop();
        categorySnapTop();
    });
</script>
</body></html>