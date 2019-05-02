import React, { Component } from 'react'

import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

const DatePicker = (props) => {
    //return <input type='date' />
    return <FormControl type='date' {...props} />
}

const TimePicker = (props) => {
    //return <input type='time' />
    return <FormControl type='time' {...props} />
}

const DateInput = (props) => {
    return (
        <DatePicker {...props} />
    )
}

const DateTimeInput = (props) => {
    return (
        <DatePicker {...props} />
    )
}

const TimeInput = (props) => {
    return (
        <TimePicker {...props} />
    )
}

const NumericInput = (props) => {
    /*return (
        <input type='number' {...props} />
    )*/
    
    return (
        <FormControl type='number' {...props} />
    )
}

const TelephoneInput = (props) => {
    /*return (
        <input type='tel' {...props} />
    )*/
    
    return (
        <FormControl type='tel' {...props} />
    )
}

const EmailInput = (props) => {
    /*return (
        <input type='email' {...props} />
    )*/
    
    return (
        <FormControl type='email' {...props} />
    )
}

const PostalCodeInput = (props) => {
    /*return (
        <input type='text' {...props} />
    )*/
    
    return (
        <FormControl type='text' {...props} />
    )
}

const SinInput = (props) => {
    /*return (
        <input type='text' {...props} />
    )*/
    
    return (
        <FormControl type='number' {...props} />
    )
}

const SsnInput = (props) => {
    /*return (
        <input type='text' {...props} />
    )*/
    
    return (
        <FormControl type='number' {...props} />
    )
}

export { DateInput, DateTimeInput, TimeInput, NumericInput, TelephoneInput, EmailInput, PostalCodeInput, SinInput, SsnInput }