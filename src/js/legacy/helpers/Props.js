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
}