import React, { Component } from 'react'

const DatePicker = () => {
	return <input type='date' />
}

const TimePicker = () => {
	return <input type='time' />
}

const DateInput = () => {
	return (
		<DatePicker />
	)
}

const DateTimeInput = () => {
	return (
		<DatePicker />
	)
}

const TimeInput = () => {
	return (
		<TimePicker />
	)
}

const NumericInput = () => {
	return (
		<input type='number' />
	)
}

const TelephoneInput = () => {
	return (
		<input type='tel' />
	)
}

const EmailInput = () => {
	return (
		<input type='email' />
	)
}

const PostalCodeInput = () => {
	return (
		<input type='text' />
	)
}

const SinNumberInput = () => {
	return (
		<input type='text' />
	)
}

const SsnInput = () => {
	return (
		<input type='text' />
	)
}

export { DateInput, DateTimeInput, TimeInput, NumericInput, TelephoneInput, EmailInput, PostalCodeInput, SinNumberInput, SsnInput }