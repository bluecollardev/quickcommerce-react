/**
 * Object: App.Utilities.Stack
 *
 * Basic queue (FIFO) implementation
 */
Queue: function () {
    var queue = Object.create({
        stack: [],
        
        init: function () {
            return this;
        },
        dequeue: function () {
            return this.stack.pop();
        },
        enqueue: function (item) {
            this.stack.unshift(item);
        }
    });
    
    return queue.init();
},