/*jshint esversion: 6 */

//imports
const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

//public path
const publicPath=path.join(__dirname,'../public');
//puerto para heroku o para default
const port=process.env.PORT||3000;

//Creates an Express application
let app=express();

let server=http.createServer(app);
let io=socketIO(server);

//middleware. serves static files
app.use(express.static(publicPath));

//registra un listener
//socket representa uan conexion deu n cliente
io.on('connection',(socket)=>{
    console.log('New user connected');

    socket.emit('newMessage',{
        from:'John',
        text:'Well, see yo then',
        createAt:123123
    });

    socket.emit('newEmail',{
        from:'bitoman@gmail.com',
        text:'Mensaje de email',
        createdAt:new Date()
    });

    socket.on('createMessage',(message)=>{
        console.log('createMessage',message);
    });

    socket.on('disconnect',()=>{
        console.log('User was disconnected');
    });
});

//Start de server
server.listen(port,()=>{
    console.log(`Server starting at ${port}`);
});





