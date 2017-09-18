// CallForPrice
var clickedButtons;
var lastProductId = null;
var lastQuantity = null;

function cfpAddToCart(product_id, quantity) {
	quantity = typeof(quantity) != 'undefined' ? quantity : 1;
	$.ajax({
		url: 'index.php?route=checkout/cart/add',
		type: 'post',
		data: 'product_id=' + product_id + '&quantity=' + quantity,
		dataType: 'json',
		success: function(json) {
			$('.alert, .text-danger').remove();
			$('#cart > button').button('reset');

			if (json['CFP']) {
				$('#CFP_popup').detach().appendTo('body');
				var btn = clickedButtons;

				offset = $(btn).offset();
				var leftOffset = offset.left + (parseInt($(btn).width()/2));
				$('div#CFP_popup').css({
					top: offset.top,
					left: ((offset.left-$('div#CFP_popup').width()/2) + $(btn).width()/2)
				});

				$('div#CFP_popup').fadeIn('slow');
				$(".CFP_popover-content").load("index.php?route=module/callforprice/showform&product_id="+product_id);
			} else {
				if (json['redirect']) {
					location = json['redirect'];
				}
				
				if (json['success']) {
					$('#content').parent().before('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + json['success'] + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>');

					$('#cart-total').html(json['total']);

					$('html, body').animate({ scrollTop: 0 }, 'slow');

					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
			}	
		}
	});
}

function cfp(e, product_id, quantity) {
	e.preventDefault();
	e.stopPropagation();
	clickedButtons = e.target;
	cfpAddToCart(product_id, quantity);
}

$(document).ready(function() {
	$.ajax({
		url: 'index.php?route=module/callforprice/getproducts',
		dataType: 'json',
		success: function(json) {
			if (json['enabled']) {
				if (json['products']) {
					var t = null;
					var CFP = json['products'];
					if (CFP=='all') { 
						t = $('[onclick^="cart.add(\'"]');
						CFP = [1];
					}
					for (var x=0;x<CFP.length;x++) {
						if (json['products']!='all') {
							t = $('[onclick^="cart.add(\''+CFP[x]+'"]');
						}
						if (t.size()) {
							if (t[0].tagName == 'INPUT') {
								t.attr('value', json['button']);	
							}
							if (t[0].tagName == 'A') {
								t.html(json['button']);	
							}
							if (t[0].tagName == 'BUTTON') {
								t.find('span').text(json['button']);	
							}
						}
					}
				}
			}
		},
		complete: function() {
			$('[onclick^="cart.add"]').each(function(i,e){
				var params = $(this).attr('onclick').match(/\d+/);
				var func_call = 'cfp(event, ';
				if (params) {
					if (params[0]) {
						func_call += params[0];
						if (params[1]) {
							func_call += ', ' + params[1];
						} else {
							func_call += ', 1';
						}
					}
				}
				func_call += ');';
				$(this).attr('onclick', func_call);
			});	
		}
	});
	
	
	
	
	

});


