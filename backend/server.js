const cors = require('cors')
const socket = require('socket.io')
const express = require('express')
const bcrypt = require('bcrypt')

const conn = require('./config/db.config');
const User = require('./models/user.model');
const Msg = require('./models/msg.model');

const app = express();
const _port = 3303;

conn();

app.use(express.json())
app.use(cors({ origin: "*", }))

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    try {

        let hashed_password = await bcrypt.hashSync(password, 10);

        let response = await User.create({
            name: name,
            email: email,
            password: hashed_password
        })

        res.json({ user: true, msg: "Signup Successful" })

    } catch (er) {
        console.error(er)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await User.findOne({ email: email})

        if (user) {
            let result = bcrypt.compareSync(password, user.password)

            if (result) {
                res.json({ user: true, data: { id: user._id, name: user.name, email: user.email }, msg: "Login Successful"})
            } else { res.json({ user: false, msg: "Incorrect email or password" }) }
            
        } else {
            res.json({ user: false, msg: "Incorrect email or password" })
        }
    } catch (er) {
        console.error(er)
    }
})

app.post('/users', async (req, res) => {

    const id = req.body.id;

    try {
        let users = await User.find({ "_id": { "$ne": id } })
        let newUsers = []

        users.filter((data, key) => {
            let newArr = { id: data._id, name: data.name, email: data.email }
            newUsers.push(newArr)
        })

        res.json({ data: newUsers })

    } catch (err) {
        console.error(err)
    }
})

app.post('/sendMsg', async (req, res) => {
    const { to, from, msg } = req.body

    try {
        await Msg.create({
            users: [to, from],
            from: from,
            msg: msg
        })

        res.json({ msg: true, msg: "Message sent successfully" })
    } catch (err) {
        console.error(err)
    }
})

app.post('/getMsgs', async (req, res) => {
    const { sender, receiver } = req.body

    try {

        const messages = await Msg.find({
            users: {
                $all: [sender, receiver],
            },
        }).sort({updatedAt: 1});

        res.json(messages)
    } catch(err) {
        console.error(err)
    }
})

app.use((req, res) => {
    res.status(404)
    res.type('text/plain')
    res.send('404 | Not Found')
})

const server = app.listen(_port, err => {
    console.log(`Server running on port localhost:${_port}`)
})

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true
    }
})

global.onlineUsers = new Map();

io.on('connection', (socket) => {

    socket.on('add-user', user_id => {
        console.log('User: ' + user_id + ' Connected')
        onlineUsers.set(user_id, socket.id)
    })

    socket.on('send-msg', data => {
        let receiver = onlineUsers.get(data.to)
        socket.to(receiver).emit('msg-received', {from: data.from, msg: data.msg})
    })

    socket.on('disconnect', (socket) => {
        console.log('disconnected')
    })
})