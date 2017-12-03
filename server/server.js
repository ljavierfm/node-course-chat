/*jshint esversion: 6 */

/*
io.emit - sends to all connected users

socket.emit - sends to current connected user

socket.broadcast.emit - sends to all connected users but the initiator
*/

//imports
const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');
const { generateMessage, generateLocationMessage}=require('./utils/message');

//public path
const publicPath=path.join(__dirname,'../public');
//puerto para heroku o para default
const port=process.env.PORT||3000;

//Creates an Express application
const app=express();

const server=http.createServer(app);
const io=socketIO(server);

//middleware. serves static files
app.use(express.static(publicPath));

//Fired upon a connection from client
io.on('connection',(socket)=>{
    console.log('New user connected');

    //Admin text Welcome to the chat app
    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    //Admin sends new user Connect message to all users
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));

    //Se dispara cuando llega un evento desde un cliente tipo createMesage
    socket.on('createMessage',(message,callback)=>{
        console.log('createMessage',message);

        //transmite un evento a cada una de las conexiones establecidas
        io.emit('newMessage', generateMessage(message.from,message.text));

        callback('puto mensaje de texto');
    });

    //Se dispara cuando alguien envia localizacion
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
    });

    socket.on('disconnect',()=>{
        console.log('User was disconnected');
    });
});

//Start de server
server.listen(port,()=>{
    console.log(`Server starting at ${port}`);
});





