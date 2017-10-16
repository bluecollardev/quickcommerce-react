export default class QuantityModal() {
	<Modal
	  show   = {!!this.state.chooseQuantity}
	  onHide = {this.hideQuantity}>
		<Modal.Header>
			<Modal.Title>
				Enter Quantity
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{/*<Keyboard
				keyboardType='decimal-pad'
				onClear={this._handleClear.bind(this)}
				onDelete={this._handleDelete.bind(this)}
				onKeyPress={this._handleKeyPress.bind(this)}
			/>*/}
		</Modal.Body>
	</Modal>
}