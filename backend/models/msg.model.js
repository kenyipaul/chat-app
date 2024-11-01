const mongoose = require('mongoose')

const Msg = mongoose.model("msgs", mongoose.Schema({
    from: { type: String, required: true },
    users: { type: Array, required: true },
    msg: { type: String, required: true }
}))

module.exports = Msg;