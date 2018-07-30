const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectId

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
let db

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/login', (req, res) => res.sendFile(__dirname + '/login.html'))

app.use('/public', express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => io.emit('chat message', msg))
    socket.on('logup', (msg) => {
        db.collection('users').findOne({name: msg.userName}, (err, doc) => {
            if (err) {
                console.log(err)
                return io.emit('logup', 500)
            } else if (doc !== null) {
                io.emit('logup', 'name is already taken')
            } else {
                const user = {
                    name: msg.userName,
                    email: msg.userEmail,
                    password: msg.userPassword
                }

                db.collection('users').insert(user, (err, result) => {
                    if (err) {
                        return io.emit('logup', 500)
                    }
                    io.emit('logup', 'successful')
                })
            }
        })
    })
    socket.on('login', (msg) => {
        console.log(msg)
        db.collection('users').findOne({name: msg.userName, password: msg.userPassword}, (err, doc) => {
            console.log(doc)
            if (err) {
                console.log(err)
                return io.emit('logup', 500)
            } else if (doc === null) {
                io.emit('login', 'name is already taken')
            } else {
                io.emit('login', 'successful')
            }
        })
    })
})

MongoClient.connect('mongodb://localhost:27017/socket-express-chat', { useNewUrlParser: true }, (err, database) => {
    if (err) {
        return console.log(err)
    }
    db = database.db('socket-express-chat')
    http.listen(8080, () => {
        console.log('Server app started on port 8080!')
    })
})