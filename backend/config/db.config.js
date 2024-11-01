const mongoose = require('mongoose')

const conn = () => {
    const mongo_url = 'mongodb://127.0.0.1:27017/chatapp'

    mongoose.connect(mongo_url)
    mongoose.connection.on('error', (er) => console.error(er))
    mongoose.connection.once('open', () => { console.log(`Connected to MongoDB`) })
}

module.exports = conn;