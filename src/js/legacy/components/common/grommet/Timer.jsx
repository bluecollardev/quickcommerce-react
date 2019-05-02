import React from 'react'
import { Input, Button } from 'react-bootstrap'

let output

const SetIntervalMixin = {
    componentWillMount() {
        this.intervals = []
    },

    componentWillUnmount() {
        this.intervals.map(clearInterval)
    },

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments))
    }
}

const renderTime = (offset) => {
    offset = offset || 0
    let currentTime = new Date()
    currentTime.setTime(currentTime.getTime() + offset)
    
    //let diem = 'AM'
    let y = currentTime.getFullYear()
    let m = currentTime.getMonth()
    let d = currentTime.getDate()
    let h = currentTime.getHours()
    let i = currentTime.getMinutes()
    let s = currentTime.getSeconds()

    /*if (h === 0) { 
        h = 12
    } else if (h > 12) {
        h = h - 12 diem = 'PM'
    }*/

    if (i < 10) {
        i = '0' + i
    }
    if (s < 10) {
        s = '0' + s
    }
    
    output = {
        year: y,
        month: m,
        date: d,
        hours: h,
        minutes: i,
        seconds: s
    }
    return output
}

const SystemTime = React.createClass({
    mixins: [SetIntervalMixin],
    getInitialState() {
        // Set the initial time
        return {
            start: renderTime(),
            offset: 0
        }
    },
    componentDidMount() {
        this.setInterval(this.tick, 1000)
    },
    onClick() {
        this.props.onClick()
        this.fastForward()
    },
    fastForward() {
        let date = new Date(
            this.state.year, 
            this.state.month, 
            this.state.date, 
            Number(this.state.hours), 
            Number(this.state.minutes), 
            Number(this.state.seconds))
            
        let offsetDate = new Date(date.getTime())
        offsetDate.setTime(offsetDate.getTime() + 1 * 60 * 60 * 1000 + this.state.offset)
        let diff = Math.abs(date - offsetDate)
        
        this.setState({
            offset: diff,
            year: output.year,
            month: output.month,
            date: output.date,
            hours: output.hours,
            minutes: output.minutes,
            seconds: output.seconds
        })
    },
    tick() {
        renderTime(this.state.offset) // Get the current time
        // Save the state
        this.setState({
            offset: this.state.offset,
            year: output.year,
            month: output.month,
            date: output.date,
            hours: output.hours,
            minutes: output.minutes,
            seconds: output.seconds
        })
    },
    render() {
        return ( 
            <Button 
              style = {{
                  width: '100%',
                  marginTop: '2rem'
              }}
              className = 'btn-default pull-left'
              onClick   = {this.onClick}
              bsStyle   = 'default'>
                <b>{this.state.hours}: {this.state.minutes}: {this.state.seconds} <span className = 'diem'> </span></b><br/>Click to Fast Forward
            </Button>
        )
    }
})

module.exports = SystemTime