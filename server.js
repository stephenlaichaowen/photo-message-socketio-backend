const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')

const port = process.env.PORT || 5000

// Init server messages from disk
const messageData = fs.readFileSync(`${__dirname}/db.json`).toString()
const messages = messageData ? JSON.parse(messageData) : []

// Listen for new socket client (connection)
io.on('connection', socket => {

  // Send all messages to connecting client
  io.emit('all_messages', messages)
  
  // Listen for new messages
  socket.on('new_message', message => {
    // Add to messages
    messages.unshift(message)

    // Persist to disk
    fs.writeFileSync(`${__dirname}/db.json`, JSON.stringify(messages))

    // Broadcast new messages to all connected cients
    io.emit('all_messages', messages)

  })
})

http.listen(port, () => console.log(`Server started on port ${port}`))