import assign from 'object-assign'

import OmniSearchConstants from '../constants/OmniSearchConstants.jsx'

import { normalize, denormalize, schema } from 'normalizr'

let result = new schema.Entity('data', {}, {
    // TODO: Allow for configurable key in constants, it's not always payload.data...
    //idAttribute: 'customer_id'
    idAttribute: 'userId'
})

export default (dispatcher) => {
    return {
        search: (params) => {
            dispatcher.dispatch({
                actionType: OmniSearchConstants.SEARCH_GENERIC,
                config: assign({}, {
                    key: 'customers',
                    src: {
                        transport: {
                            read: {
                                url: OmniSearchConstants.SEARCH_URI,
                                method: OmniSearchConstants.SEARCH_URI_METHOD,
                                dataType: 'json',
                                contentType: 'application/json',
                                data: params
                            }
                        }
                    },
                    //entityName: 'OcCustomer',
                    schema: {
                        customers: [result]
                    }
                })
            })
        }
    }
}
