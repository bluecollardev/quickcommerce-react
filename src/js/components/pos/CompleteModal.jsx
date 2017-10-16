export default class CompleteModal {
	render() {
		return (
			<Modal
			  show   = {!!this.state.complete}
			  onHide = {this.hideCompleteModal}>
				<Modal.Header>
					<Modal.Title>
						Transaction Complete!
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<div>
							<div>
								<Alert bsStyle='default'>
									<h2 style={{ textAlign: 'center', display: 'block' }}>${this.state.changeAmount} change</h2>
									<hr />
									<span style={{ textAlign: 'center', display: 'block' }}><b>Out of ${this.state.cashAmount} received</b></span>
									{/*<span style={{ textAlign: 'center', display: 'block' }}>How would you like your receipt?</span>*/}
								</Alert>
							</div>


							<form>
								<FormGroup>
									<Button block bsStyle='default' onClick={this.showReceiptModal}><h4><i className='fa fa-eye' /> View Receipt</h4></Button>
								</FormGroup>

								<FormGroup>
									<Button block bsStyle='default' onClick={this.printReceipt}><h4><i className='fa fa-print' /> Print Receipt</h4></Button>
								</FormGroup>

								<FormGroup>
									<Button block bsStyle='default' onClick={this.printOrder}><h4><i className='fa fa-clipboard' /> Re-print Order</h4></Button>
								</FormGroup>

								<FormGroup>
									<Button
									  block
									  style     = {{
										  width: '100%',
										  marginTop: '2rem'
									  }}
									  onClick = {this.openDrawer}
									  bsStyle = 'default'>
										<h4><i className='fa fa-external-link-square' /> Open Drawer</h4>
									</Button>
								</FormGroup>

								<FormGroup>
									<Button block bsStyle='success' onClick={this.onSaleComplete}><h4><i className='fa fa-check' /> Done (New Sale)</h4></Button>
								</FormGroup>

								<hr />

								{/*
								<h4>Other Options</h4>

								<hr />

								<FormGroup>
									<i className='fa fa-envelope-o' /> <ControlLabel>E-mail Receipt</ControlLabel>
									<FormControl type='text' name='email' placeholder='youraddress@domain.com' />
									<input type='hidden' name='send_email' />
								</FormGroup>

								<FormGroup>
									<Button block bsStyle='default' onClick={this.hideCompleteModal}><h4><i className='fa fa-envelope-o' /> Send E-mail</h4></Button>
								</FormGroup>

								<hr />

								<FormGroup>
									<i className='fa fa-comment' /> <ControlLabel>Text Receipt</ControlLabel>
									<FormControl type='text' name='text' placeholder='(123) 456 7890' />
									<input type='hidden' name='send_text' />
								</FormGroup>œ

								<FormGroup>
									<Button block bsStyle='default' onClick={this.hideCompleteModal}><h4><i className='fa fa-comment-o' /> Send Text</h4></Button>
								</FormGroup>

								<hr />

								<FormGroup>
									<i className='fa fa-ban' /> <ControlLabel>No Receipt</ControlLabel>
									<input type='hidden' name='send_nothing' />
								</FormGroup>
								*/}
							</form>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		)
	}
}