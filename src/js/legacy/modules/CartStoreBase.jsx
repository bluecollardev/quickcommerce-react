import assign from 'object-assign'

import EventEmitter from 'events'

const CartStore = assign({}, EventEmitter.prototype, {
    items        : {},
    selection    : [],
    nextKey      : 0,

    init(config) {
        this.items        = config.items
        this.selection    = []
        config.selection.forEach(item => {
            item.quantity = Number(item.quantity)
            item._key     = this.nextKey++
            if (item.data) {
                this.items[item.id] = item.data
            } else {
                item.data = this.items[item.id]
            }
            if (!item.data) {
                throw 'Missing data for item \'' + item.id + '\'.'
            }
            this.selection.push(item)
            this.items[item.id]._initialQty = item.quantity
        })
        this.reIndex()
    },

    reIndex() {
        let i = 0
        this.selection.forEach(item => {
            item._index = i++
        })
    },

    getSelection() {
        return this.selection
    },

    isEmpty() {
        return !this.selection.length
    },

    getItem(index) {
        return this.selection[index]
    },

    addItem(item, quantity, data) {
        if (this.items.hasOwnProperty(item)) {
            data = this.items[item]
        } else {
            this.items[item] = data
        }
        for (let key in this.selection) {
            if (item === this.selection[key].id) {
                const oldQty = this.selection[key].quantity
                this.selection[key].quantity += Number(quantity)
                this.emit('change')
                this.emit('item-changed', this.items[item], this.selection[key].quantity, oldQty)
                return
            }
        }
        if (data) {
            this.selection.push({
                id       : item,
                quantity : Number(quantity),
                data     : data,
                _index   : this.selection.length,
                _key     : this.nextKey++
            })
            this.emit('change')
            this.emit('item-added', data)
        }
    },

    removeItem(index) {
        let id   = this.selection[index].id,
            item = this.selection.splice(index, 1)[0]
        this.reIndex()
        this.emit('change')
        this.emit('item-removed', this.items[id])
    },

    updateQuantity(index, quantity) {
        let item = this.selection[index]
        const oldQty = item.quantity
        item.quantity = Number(quantity)
        this.emit('change')
        this.emit('item-changed', this.items[item.id], quantity, oldQty)
    },

    reset() {
        this.selection = []
        this.emit('change')
    }

})

module.exports = CartStore