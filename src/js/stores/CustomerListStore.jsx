//import CustomerConstants from '../constants/CustomerConstants.jsx'

import BaseCollectionStore from './BaseCollectionStore.jsx'

class CustomerListStore extends BaseCollectionStore {
  constructor(dispatcher, stores) {
    super(dispatcher, stores)
  }

  // Abstract class don't register actions

  getAddressString(data) {
    data = data || null
    let formatted = ''

    let filterValue = function (value) {
      return (typeof value === 'string' && value !== null && value !== '') ? true : false
    }

    if (data !== null && data.hasOwnProperty('address_id')) {
      formatted = [
        [
          data.firstname,
          data.lastname
        ].join(' '),
        [data.company].filter((value) => {
          return filterValue(value)
        }).join(''),
        [
          data.address1,
          data.address2
        ].filter(function (value) {
          return filterValue(value)
        }).join('\n'),
        [
          data.city,
          data.zone
        ].join(', '),
        [
          data.country,
          data.postcode
        ].join(' ')
      ]

      formatted = formatted.filter((value) => {
        return filterValue(value)
      })

      formatted = formatted.join('\n')
    }

    return formatted
  }
}

CustomerListStore.customer = {
  customer_id: null,
  firstname: '',
  middlename: '',
  lastname: '',
  company_name: '',
  display_name: '',
  email: '',
  telephone: '',
  fax: '',
  address_id: null
}

CustomerListStore.billingAddressString = ''
CustomerListStore.billingAddress = {
  firstname: '',
  lastname: '',
  company: '',
  address1: '',
  address2: '',
  address_id: '',
  city: '',
  country: null,
  country_id: null,
  zone: null,
  zone_id: null,
  postcode: ''
}

CustomerListStore.shippingAddressString = ''
CustomerListStore.shippingAddress = {
  firstname: '',
  lastname: '',
  company: '',
  address1: '',
  address2: '',
  address_id: '',
  city: '',
  country: null,
  country_id: null,
  zone: null,
  zone_id: null,
  postcode: ''
}

export { CustomerListStore }
