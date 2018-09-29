import DateHelper from 'qc-react/helpers/Date.js'

function convertToType(data, type) {
  if (data === null || data === undefined)
    return data

  switch (type) {
    case 'Boolean':
      return Boolean(data)
    case 'Integer':
      return parseInt(data, 10)
    case 'Number':
      return parseFloat(data)
    case 'String':
      return String(data)
    case 'Date':
      return DateHelper.parseDate(String(data))
    case 'Blob':
      return data
    default:
      if (type === Object) {
        // Generic object, return directly
        return data
      } else if (typeof type === 'function') {
        // For model type like: User
        return type.constructFromObject(data)
      } else if (Array.isArray(type)) {
        // For array type like: ['String']
        let itemType = type[0]

        return data.map((item) => {
          return convertToType(item, itemType)
        })
      } else if (typeof type === 'object') {
        // For plain object type like: {'String': 'Integer'}
        let keyType, valueType
        for (let k in type) {
          if (type.hasOwnProperty(k)) {
            keyType = k
            valueType = type[k]
            break
          }
        }

        let result = {}
        for (let k in data) {
          if (data.hasOwnProperty(k)) {
            let key = convertToType(k, keyType)
            let value = convertToType(data[k], valueType)
            result[key] = value
          }
        }

        return result
      } else {
        // For unknown type, return the data directly
        return data
      }
  }
}

function constructFromObject(data, obj, itemType) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data.hasOwnProperty(i))
        obj[i] = convertToType(data[i], itemType)
    }
  } else {
    for (let k in data) {
      if (data.hasOwnProperty(k))
        obj[k] = convertToType(data[k], itemType)
    }
  }
}

export { convertToType, constructFromObject }
