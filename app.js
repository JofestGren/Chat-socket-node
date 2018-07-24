const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 3000
const io = require('socket.io')(http)
const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1'

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => io.emit('chat message', msg))
})

http.listen(port, () => console.log('Server start on port 300!'))