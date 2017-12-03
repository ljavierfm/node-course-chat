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
    socket.emit('newMessage',{
        from:'Admin',
        text:'Welcome to the chat app',
        createdAt: new Date().getTime()
    });

    //Admin sends new user Connect message to all users
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'A new user joined',
        createdAt:new Date().getTime()
    });

    //Se dispara cuando llega un evento desde un cliente tipo createMesage
    socket.on('createMessage',(message)=>{
        console.log('createMessage',message);

        //transmite un evento a cada una de las conexiones establecidas
        io.emit('newMessage',{
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime()
        });

        //Se transmite a todos menos al emisor
        /* socket.broadcast.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        }); */
    });

    socket.on('disconnect',()=>{
        console.log('User was disconnected');
    });
});

//Start de server
server.listen(port,()=>{
    console.log(`Server starting at ${port}`);
});





