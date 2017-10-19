class PrintService {
	static renderPlainTxtOrder(checkout, notes) {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.prevCheckout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push('ORDER')
        headerLines.push(datetime.toString())

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('ITEMS')
        output.push('\n')

        // We need a max line chars algo so we can make stuff line up

        // Items
        items = []
        if (typeof checkout.items !== 'undefined' && 
            checkout.items instanceof Array) {
            items = checkout.items
        }
        
        for (let idx = 0; idx < items.length; idx++) {
            let line = [
                items[idx].quantity + ' x ',
                items[idx].data['model']
            ].join('  ')

            output.push(line)
            
            if (typeof items[idx].options !== 'undefined' && 
                items[idx].options instanceof Array && 
                items[idx].options.length > 0) {
                output = output.concat(PrintService.renderPlainTxtOptions(items[idx].options))
            }
        }
        
        if (typeof notes === 'string' && notes !== '') {
            output.push('\n')
            output.push('NOTES')
            output.push('\n')
            output.push(this.state.notes)
        }

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
    
    static renderPlainTxtReceipt(checkout, paymentMethod) {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.prevCheckout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push('ACE Coffee Roasters')
        headerLines.push('10055 - 80 Ave NW')
        headerLines.push('Edmonton, Alberta T6E 1T4')
        headerLines.push('780.244.0ACE')
        headerLines.push(datetime.toString())

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('Sale')
        output.push('\n')
        output.push('Qty        Item        Total')

        // We need a max line chars algo so we can make stuff line up

        // Items
        items = []
        if (typeof checkout.items !== 'undefined' && 
            checkout.items instanceof Array) {
            items = checkout.items
        }
        
        for (let idx = 0; idx < items.length; idx++) {
            let line = [
                items[idx].quantity + ' x ',
                items[idx].data['model'],
                '$' + (parseFloat(items[idx].data['price']) * items[idx].quantity).toFixed(2)
            ].join('  ')

            output.push(line)
        }

        output.push('\n')

        // Totals
        let totals = checkout.totals || []
        let total = checkout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue

            // Set the total title
            let subTotalTitle = ''
            switch (totals[idx].code) {
                case 'sub_total':
                    subTotalTitle = 'Sub-total'
                    break
                case 'total':
                    subTotalTitle = 'Total'
                    break
                default:
                    subTotalTitle = totals[idx].title
            }

            output.push(subTotalTitle + ': $' + parseFloat(totals[idx].value).toFixed(2))
        }

        if (total !== null) {
            // Final total
            // Set the total title
            let totalTitle = ''
            switch (total.code) {
                case 'sub_total':
                    totalTitle = 'Sub-total'
                    break
                case 'total':
                    totalTitle = 'Total'
                    break
                default:
                    totalTitle = total.title
            }

            output.push(totalTitle + ': $' + parseFloat(total.value).toFixed(2))
        }
        
        output.push('\n')
        output.push('Payment Method' + ': ' + paymentMethod)

        return output.join('\n') + '\n' 
        // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
    
    static renderPlainTxtOptions(selectedOptions) {
        let options = []
        
        for (let idx in selectedOptions) {
            options.push(selectedOptions[idx].data.option.name + ': ' + selectedOptions[idx].data.name)
            options.push('\n')
        }
        
        return options
    }

	static printReceipt() {
        // Send output as plain text string
        StarMicronicsStore.printReceipt(PrintService.renderPlainTxtReceipt())
    }
    
    static printOrder() {
        // Send output as plain text string
        StarMicronicsStore.printOrder(PrintService.renderPlainTxtOrder())
    }
    
    static printReport() {
        axios({
            url: QC_API + 'report/endofday',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data

            // Send output as plain text string
            StarMicronicsStore.printReport(PrintService.renderEndOfDayReport(payload))

        }).catch(err => {
            // Do nothing
        })
    }
    
    static renderEndOfDayReport(data) {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.checkout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push('ACE Coffee Roasters')
        headerLines.push('10055 - 80 Ave NW')
        headerLines.push('Edmonton, Alberta T6E 1T4')
        headerLines.push('780.244.0ACE')
        headerLines.push(datetime.toString())

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('End of Day Report')
        output.push('\n')
        output.push('Qty        Item        Total')

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = data['purchased_products']
        for (let idx = 0; idx < items.length; idx++) {
            let line = [
                items[idx]['quantity'] + ' x ',
                items[idx]['model'],
                '$' + (parseFloat(items[idx]['total']).toFixed(2))
            ].join('  ')

            output.push(line)
        }

        output.push('\n')

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
}