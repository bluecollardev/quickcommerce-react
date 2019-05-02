/**
 * Object: App.Utilities.Stack
 *
 * Basic queue (FIFO) implementation
 */
export default () => {
    let queue = Object.create({
        stack: [],
        
        init: function () {
            return this
        },
        dequeue: function () {
            return this.stack.pop()
        },
        enqueue: function (item) {
            this.stack.unshift(item)
        }
    })
    
    return queue.init()
}