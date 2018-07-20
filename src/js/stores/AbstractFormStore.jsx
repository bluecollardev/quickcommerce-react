import assign from 'object-assign'
import { EventEmitter } from 'events'

import BaseCollectionStore from './BaseCollectionStore.jsx'

/**
 * Used by FormComponent / AbstractFormComponent, this class' primary
 * function is to provide a storage mechanism for subform references.
 */
class AbstractFormStore extends BaseCollectionStore {
  registerSubformInstance(subformKey, subformIdx) {
    subformIdx = !isNaN(subformIdx) ? subformIdx : null

    let subformRef = subformKey
    if (subformIdx !== null) {
      subformRef = [subformKey, subformIdx].join('_')
    }

    let isCollection = false

    let subform = this.retrieveItem(subformKey) || null

    if (subform !== null) {
      isCollection = (subform instanceof Array)
    }

    if (isCollection) {
      if (!(subform.indexOf(subformRef) > -1)) {
        subform.push(subformRef)
        this.setItem(subformKey, subform)
      }
    } else if (!isCollection) {
      // Subform key doesn't exist, add the entry
      if (subformIdx !== null) {
        this.setItem(subformKey, [subformRef])
      } else {
        this.setItem(subformKey, subformKey)
      }
    }

    return subformRef
  }

  /*removeSubformInstance(subformKey, propId, key) {
   let collection = []

   let subform = this.retrieveItem(subformKey)

   if (subform !== null) {
   collection = (subform instanceof Array) ? subform : collection
   }

   let matchIdx = collection.findIndex((item) => {
   return propId === item[key]
   })

   let removed = undefined
   if (matchIdx > -1) {
   // Entry exists, overwrite it
   removed = this.items[subformKey].splice(matchIdx, 1)
   }

   this.emitChange(removed)
   }

   removeSubformInstanceAtIndex(subformKey, index) {
   let collection = []

   let subform = this.retrieveItem(subformKey)

   if (subform !== null) {
   collection = (subform instanceof Array) ? subform : collection
   }

   let removed = null

   if (Number.isNaN(index)) return false // TODO: Also needs to check if number is an integer...

   if (this.items[subformKey] instanceof Array && collection.length > 0) {
   this.items[subformKey].splice(index, 1)
   this.emitChange(removed)
   }
   }*/
}

export default AbstractFormStore
