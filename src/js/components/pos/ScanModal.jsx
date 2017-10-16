export default class ScanModal {
	render() {
		return (
			<Modal
			  show   = {!!this.state.scan}
			  onHide = {this.hideScanModal}>
				<Modal.Header>
					<Modal.Title>
						Scan item
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.state.scan && (
						<div>
							<Alert bsStyle='warning'>
								Please scan your item. <i className='fa fa-barcode' />
							</Alert>
							<Button block onClick={this.hideScanModal}>Ok</Button>
						</div>
					)}
				</Modal.Body>
			</Modal>
		)
	}
}