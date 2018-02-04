export default class StringHelper {
  static decodeHtmlEntities(str) {
    let element = document.createElement('div')
        
    let decode = (str) => {
      if (str && typeof str === 'string') {
        // Strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
        element.innerHTML = str
        str = element.textContent
        element.textContent = ''
      }
            
      return str
    }
        
    return decode(str)
  }
    
  // TODO: Un-jQuery this
  /*static escapeHtml = (unsafe) => {
      return $('<div />').text(unsafe).html()
  }

  static unescapeHtml = (safe) => {
      return $('<div />').html(safe).text()
  }*/
    
  static capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  static hyphenize = (str) => {
    return str.replace(/[A-Z]/g, (str) => { 
      return '-' + str.toLowerCase()
    })
  }

  static underscore = (str) => {
    return str.replace(/[A-Z]/g, (str) => { 
      return '_' + str.toLowerCase()
    })
  }

  static camelize = (str) => {
    return str.replace(/[\s\-_]+(\w)/g, (str) => {
      return str.toUpperCase().replace(/[\s\-_]+/, '') 
    })
  }
    
  static swapSubstrings = (str, sub1, sub2) => {
    str = str.replace(new RegExp('(' + sub1 + '|' + sub2 + ')', 'g'), (match) => {
      return match === sub1 ? sub2 : sub1
    })
        
    return str
  }
    
  static escapeRegExp = (str) => {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
  }
    
  static shortenText = (str, maxLength) => {
    maxLength = maxLength || str.length
    let trimmed = str.substr(0, maxLength)
    return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')))
  }
    
  static toSentenceCase = (text) => {
    return text.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  static quoteIfNecessary = (text) => {
    if (text.indexOf(' ') !== -1) {
      text = '\'' + text + '\''
    }
    return text
  }

  static unquoteIfNecessary = (text) =>  {
    if ((text[0] === '\'' && text[text.length - 1] === '\'') ||
          (text[0] === '"' && text[text.length - 1] === '"')) {
      text = text.slice(1, text.length - 1)
    }
    return text
  }

  static stringIsInteger(str) {
    if (typeof value === 'undefined' || value === null) {
      return false
    }

    let n = Math.floor(Number(str))
    return String(n) === str && n >= 0
  }
}
