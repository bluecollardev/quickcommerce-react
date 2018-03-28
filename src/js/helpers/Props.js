export default class Props {
  static pick = (props, fields) => {
    const has = (p) => props.hasOwnProperty(p)
    const obj = {}
    
    fields = fields || []
    fields.forEach((field) => {
      if (has(field))
        obj[field] = props[field]
    })

    return obj
  }
  
  static omit = (props, fields) => {
    const obj = {}
    Object.keys(props).forEach((p) => {
      if ((fields || []).indexOf(p) === -1) {
        obj[p] = props[p]
      }
    })

    return obj
  }

  static mergeProps (a, b, { ignore = [] } = {}) {
    b = Object.assign({}, b)

    ignore.forEach(prop => delete b[prop])
    const className = typeof b.className === 'string'
      ? b.className.split(' ')
      : b.className

    delete b.className

    if (a.className || className) {
      a.className = [].concat(
        typeof a.className === 'string'
          ? a.className.split(' ')
          : a.className
      ).concat(className)
        .filter(Boolean)
        .reduce((a, b) => a.indexOf(b) < 0 ? a.concat(b) : a, [])
        .join(' ')
    }

    return Object.assign({}, a, b)
  }
}
