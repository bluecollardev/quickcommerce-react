export default class ChargeModal {
	render() {
		return (
			<Modal
			  show   = {!!this.state.charge}
			  onHide = {this.hideChargeModal}>
				<Modal.Header>
					<Modal.Title>
						<span style={{ float: 'right', display: 'inline-block', marginTop: '5px' }}>Charge / Split</span>
						<span style={{ float: 'none' }} class='total-charge'>Total:<span style={{ display: 'inline-block', marginLeft: '1rem', fontSize: '1.5rem' }}>${orderTotal}</span></span>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<div>
							<div>
								<Alert bsStyle='danger'>
									<i className='fa fa-info' /> Please select a payment option below.
								</Alert>
							</div>

							<form>
								<FormGroup>
									<i className='fa fa-money' /> <ControlLabel>Choose Payment Type</ControlLabel>
									<br />
								</FormGroup>
								
								<FormGroup>
									{this.renderPaymentOptions()}
									<input type='hidden' name='hid_cash' />
								</FormGroup>

								<hr />
								
								{this.state.paymentCode === 'cash' && (
								<FormGroup>
									{this.renderCashOptions()}
									<input type='hidden' name='hid_cash' />
								</FormGroup>
								)}
								
								{this.state.paymentCode === 'cash' && this.state.customPaymentAmount && (
								<FormGroup>
									<i className='fa fa-dollar' /> <ControlLabel>Custom Amount</ControlLabel>
									<FormControl type='text' name='custom_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
								</FormGroup>
								)}
								
								{this.state.paymentCode === 'credit' && (
								<FormGroup>
									<i className='fa fa-credit-card' /> <ControlLabel>Credit Card</ControlLabel>
									<FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
									<input type='hidden' name='hid_card' />
								</FormGroup>
								)}
								
								{this.state.paymentCode === 'debit' && (
								<FormGroup>
									<i className='fa fa-credit-card' /> <ControlLabel>Debit Card</ControlLabel>
									<FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
									<input type='hidden' name='hid_debit' />
								</FormGroup>
								)}
								
								{this.state.paymentCode === 'cheque' && (
								<FormGroup>
									<i className='fa fa-money' /> <ControlLabel>Cheque / Money Order</ControlLabel>
									<FormControl type='text' name='cheque' placeholder='Reference Number' />
									<input type='hidden' name='hid_cheque' />
								</FormGroup>
								)}
								
								{this.state.paymentCode === 'cheque' && this.customerPaymentAmount && (
								<FormGroup>
									<i className='fa fa-dollar' /> <ControlLabel>Amount</ControlLabel>
									<FormControl type='text' name='cheque_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
								</FormGroup>
								)}
								
								{this.state.paymentCode === 'giftcard' && (
								<FormGroup>
									<i className='fa fa-gift' /> <ControlLabel>Gift Card</ControlLabel>
									<FormControl type='text' name='gift' placeholder='Card Number or Swipe' />
									<input type='hidden' name='hid_gift' />
								</FormGroup>
								)}
								
								{/* TODO: Check if is a valid method */}
								{this.state.paymentCode !== null && (
								<hr />
								)}

								<FormGroup>
									<Button bsStyle='success' block onClick={this.completeOrder}><h4><i className='fa fa-money' /> Process Payment</h4></Button>
								</FormGroup>
								<FormGroup>
									<Button bsStyle='default' block onClick={this.hideChargeModal}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
								</FormGroup>
							</form>
							
							<div className='receipt'
								style={{
									margin: '0 auto',
									maxWidth: '570px',
									boxSizing: 'border-box',
									padding: '18px',
									border: '1px solid black'
								}}>
								{this.renderReceipt()}
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		)
	}
}