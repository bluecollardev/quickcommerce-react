class PrintService {
	renderPlainTxtOrder() {
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
        let items = this.state.prevCheckout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
            let line = [
                items[idx].quantity + ' x ',
                items[idx].data['model']
            ].join('  ')

            output.push(line)
            
            if (typeof items[idx].options !== 'undefined' && 
                items[idx].options instanceof Array && 
                items[idx].options.length > 0) {
                output = output.concat(this.renderPlainTxtOptions(items[idx].options))
            }
        }
        
        if (typeof this.state.notes === 'string' && this.state.notes !== '') {
            output.push('\n')
            output.push('NOTES')
            output.push('\n')
            output.push(this.state.notes)
        }

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
    
    renderPlainTxtReceipt() {
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
        let items = this.state.prevCheckout.items // Annoying that this returns an object but below in totals we get an array...
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
        let totals = this.state.prevCheckout.totals || []
        let total = this.state.prevCheckout.total || null

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
        output.push('Payment Method' + ': ' + this.state.paymentMethod)

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
    
    renderPlainTxtOptions(selectedOptions) {
        let options = []
        
        for (let idx in selectedOptions) {
            options.push(selectedOptions[idx].data.option.name + ': ' + selectedOptions[idx].data.name)
            options.push('\n')
        }
        
        return options
    }
	
	renderEndOfDayReport(data) {
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

	printReceipt() {
        // Send output as plain text string
        StarMicronicsStore.printReceipt(this.PrintService.renderPlainTxtReceipt())
    }
    
    printOrder() {
        // Send output as plain text string
        StarMicronicsStore.printOrder(this.PrintService.renderPlainTxtOrder())
    }
    
    printReport() {
        axios({
            url: QC_API + 'report/endofday',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data

            // Send output as plain text string
            StarMicronicsStore.printReport(this.renderEndOfDayReport(payload))

        }).catch(err => {
            // Do nothing
        })
    }
}