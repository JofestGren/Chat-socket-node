const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 3000
const io = require('socket.io')(http)
const mongoose = require('mongoose')
const mongoDB = 'mongodb://localhost:27017/socket-express-chat'
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection

const Schema = mongoose.Schema

const AccountUsersSchema = new Schema({
    // id: { type: Number, min: 18, max: 18, required: true },
    name: { type: String, required: true },
    password: { type: Number, required: true }
})

const AccountUsers = mongoose.model('AccountUsers', AccountUsersSchema)


db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/login', (req, res) => res.sendFile(__dirname + '/login.html'))

app.use('/public', express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => io.emit('chat message', msg))
    socket.on('login', (msg) => {
        // console.log(msg)
        // const newUser = new AccountUsers({name: msg.userName, password: msg.userPassword})
        // console.log('newUser', newUser)
        AccountUsers.findOne({name: new RegExp(msg.userName, 'i')}, (err, user) => {
            console.log(err, user)
            if (user === null) {
                const newUser = new AccountUsers({name: msg.userName, password: msg.userPassword})
                newUser.save((err, newUser) => {
                    if (err) return handleError(err)
                    console.log('saved newUser', newUser)
                })
                AccountUsers.find({}, (err, users) => {
                    console.log(err, users)
                })
            } else {
                io.emit('login', 'login is already taken')
                AccountUsers.find({}, (err, users) => {
                    console.log(err, users)
                })
            }
        })
        // newUser.save((err, newUser) => {
        //     if (err) return handleError(err)
        //     console.log('saved newUser', newUser)
        // })
        // AccountUsers.findById('5b59690881c82822f00d9780', (err, newUser) => {
        //     console.log('result', err, newUser)
        // })
    })
})

http.listen(port, () => console.log('Server start on port 300!'))