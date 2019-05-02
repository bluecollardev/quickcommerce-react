import assign from 'object-assign'

import CustomerSearchConstants from '../constants/CustomerSearchConstants.jsx'
import CustomerListConstants from '../constants/CustomerListConstants.jsx'

import { normalize, denormalize, schema } from 'normalizr'

const key = 'customers'

const result = new schema.Entity('content', {
    //idAttribute: 'customer_id'
    idAttribute: 'customerId'
})

const schemaDef = {
    customers: [result]
}

export default (dispatcher) => {
    return {
        search: (params) => {
            dispatcher.dispatch({
                actionType: CustomerSearchConstants.SEARCH_CUSTOMERS,
                config: assign({}, {
                    key: key,
                    src: {
                        transport: {
                            read: {
                                url: CustomerSearchConstants.SEARCH_URI,
                                method: CustomerSearchConstants.SEARCH_URI_METHOD,
                                dataType: 'json',
                                contentType: 'application/json',
                                data: params
                            }
                        }
                    },
                    schema: schemaDef
                })
            })
        }
    }
}
