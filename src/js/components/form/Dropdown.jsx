import React, { Component } from 'react'

import { Button, DropdownButton, SplitButton } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { MenuItem } from 'react-bootstrap'

const SelectList = (props) => {
	let items = props.items || []	
	return (
		<FormControl componentClass='select' {...props}>
			{items.map(item =>
			<option value={item.id}>{item.value}</option>
			)}
		</FormControl>
	)
}

const SelectButton = (props) => {
	let items = props.items || []
	if (props.mode === 'split') {
		return (
			<SplitButton title='Split Button' {...props}>
				{items.map(item =>
				<MenuItem eventKey={item.id}>{item.value}</MenuItem>
				)}
			</SplitButton>
		)
	} else {
		return (
			<DropdownButton title='Normal Button' {...props}>
				{items.map(item =>
				<MenuItem eventKey={item.id}>{item.value}</MenuItem>
				)}
			</DropdownButton>
		)
	}
}

// Dropdown lists
const ContactTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const IdTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const CustomerRelationDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const SalutationDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const SuffixDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const GenderDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const MaritalDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const ResidenceTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const EmploymentTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const IncomeTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const FrequencyDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const AssetTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const LiabilityTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const StreetTypeDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

const StreetDirDropdown = (props) => {
	return (
		<SelectList {...props} />
	)
}

// Dropdown buttons

const ContactTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const IdTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const CustomerRelationButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const SalutationButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const SuffixButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const GenderButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const MaritalButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const ResidenceTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const EmploymentTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const IncomeTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const FrequencyButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const AssetTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const LiabilityTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const StreetTypeButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

const StreetDirButton = (props) => {
	return (
		<SelectButton {...props} />
	)
}

export { 
	SelectList, SelectButton, 
	ContactTypeDropdown, IdTypeDropdown, CustomerRelationDropdown,
	SalutationDropdown, SuffixDropdown, GenderDropdown, MaritalDropdown,
	ResidenceTypeDropdown, EmploymentTypeDropdown, IncomeTypeDropdown,
	FrequencyDropdown, AssetTypeDropdown, LiabilityTypeDropdown,
	StreetTypeDropdown, StreetDirDropdown,
	ContactTypeButton, IdTypeButton, CustomerRelationButton,
	SalutationButton, SuffixButton, GenderButton, MaritalButton,
	ResidenceTypeButton, EmploymentTypeButton, IncomeTypeButton,
	FrequencyButton, AssetTypeButton, LiabilityTypeButton,
	StreetTypeButton, StreetDirButton
} 