import React, { Component } from 'react'

export default class LanguageSwitcher extends Component {
    constructor(props) {
        super(props)
        
        this.onToggleClicked = this.onToggleClicked.bind(this)
        this.onLanguageSwitchClicked = this.onLanguageSwitchClicked.bind(this)
        this.onBlur = this.onBlur.bind(this)
        
        
        this.state = {
            open: false
        }
    }
    componentDidMount() {
        document.addEventListener('click', this.onBlur)
        
        let langSwitcher = $('.lang-switcher'),
			langToggle = $('.lang-toggle')
        
        langToggle.on('click', function() {
            $(this).parent().toggleClass('open')
        })
        langSwitcher.on('click', function(e) {
        e.stopPropagation()
        })
        $(document).on('click', function(e) {
            langSwitcher.removeClass('open')
        })
    }
    
    componentWillUnmount() {
        document.removeEventListener(this.onBlur)
    }
    
    onToggleClicked() {
        this.setState({
            open: !this.state.open
        })
    }
    
    onLanguageSwitchClicked(e) {
        e.stopPropagation()
    }
    
    onBlur() {
        this.setState({
            open: false
        })
    }
    
    render() {
        let open = this.state.open
        let className = (open) ? 'lang-switcher open' : 'lang-switcher'
        
        return (
            <div 
                className = {className}
                onClick = {this.onLanguageSwitchClicked}
                ref = {(lang) => this.langSwitcher = lang}>
                
              <div className="lang-toggle"
                ref = {(lang) => this.langToggle = lang}
                onClick = {this.onToggleClicked}>
                <img src="img/flags/GB.png" alt="English" />
                <i className="material-icons arrow_drop_down" />
                <ul className="lang-dropdown">
                  <li><a href="#"><img src="img/flags/FR.png" alt="French" />FR</a></li>
                  <li><a href="#"><img src="img/flags/DE.png" alt="German" />DE</a></li>
                  <li><a href="#"><img src="img/flags/IT.png" alt="Italian" />IT</a></li>
                </ul>
              </div>
              
            </div>
        )
    }
}