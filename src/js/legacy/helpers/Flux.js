/**
 * Borrowed from Dan Abramov's redux library, I just changed the formatting
 * I could have added the redux as a node package, but:
 * 1) I'm using the mobx-react Provider and injector HoC's to handle React's context and dependency injection
 * 2) I have no plans to use redux for anything in this project, and having it as a dep is a misnomer
 * https://gist.github.com/gaearon/ffd88b0e4f00b22c3159
 *
 */
 
function mapValues(obj, fn) {
    return Object.keys(obj).reduce((result, key) => {
        result[key] = fn(obj[key], key)
        return result
    }, {})
}

function bindActionCreator(actionCreator, dispatcher) {
    return (...args) => dispatcher.dispatch(actionCreator(...args))
}

export default class FluxHelper {
    static bindActionCreators = (actionCreators, dispatcher) => {
        // Bind action creators
        return typeof actionCreators === 'function' ?
            bindActionCreator(actionCreators, dispatcher) : 
            mapValues(actionCreators, actionCreator => bindActionCreator(actionCreator, dispatcher))
    }
    
    /* Just an idea for now...
    static bindServices = (actionCreators, dispatch) => {
        return typeof actionCreators === 'function' ?
            bindActionCreator(actionCreators, dispatch) :
            mapValues(actionCreators, actionCreator =>
            bindActionCreator(actionCreator, dispatch)
        )
    }*/
}