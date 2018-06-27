// @flow

import BaseModel from './BaseModel.js'

import Money from './Money.js'

import mappings from '../mappings/CartItemLineItemDetail.js'

class CartItemLineItemDetail extends BaseModel {
  constructor(name, targetAmount) {
    this[mappings.NAME] = name
    this[mappings.TARGET_AMOUNT] = targetAmount
  }

  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new GenericLineItemDto()

      if (data.hasOwnProperty(mappings.ID)) {
        obj[mappings.ID] = BaseModel.convertToType(data[mappings.ID], 'Number')
      }
      if (data.hasOwnProperty(mappings.MAX_FLAT)) {
        obj[mappings.MAX_FLAT] = Money.constructFromObject(data[mappings.MAX_FLAT])
      }
      if (data.hasOwnProperty(mappings.MIN_FLAT)) {
        obj[mappings.MIN_FLAT] = Money.constructFromObject(data[mappings.MIN_FLAT])
      }
      // If nominal flat is set, we need to set maxFlat and minFlat to the same value as nominalFlat
      if (data.hasOwnProperty(mappings.NOMINAL_FLAT)) {
        obj[mappings.NOMINAL_FLAT] = Money.constructFromObject(data[mappings.NOMINAL_FLAT])
      }
      if (data.hasOwnProperty(mappings.NAME)) {
        obj[mappings.NAME] = BaseModel.convertToType(data[mappings.NAME, 'String')
      }
      if (data.hasOwnProperty(mappings.READ_ONLY)) {
        obj[mappings.READ_ONLY] = BaseModel.convertToType(data[mappings.READ_ONLY], 'Boolean')
      }
      if (data.hasOwnProperty(mappings.TARGET_AMOUNT)) {
        obj[mappings.TARGET_AMOUNT] = Money.constructFromObject(data[mappings.TARGET_AMOUNT])
      }
    }
    return obj
  }

  id: Number = undefined
  maxFlat: Money = undefined
  minFlat: Money = undefined
  name: String = undefined
  nominalFlat: Money = undefined
  readOnly: Boolean = undefined
  targetAmount: Money = undefined
}

export default CartItemLineItemDetail

