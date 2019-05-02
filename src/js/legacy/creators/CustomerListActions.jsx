import assign from 'object-assign'

import CustomerListConstants from '../constants/CustomerListConstants.jsx'

import { normalize, denormalize, schema } from 'normalizr'

let data = []

let customer = new schema.Entity('data', {}, {
    idAttribute: 'customer_id'
})

export default (dispatcher) => {
    return {
        loadCustomers: () => {
            dispatcher.dispatch({
                actionType: CustomerListConstants.LOAD_CUSTOMERS,
                config: assign({}, {
                    key: 'customers',
                    src: {
                        transport: {
                            read: {
                                url: QC_RESOURCE_API + 'customer',
                                method: 'GET',
                                dataType: 'json',
                                contentType: 'application/json'
                            }
                        }
                    },
                    data: data, // Inject dummy data, just patch it in above if you want...
                    entityName: 'OcCustomer',
                    schema: {
                        customers: [customer]
                    }
                })
            })
        }
    }
}
