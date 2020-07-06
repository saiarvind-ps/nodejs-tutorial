var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http) //attach socket with http, can use socket like this only
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json()) //to make sure body is passsed in json and it is able to be read
app.use(bodyParser.urlencoded({ extended: false })) //because body from browser is url encoded

dbUrl = 'mongodb+srv://arvind:Password@cluster0.yfgpf.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {  //define a model 
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        if (err)
            sendStatus(500)

        console.log(req.body)
        io.emit('message', req.body)
        res.sendStatus(200)
    })
})

io.on('connection', (socket) => {
    console.log("User connected")
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log('mongodb connection ', err)
})

var server = http.listen(3000, () => {
    console.log('Server is listening on port ', server.address().port)
})