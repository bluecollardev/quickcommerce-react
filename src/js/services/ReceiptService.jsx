class ReceiptService {
	renderReceipt(checkout, paymentMethod, notes, cached = true) {
        cached = cached || true
        let render = false
        
        if (checkout.hasOwnProperty('order') &&
            typeof checkout.order !== 'undefined') {
            render = true
        }
        
        if (!render) return
        
        let output = []

        // Build our receipt, line by line
        // Store info
        let store = checkout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>780.244.0ACE</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{datetime.toString()}</span>)

        output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

        output.push(<hr />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{[paymentMethod, 'Sale'].join(' ')}</h4></span>)
        output.push(<br />)
        //output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

        // We need a max line chars algo so we can make stuff line up

        // Items
        items = []
        if (typeof checkout.items !== 'undefined' && 
            checkout.items instanceof Array) {
            items = checkout.items
        }
        
        for (let idx = 0; idx < items.length; idx++) {
            let price = parseFloat(items[idx].data['price']).toFixed(2)
            let model = items[idx].data['model']
            if (typeof items[idx].options !== 'undefined' && 
                items[idx].options instanceof Array && 
                items[idx].options.length > 0) {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                            {this.renderOptions(items[idx].options)}
                        </span>
                    )
                } else {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                        </span>
                    )
                }
            
        }

        output.push(<br />)
        
        // Comments
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Order Notes</h4></span>)
        
        output.push(
            <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                <span style={{'font-size': '16px', 'font-weight': 'normal'}}>{notes}</span>
            </span>
        )
        
        output.push(<br />)

        // Totals
        let totals = checkout.totals || []
        let total = checkout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue // Ignore the final total OpenCart sux goat dick what a fucking dumb way to output totals!

            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    {totals[idx].title}
                    <span style={{'float': 'right'}}>${parseFloat(totals[idx].value).toFixed(2)}</span>
                </span>
            )
        }

        if (total !== null) {
            output.push(<br />)
            output.push(<hr />)

            // Final total
            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    <h4 style={{display: 'inline-block'}}>{total.title}</h4>
                    <span style={{'float': 'right', 'font-size': '18px', 'font-weight': 'bold'}}>${parseFloat(total.value).toFixed(2)}</span>
                </span>
            )
        }
        
        output.push(<br />)
        
        // Payment details
        output.push(
            <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                Payment Method
                <span style={{'float': 'right', 'font-size': '16px', 'font-weight': 'bold'}}>{paymentMethod}</span>
            </span>
        )

        return output
    }
    
    renderCachedReceipt(checkout, paymentMethod, notes, cached = true) {
        cached = cached || true
        let render = false
        
        if (checkout.hasOwnProperty('order') &&
            typeof checkout.order !== 'undefined') {
            render = true
        }
        
        if (!render) return
        
        let output = []

        // Build our receipt, line by line
        // Store info
        let store = checkout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>780.244.0ACE</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{datetime.toString()}</span>)

        output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

        output.push(<hr />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Sale</h4></span>)
        output.push(<br />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

        // We need a max line chars algo so we can make stuff line up

        // Items
        items = []
        if (typeof checkout.items !== 'undefined' && 
            checkout.items instanceof Array) {
            items = checkout.items
        }
        
        for (let idx = 0; idx < items.length; idx++) {
            let price = parseFloat(items[idx].data['price']).toFixed(2)
            let model = items[idx].data['model']
            if (typeof items[idx].options !== 'undefined' && 
                items[idx].options instanceof Array && 
                items[idx].options.length > 0) {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                            {this.renderOptions(items[idx].options)}
                        </span>
                    )
                } else {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                        </span>
                    )
                }
            
        }

        output.push(<br />)

        // Totals
        let totals = checkout.totals || []
        let total = checkout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue // Ignore the final total OpenCart sux goat dick what a fucking dumb way to output totals!

            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    {totals[idx].title}
                    <span style={{'float': 'right'}}>${parseFloat(totals[idx].value).toFixed(2)}</span>
                </span>
            )
        }

        if (total !== null) {
            output.push(<br />)
            output.push(<hr />)

            // Final total
            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    {total.title}
                    <span style={{'float': 'right', 'font-size': '18px', 'font-weight': 'bold'}}>${parseFloat(total.value).toFixed(2)}</span>
                </span>
            )
        }

        return output
    }
}
