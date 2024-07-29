const express = require('express')
const http = require('http')
const socket = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app);
const io = socket(server);


app.set('view engine','ejs')
app.use(express.static(path.join(__dirname ,'/public')));

io.on("connection",function(socket){
    socket.on("send-location",function (data){
        io.emit('receive',{id:socket.id,...data})
    })
    console.log("connected")

    socket.on('disconnect',function(socket){
        io.emit('user-disconnect',socket.id)
    })
})

app.get('/',(req,res)=>{
    res.render('index')
})

server.listen(3000)