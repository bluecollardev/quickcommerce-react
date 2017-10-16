export default class CodeModal {
	render() {
		return (
			<Modal
			  show   = {!!this.state.code}
			  onHide = {this.hideCodeModal}>
				<Modal.Header>
					<Modal.Title>
						Enter code
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.state.code && (
						<div>
							<Alert bsStyle='warning'>
								Please enter the item code. <i className='fa fa-smile-o' />
							</Alert>
							<Button block onClick={this.hideCodeModal}>Ok</Button>
						</div>
					)}
				</Modal.Body>
			</Modal>
		)
	}
}