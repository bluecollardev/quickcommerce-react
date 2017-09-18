
jQuery(document).ready(function() {
	jQuery('form#tg_reservation_form').submit(function() {
		jQuery('form#tg_reservation_form .error').remove();
		var hasError = false;
		jQuery('form#tg_reservation_form .required_field').each(function() {
			if(jQuery.trim(jQuery(this).val()) == '') {
				var labelText = jQuery(this).prev('label').text();
				jQuery('#reponse_msg ul').append('<li class="error">Please enter '+labelText+'</li>');
				hasError = true;
			} else if(jQuery(this).hasClass('email')) {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!emailReg.test(jQuery.trim(jQuery(this).val()))) {
					var labelText = jQuery(this).prev('label').text();
					jQuery('#reponse_msg ul').append('<li class="error">Please enter valid '+labelText+'</li>');
					hasError = true;
				}
			}
		});
		if(!hasError) {
			var contactData = jQuery('#tg_reservation_form').serialize();

			jQuery('#contact_submit_btn').fadeOut('normal', function() {
				jQuery(this).parent().append('<i class="fa fa-circle-o-notch fa-spin"></i>');
			});
 			
 			jQuery.ajax({
			    type: 'POST',
			    url: tgAjax.ajaxurl,
			    data: contactData+'&tg_security='+tgAjax.ajax_nonce,
			    success: function(results){
			    	jQuery('#tg_reservation_form').hide();
			    	jQuery('#reponse_msg').html(results);
			    }
			});
		}
		
		return false;
		
	});
});