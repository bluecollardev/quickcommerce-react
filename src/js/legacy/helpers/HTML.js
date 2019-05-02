/**********************************************************
 * Namespace: QC.Helpers.Html
 **********************************************************/

export default class HtmlHelper {
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
    
    static decodeHtmlSpecialChars(text) {
        let entities = [
            ['amp', '&'],
            ['apos', '\''],
            ['#x27', '\''],
            ['#x2F', '/'],
            ['#39', '\''],
            ['#47', '/'],
            ['lt', '<'],
            ['gt', '>'],
            ['nbsp', ' '],
            ['quot', '"']
        ]

        for (var i = 0, max = entities.length; i < max; ++i)
            text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1])

        return text
    }
    
    static equalHeights(elements, resize) {
        let heights = []
        let idx = 0
        
        if (resize === true) {
            for (idx = 0; idx < elements.length; idx++) {
                elements[idx].style.height = 'auto';
            }
        }
        for (idx = 0; idx < elements.length; idx++) {
            let elementHeight = elements[idx].clientHeight
            heights.push(elementHeight)
        }
        
        for (idx = 0; idx < elements.length; idx++) {
            elements[idx].style.height = Math.max.apply(Math, heights) + 'px'
            if (resize === false) {
                elements[idx].className = elements[idx].className + ' show'
            }
        }
    }
}