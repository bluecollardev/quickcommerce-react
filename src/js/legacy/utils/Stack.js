/**
 * Object: App.Utilities.Stack
 *
 * Basic stack (LIFO) implementation
 */
export default () => {
    var stack = Object.create({
        stack: [],
        
        init: function () {
            return this
        },
        pop: function () {
            return this.stack.pop()
        },
        push: function (item) {
            this.stack.push(item)
        }
    })
    
    return stack.init()
}