const mongoose = require('mongoose')

const MessagesSchema = mongoose.Schema({
    sent_by: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type:  Date,
        required: true
    }
})

const Messages = mongoose.model('Messages', MessagesSchema)

module.exports = Messages