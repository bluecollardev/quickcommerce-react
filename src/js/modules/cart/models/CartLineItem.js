// @flow

import BaseModel from './BaseModel.js'

//import TaxDetailDto from '_app/domain/models/TaxDetailDto'
import CartItemLineItemDetail from './CartItemLineItemDetail.js'
import Money from './Money.js'

import mappings from '../mappings/CartLineItem.js'

class CartLineItem extends BaseModel {
  constructor(item, itemUnitAmount) {
    this[mappings.ITEM] = item
    this[mappings.ITEM_AMOUNT] = itemUnitAmount
  }

  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new CartLineItem()


      if (data.hasOwnProperty(mappings.ITEM)) {
        obj[mappings.ITEM] = CartItemLineItemDetail.constructFromObject(data[mappings.ITEM])
      }
      if (data.hasOwnProperty(mappings.ITEM_TYPE)) {
        obj[mappings.ITEM_TYPE] = BaseModel.convertToType(data[mappings.ITEM_TYPE], 'String')
      }
      if (data.hasOwnProperty(mappings.TAX_DETAIL)) {
        //obj[mappings.TAX_DETAIL] = TaxDetail.constructFromObject(data[mappings.TAX_DETAIL])
      }
      if (data.hasOwnProperty(mappings.TAX_DETAIL)) {
        obj[mappings.TAX_DETAIL] = Money.constructFromObject(data[mappings.TAX_DETAIL])
      }
      if (data.hasOwnProperty(mappings.QUANTITY) {
        obj[mappings.QUANTITY] = BaseModel.convertToType(data[mappings.QUANTITY], 'Number')
      }
      if (data.hasOwnProperty(mappings.ITEM_AMOUNT)) {
        obj[mappings.ITEM_AMOUNT] = Money.constructFromObject(data[mappings.ITEM_AMOUNT])
      }
      if (data.hasOwnProperty(mappings.TAX_DUE_AMOUNT)) {
        obj[mappings.TAX_DUE_AMOUNT] = Money.constructFromObject(data[mappings.TAX_DUE_AMOUNT])
      }
      if (data.hasOwnProperty(mappings.TOTAL_AMOUNT)) {
        obj[mappings.TOTAL_AMOUNT] = Money.constructFromObject(data[mappings.TOTAL_AMOUNT])
      }
    }
    return obj
  }

  [mappings.ITEM]: CartItemLineItemDetail = undefined
  [mappings.ITEM_TYPE]: String = undefined
  [mappings.TAX_DETAIL]: Money = undefined
  [mappings.QUANTITY]: Number = undefined
  //[mappings.TAX_DETAIL]: TaxDetail = undefined
  [mappings.TAX_DUE_AMOUNT]: Money = undefined
  [mappings.TOTAL_AMOUNT]: Money = undefined
}

export default CartLineItem

