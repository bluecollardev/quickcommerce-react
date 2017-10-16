export default class ReceiptModal {
	render() {
		return (
			<Modal
			  show   = {!!this.state.receipt}
			  onHide = {this.hideReceiptModal}>
				<Modal.Header>
					<Modal.Title>
						ACE Coffee Roasters
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.state.hasOwnProperty('prevCheckout') &&
					this.state.prevCheckout.hasOwnProperty('order') &&
					typeof this.state.prevCheckout.order !== 'undefined' && (
					<div className='receipt'
						style={{
							margin: '0 auto',
							maxWidth: '300px',
							boxSizing: 'border-box',
							padding: '18px',
							border: '1px solid black'
						}}>
						{this.renderCachedReceipt()}
					</div>
					)}
				</Modal.Body>
			</Modal>
		)
	}
}