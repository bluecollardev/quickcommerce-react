// @flow

import BaseModel from './BaseModel.js'

class Money extends BaseModel {
  constructor() {
    super()
  }

  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Money()

      if (data.hasOwnProperty('currency')) {
        obj['currency'] = BaseModel.convertToType(data['currency'], 'String')
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = BaseModel.convertToType(data['value'], 'Number')
      }
    }
    return obj
  }

  /*currency: String = undefined
  value: Number = undefined*/
}

Object.defineProperties(Money, {
  currency: { value: undefined },
  value: { value: undefined }
})

export default Money
