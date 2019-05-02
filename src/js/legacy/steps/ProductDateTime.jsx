export default {
    //key: opt.name,
    //type: opt.type,
    selectOnClick: false,
    after: function (data) {
        console.log('executing product step [' + data.step + '] after callback');
        console.log('product', data.product);
        console.log('view-model', data.viewModel);
        console.log('item', data.item);

        var productDownloads = viewModel.get('product_downloads');

        // If product configuration does not exist, then create one
        if (typeof productDownloads === 'undefined' || !(productDownloads instanceof kendo.data.ObservableObject)) {
            productDownloads = new kendo.data.ObservableObject();
            viewModel.set('product_downloads', productDownloads);
        }

        // Wouldn't this be better to use a datasource?
        var productId = viewModel.get('product_config.product_id');
        if (typeof productId !== 'undefined') {
            var downloadInfo = productDownloads.get('product_' + productId);
            if (typeof downloadInfo === 'undefined') {
                downloadInfo = new kendo.data.ObservableObject();
                viewModel.set('product_downloads.product_' + productId, downloadInfo);
            }

            var date = viewModel.get('product_config.option.product_option_' + data.item.attr('data-product-option-id'));
            //downloadInfo.set('date_code', page.formatTrackDate(date));
            
            // VESTHOOK
            //browser.getAvailableTracks(dataFolderAttribute.text, date);
        }
    }
}