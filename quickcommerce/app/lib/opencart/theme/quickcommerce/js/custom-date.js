jQuery('.pp_date').datepicker({
    dateFormat:'mm/dd/yy',
    numberOfMonths: 1,
    onSelect: function(){
    	var myDate = new Date(this.value);
    	var myDateRaw = myDate.setDate(myDate.getDate());
    	jQuery('#'+jQuery(this).attr('id')+'_raw').attr('value', myDateRaw);
    }
});